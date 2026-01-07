'use server'

import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)
const OFFICIAL_EMAIL = 'nisvaanthegenderdialogueofbhu@gmail.com'

console.log("Resend Config:", {
    hasKey: !!process.env.RESEND_API_KEY,
    keyPrefix: process.env.RESEND_API_KEY?.substring(0, 3) + "..."
})

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
        const { error } = await resend.emails.send({
            from: 'Nisvaan Website <onboarding@resend.dev>', // Use verified domain or default testing domain
            to: OFFICIAL_EMAIL,
            replyTo: email,
            subject: `New Membership Application: ${name}`,
            html: `
                <h1>New Membership Application</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <hr />
                <p><strong>College/School:</strong> ${college || 'N/A'}</p>
                <p><strong>Course:</strong> ${course || 'N/A'}</p>
                <p><strong>Year:</strong> ${year || 'N/A'}</p>
                <p><strong>Location:</strong> ${location || 'N/A'}</p>
                <hr />
                <p><strong>Area of Interest:</strong> ${interest}</p>
                <p><strong>Why join:</strong><br/>${message || 'N/A'}</p>
            `
        })

        if (error) {
            console.error("Resend Error:", error)
            return { success: false, message: "Failed to send application. Please try again." }
        }

        return { success: true, message: "Application submitted successfully! We will contact you soon." }

    } catch (e: any) {
        console.error("Email send failed:", e)
        return { success: false, message: "An error occurred. Please try again later." }
    }
}

export async function submitAnonymousFeedback(prevState: any, formData: FormData) {
    const message = formData.get('message')

    const validated = feedbackSchema.safeParse({ message })

    if (!validated.success) {
        return { success: false, message: "Please provide a valid message (min 5 chars)." }
    }

    try {
        const { error } = await resend.emails.send({
            from: 'Nisvaan Feedback <onboarding@resend.dev>',
            to: OFFICIAL_EMAIL,
            subject: `New Anonymous Feedback`,
            html: `
                <h1>Anonymous Feedback Received</h1>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
                    ${validated.data.message.replace(/\n/g, '<br>')}
                </blockquote>
                <p><em>This message was submitted anonymously via the website.</em></p>
            `
        })

        if (error) {
            console.error("Resend Feedback Error:", error)
            return { success: false, message: "Failed to send feedback." }
        }

        return { success: true, message: "Thank you for your feedback!" }

    } catch (e: any) {
        console.error("Feedback send failed:", e)
        return { success: false, message: "An error occurred." }
    }
}
