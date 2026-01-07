import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from "npm:nodemailer@6.9.10"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
    type: 'join_application' | 'anonymous_message'
    name?: string
    email?: string
    phone?: string
    college?: string
    course?: string
    year?: string
    location?: string
    interest?: string
    reason?: string
    message?: string
    background?: string
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: EmailRequest = await req.json()
        const { type } = payload

        // Validate Secrets
        const SMTP_HOST = Deno.env.get('SMTP_HOST')
        const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587')
        const SMTP_USER = Deno.env.get('SMTP_USER')
        const SMTP_PASS = Deno.env.get('SMTP_PASS')
        const TO_EMAIL = Deno.env.get('TO_EMAIL') || 'nisvaanthegenderdialogueofbhu@gmail.com'

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            throw new Error('Missing SMTP configuration')
        }

        // Create Transporter
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        })

        let subject = ''
        let html = ''
        let replyTo = undefined

        if (type === 'join_application') {
            subject = `New Join Application – Nisvaan`
            replyTo = payload.email
            html = `
        <h1>New Membership Application</h1>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Phone:</strong> ${payload.phone || 'N/A'}</p>
        <hr />
        <p><strong>College/School:</strong> ${payload.college || 'N/A'}</p>
        <p><strong>Course:</strong> ${payload.course || 'N/A'}</p>
        <p><strong>Year:</strong> ${payload.year || 'N/A'}</p>
        <p><strong>Location:</strong> ${payload.location || 'N/A'}</p>
        <hr />
        <p><strong>Area of Interest:</strong> ${payload.interest || 'N/A'}</p>
        <p><strong>Reason for Joining:</strong><br/>${payload.reason || 'N/A'}</p>
      `
        } else if (type === 'anonymous_message') {
            subject = `New Anonymous Message – Nisvaan`
            html = `
        <h1>Anonymous Feedback Received</h1>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
          ${(payload.message || '').replace(/\n/g, '<br>')}
        </blockquote>
        <p><em>This message was submitted anonymously via the website.</em></p>
      `
        } else {
            throw new Error('Invalid email type')
        }

        // Send Email
        const info = await transporter.sendMail({
            from: `"Nisvaan Website" <${SMTP_USER}>`,
            to: TO_EMAIL,
            replyTo: replyTo,
            subject: subject,
            html: html,
        })

        console.log("Message sent: %s", info.messageId)

        return new Response(
            JSON.stringify({ success: true, message: 'Email sent successfully', messageId: info.messageId }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error: any) {
        console.error("Error sending email:", error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            }
        )
    }
})
