import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.13";

const SMTP_EMAIL = Deno.env.get("SMTP_EMAIL");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
    try {
        if (!SMTP_EMAIL || !SMTP_PASSWORD) {
            console.error("Missing SMTP credentials");
            return new Response(JSON.stringify({ error: "Server misconfiguration: Missing SMTP credentials" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const { event } = await req.json();

        // Fetch all user emails
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles?select=email,id`,
            {
                headers: {
                    apikey: SERVICE_KEY!,
                    Authorization: `Bearer ${SERVICE_KEY}`,
                },
            }
        );

        const users = await response.json();

        if (!users || users.length === 0) {
            console.log("No users found in profiles table.");
            return new Response(JSON.stringify({ message: "No users found" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        console.log(`Found ${users.length} users. Preparing SMTP transport for ${SMTP_EMAIL}...`);

        // Create SMTP Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_PASSWORD
            }
        });

        // Verify connection
        await transporter.verify();
        console.log("SMTP Connection verified.");

        let sentCount = 0;
        let errors: any[] = [];

        // Send emails in parallel chunks to speed up but not overwhelm
        // For simplicity in this free tier context, we'll do sequential or small batch
        // Gmail limit is 500/day.

        for (const user of users) {
            if (!user.email) {
                continue;
            }

            const htmlContent = `
 <!DOCTYPE html>
 <html>
 <head>
     <meta charset="utf-8">
     <title>New Event from Nisvaan</title>
     <style>
         body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; line-height: 1.6; color: #333; }
         .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
         .header { background-color: #1a1a1a; padding: 30px; text-align: center; }
         .header h1 { margin: 0; color: #ffffff; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: 1px; }
         .hero-image { width: 100%; height: auto; display: block; background-color: #f3f4f6; }
         .content { padding: 40px 30px; }
         .tag { display: inline-block; background-color: #f3f4f6; color: #4b5563; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.5px; }
         h2 { margin-top: 0; font-size: 24px; color: #111827; }
         .meta { margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #000; }
         .meta p { margin: 4px 0; font-size: 14px; color: #4b5563; }
         .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
         .button { display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
     </style>
 </head>
 <body>
     <div class="container">
         <div class="header">
             <h1>NISVAAN</h1>
         </div>
         
         ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" class="hero-image" />` : ''}
         
         <div class="content">
             <span class="tag">Upcoming Event</span>
             <h2>${event.title}</h2>
             
             <div class="meta">
                 <p><strong>📅 Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                 <p><strong>📍 Location:</strong> On Campus</p>
             </div>
 
             <p>${event.description}</p>
 
             <br/>
             <p>We'd love to see you there!</p>
             <p><em>Warmly,<br/>The Nisvaan Team at BHU</em></p>
 
             <div style="text-align: center;">
                 <a href="${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '') || '#'}" class="button">View Event Details</a>
             </div>
         </div>
 
         <div class="footer">
             <p>&copy; ${new Date().getFullYear()} Nisvaan Society. All rights reserved.</p>
             <p>Banaras Hindu University</p>
         </div>
     </div>
 </body>
 </html>
             `;

            try {
                const info = await transporter.sendMail({
                    from: `"Nisvaan Society" <${SMTP_EMAIL}>`, // Sender address
                    to: user.email,
                    subject: `You're invited: ${event.title}`,
                    html: htmlContent,
                });

                console.log(`Sent to ${user.email}: ${info.messageId}`);
                sentCount++;

            } catch (e: any) {
                console.error(`Failed to send to ${user.email}:`, e);
                errors.push({ email: user.email, error: e.message });
            }
        }

        return new Response(JSON.stringify({
            message: "Broadcast complete",
            usersFound: users.length,
            sent: sentCount,
            errors: errors
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("Critical Function Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
});