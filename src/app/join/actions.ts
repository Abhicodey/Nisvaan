'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

// Schema for Membership Application
const membershipSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    college: z.string().optional(),
    course: z.string().optional(),
    year: z.string().optional(),
    location: z.string().optional(),
    interest: z.string().min(1, "Please select an area of interest"),
    message: z.string().optional()
})

// Schema for Anonymous Feedback
const feedbackSchema = z.object({
    message: z.string().min(5, "Message must be at least 5 characters")
})

export async function submitMembershipApplication(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        college: formData.get('college'),
        course: formData.get('course'),
        year: formData.get('year'),
        location: formData.get('location'),
        interest: formData.get('interest'),
        message: formData.get('message'),
    }

    const validatedFields = membershipSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Please check your inputs.",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { name, email, phone, college, course, year, location, interest, message } = validatedFields.data

    try {
        const supabase = await createClient()

        console.log("Invoking 'send-email' for Membership Application...")

        const { data, error } = await supabase.functions.invoke('send-email', {
            body: {
                type: 'join_application',
                name,
                email,
                phone,
                college,
                course,
                year,
                location,
                interest,
                reason: message
            }
        })

        if (error) {
            console.error("Function Invocation Error:", error)
            return { success: false, message: "Failed to send application. Please try again." }
        }

        if (!data?.success) {
            console.error("Function Returned Fail:", data?.error || "Unknown error")
            return { success: false, message: `Server error: ${data?.error || "Failed to send email"}` }
        }

        return { success: true, message: "Application submitted successfully! We will contact you soon." }

    } catch (e: any) {
        console.error("Action error:", e)
        return { success: false, message: "An unexpected error occurred." }
    }
}

export async function submitAnonymousFeedback(prevState: any, formData: FormData) {
    const message = formData.get('message')

    const validated = feedbackSchema.safeParse({ message })

    if (!validated.success) {
        return { success: false, message: "Please provide a valid message (min 5 chars)." }
    }

    try {
        const supabase = await createClient()

        console.log("Invoking 'send-email' for Anonymous Feedback...")

        const { data, error } = await supabase.functions.invoke('send-email', {
            body: {
                type: 'anonymous_message',
                message: validated.data.message
            }
        })

        if (error) {
            console.error("Function Invocation Error:", error)
            return { success: false, message: "Failed to send feedback." }
        }

        if (!data?.success) {
            console.error("Function Returned Fail:", data?.error || "Unknown error")
            return { success: false, message: `Server error: ${data?.error || "Failed to send feedback"}` }
        }

        return { success: true, message: "Thank you for your feedback!" }

    } catch (e: any) {
        console.error("Action error:", e)
        return { success: false, message: "An error occurred." }
    }
}
