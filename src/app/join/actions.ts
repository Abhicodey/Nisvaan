'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

// Schema for Membership Application
const membershipSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits").optional().or(z.literal("")),
    dob: z.string().min(1, "Date of birth is required"),
    education_status: z.enum(["school", "college"]),
    college: z.string().min(2, "School/College name is required"),
    course: z.string().optional(),
    year: z.string().optional(),
    state: z.string().min(2, "State is required"),
    area: z.string().min(2, "Area/City is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
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
        dob: formData.get('dob'),
        education_status: formData.get('education_status'),
        college: formData.get('college'),
        course: formData.get('course'),
        year: formData.get('year'),
        state: formData.get('state'),
        area: formData.get('area'),
        pincode: formData.get('pincode'),
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

    const data = validatedFields.data

    try {
        const supabase = await createClient()

        console.log("Invoking 'send-email' for Membership Application...")

        const { data: funcData, error } = await supabase.functions.invoke('send-email', {
            body: {
                type: 'join_application',
                ...data,
                reason: data.message // Map message to reason for template compatibility
            }
        })

        if (error) {
            console.error("Function Invocation Error DETAILS:", JSON.stringify(error, null, 2))
            if (error.status === 404) {
                return { success: false, message: "Server Error: Email service not found (Did you deploy the function?)" }
            }
            return { success: false, message: `Failed to send application: ${error.message}` }
        }

        if (!funcData?.success) {
            console.error("Function Returned Fail:", funcData?.error || "Unknown error")
            return { success: false, message: `Server error: ${funcData?.error || "Failed to send email"}` }
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
            console.error("Function Invocation Error DETAILS:", JSON.stringify(error, null, 2))
            // Check for common errors
            if (error.status === 404) {
                return { success: false, message: "Server Error: Email service not found (Did you deploy the function?)" }
            }
            return { success: false, message: `Failed to send feedback: ${error.message}` }
        }

        if (!data?.success) {
            console.error("Function Returned Fail:", data?.error || "Unknown error")
            return { success: false, message: `Server error: ${data?.error || "Failed to send email"}` }
        }

        return { success: true, message: "Thank you for your feedback!" }

    } catch (e: any) {
        console.error("Action error:", e)
        return { success: false, message: "An error occurred." }
    }
}
