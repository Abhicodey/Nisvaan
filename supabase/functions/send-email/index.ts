import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from "npm:nodemailer@6.9.10"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
    type: 'join_application' | 'anonymous_message' | 'contact_message'
    name?: string
    email?: string
    phone?: string
    dob?: string
    education_status?: 'school' | 'college'
    college?: string
    year?: string
    course?: string
    state?: string
    area?: string
    pincode?: string
    interest?: string
    reason?: string
    message?: string
}

// SHARED STYLES
const EMAIL_STYLES = `
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f6f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #2c3e50; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
    .content { padding: 32px; }
    .field { margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    .field:last-child { border-bottom: none; }
    .label { font-size: 12px; text-transform: uppercase; color: #666; font-weight: 700; margin-bottom: 4px; display: block; }
    .value { font-size: 16px; color: #111; font-weight: 500; }
    .highlight { background-color: #fbfbfb; padding: 16px; border-left: 4px solid #e67e22; border-radius: 4px; margin-top: 8px; }
    .footer { background-color: #f8f9fa; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eaeaea; }
`

const renderTemplate = (title: string, contentHtml: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>${EMAIL_STYLES}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            ${contentHtml}
        </div>
        <div class="footer">
            <p>Sent via Nisvaan Website • ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
`

const fieldHtml = (label: string, value: string | undefined) => value ? `
<div class="field">
    <span class="label">${label}</span>
    <div class="value">${value}</div>
</div>
` : ''

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: EmailRequest = await req.json()
        const { type } = payload

        // Validate Secrets
        const SMTP_HOST = (Deno.env.get('SMTP_HOST') || '').trim()
        const SMTP_PORT = parseInt((Deno.env.get('SMTP_PORT') || '587').trim())
        const SMTP_USER = (Deno.env.get('SMTP_USER') || '').trim()
        const rawPass = Deno.env.get('SMTP_PASS') || Deno.env.get('SMTP_PASSWORD')
        const SMTP_PASS = (rawPass || '').trim()
        const TO_EMAIL = (Deno.env.get('TO_EMAIL') || 'nisvaanthegenderdialogueofbhu@gmail.com').trim()

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            throw new Error('SMTP credentials missing (Check SMTP_HOST, SMTP_USER, SMTP_PASS)')
        }

        // Create Transporter
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        })

        let subject = ''
        let html = ''
        let replyTo = payload.email

        if (type === 'join_application') {
            subject = `New Member Application: ${payload.name}`
            html = renderTemplate('Membership Application', `
                ${fieldHtml('Full Name', payload.name)}
                ${fieldHtml('Email', payload.email)}
                ${fieldHtml('Phone', payload.phone)}
                ${fieldHtml('Date of Birth', payload.dob)}
                
                <div style="margin: 20px 0; border-top: 2px dashed #eee;"></div>
                
                ${fieldHtml('Education Status', payload.education_status === 'college' ? 'University / College' : 'School')}
                ${fieldHtml('Institution', payload.college)}
                ${fieldHtml('Course / Grade', payload.course)}
                ${fieldHtml('Year', payload.year)}
                
                <div style="margin: 20px 0; border-top: 2px dashed #eee;"></div>

                ${fieldHtml('State', payload.state)}
                ${fieldHtml('Area / City', payload.area)}
                ${fieldHtml('Pincode', payload.pincode)}
                
                <div style="margin: 20px 0; border-top: 2px dashed #eee;"></div>

                ${fieldHtml('Fields of Interest', payload.interest)}
                
                <div class="field">
                    <span class="label">Reason for Joining / About</span>
                    <div class="highlight">${payload.reason || 'No reason provided.'}</div>
                </div>
            `)
        } else if (type === 'anonymous_message') {
            subject = `Anonymous Feedback Received`
            replyTo = undefined // No reply for anonymous
            html = renderTemplate('Anonymous Feedback', `
                <div class="highlight" style="font-size: 18px; line-height: 1.6;">
                    ${(payload.message || '').replace(/\n/g, '<br>')}
                </div>
                <p style="margin-top: 20px; color: #666; font-size: 13px;">This message was submitted anonymously via the Nisvaan website. The sender's identity is not recorded.</p>
            `)
        } else if (type === 'contact_message') {
            subject = `Contact: ${payload.name}`
            html = renderTemplate('New Contact Message', `
                ${fieldHtml('Name', payload.name)}
                ${fieldHtml('Email', payload.email)}
                
                <div class="field">
                    <span class="label">Message</span>
                    <div class="highlight">${(payload.message || '').replace(/\n/g, '<br>')}</div>
                </div>
            `)
        } else {
            throw new Error('Invalid email type')
        }

        // Send Email
        const info = await transporter.sendMail({
            from: `"Nisvaan System" <${SMTP_USER}>`,
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
                status: 200,
            }
        )
    }
})
