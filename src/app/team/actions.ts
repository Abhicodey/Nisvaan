'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

// Schema for Contact Form
const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(5, "Message must be at least 5 characters")
})

export async function submitContactForm(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    }

    const validatedFields = contactSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Please check your inputs.",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { name, email, message } = validatedFields.data

    try {
        const supabase = await createClient()

        console.log("Invoking 'send-email' for Contact Message...")

        const { data, error } = await supabase.functions.invoke('send-email', {
            body: {
                type: 'contact_message',
                name,
                email,
                message
            }
        })

        if (error) {
            console.error("Function Invocation Error DETAILS:", JSON.stringify(error, null, 2))
            if (error.status === 404) {
                return { success: false, message: "Server Error: Email service not found (Did you deploy the function?)" }
            }
            return { success: false, message: `Failed to send message: ${error.message}` }
        }

        if (!data?.success) {
            console.error("Function Returned Fail:", data?.error || "Unknown error")
            return { success: false, message: `Server error: ${data?.error || "Failed to send email"}` }
        }

        return { success: true, message: "Message sent successfully! We'll get back to you soon." }

    } catch (e: any) {
        console.error("Action error:", e)
        return { success: false, message: "An unexpected error occurred." }
    }
}
