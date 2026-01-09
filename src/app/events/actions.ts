'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    date: z.string().min(1, "Date is required"),
    location: z.string().min(2, "Location is required"),
    imageUrls: z.array(z.string()).optional(),
})

export async function createEvent(prevState: any, formData: FormData) {
    // Parse imageUrls from JSON string if sent that way, or extract multiple keys
    // We'll assume frontend sends a JSON string of URLs for simplicity in one field
    let imageUrls: string[] = []
    try {
        const urlsStr = formData.get('imageUrls') as string
        if (urlsStr) imageUrls = JSON.parse(urlsStr)
    } catch (e) {
        console.error("Failed to parse image URLs", e)
    }

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        location: formData.get('location'),
        imageUrls: imageUrls,
    }

    const validatedFields = eventSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please check your inputs."
        }
    }

    const { title, description, date, location, imageUrls: validImageUrls } = validatedFields.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Unauthorized" }
    }

    // Check Role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || (profile.role !== 'president' && profile.role !== 'media_manager')) {
        return { success: false, message: "Insufficient permissions to create events." }
    }

    const { data: eventData, error } = await supabase.from('events').insert({
        title,
        description,
        date,
        location,
        image_urls: validImageUrls || [],
        created_by: user.id
    }).select().single()

    if (error) {
        console.error("Create Event Error:", error)
        return { success: false, message: "Failed to create event." }
    }

    const eventType = formData.get('eventType')

    // Trigger Email Notification (Only for upcoming events)
    if (eventType === 'upcoming' && eventData) {
        try {
            const emailRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-event-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    event: {
                        title,
                        description,
                        date,
                        image_url: validImageUrls?.[0]
                    }
                })
            })

            if (emailRes.ok) {
                // Mark notification as sent
                await supabase
                    .from('events')
                    .update({ notification_sent: true })
                    .eq('id', eventData.id)
                    .select()
                    .single() // Confirm update
            } else {
                console.error("Email function failed", await emailRes.text())
            }

        } catch (err) {
            // Non-blocking error
            console.error("Failed to trigger email notification:", err)
        }
    }

    // Trigger Push Notifications (For both types, or just upcoming)
    if (eventData) {
        try {
            await import('@/app/notifications/actions').then(({ sendNotificationToAll }) => {
                const isUpcoming = eventType === 'upcoming'
                sendNotificationToAll({
                    title: isUpcoming ? `New Event: ${title}` : `New Gallery: ${title}`,
                    body: isUpcoming
                        ? `Join us on ${new Date(date as string).toLocaleDateString()} at ${location}`
                        : `Check out highlights from our recent event!`,
                    url: `/events/${eventData.id}`
                })
            })
        } catch (error) {
            console.error("Failed to send push notifications:", error)
        }
    }

    revalidatePath('/events')
    return { success: true, message: "Event created successfully!" }
}

export async function uploadEventImages(formData: FormData) {
    const files = formData.getAll('files') as File[]
    if (!files || files.length === 0) return { success: false, message: "No files provided" }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: "Unauthorized" }

    // Check Role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || (profile.role !== 'president' && profile.role !== 'media_manager')) {
        return { success: false, message: "Insufficient permissions." }
    }

    try {
        const uploadPromises = files.map(async (file) => {
            const fileExt = file.name.split('.').pop()
            const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to 'event-media' bucket
            const { error: uploadError } = await supabase.storage
                .from('event-media')
                .upload(filePath, file, {
                    contentType: file.type,
                    upsert: true
                })

            if (uploadError) {
                console.error("Storage upload failed for " + file.name, uploadError)
                throw new Error("Failed to upload " + file.name)
            }

            const { data: { publicUrl } } = supabase.storage
                .from('event-media')
                .getPublicUrl(filePath)

            return publicUrl
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        return { success: true, urls: uploadedUrls }

    } catch (e: any) {
        console.error("Upload error:", e)
        return { success: false, message: e.message || "One or more uploads failed" }
    }
}
