"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Instagram, Linkedin, Send } from "lucide-react"

const teamMembers = [
  {
    name: "Ananya Mishra",
    role: "President",
    bio: "Passionate about creating inclusive spaces for meaningful dialogue on gender equality.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    social: { instagram: "#", linkedin: "#" },
  },
  {
    name: "Rohit Kumar",
    role: "Vice President",
    bio: "Believes in the power of education and dialogue to transform perspectives.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    social: { instagram: "#", linkedin: "#" },
  },
  {
    name: "Priya Sharma",
    role: "Secretary",
    bio: "Dedicated to organizing events that spark conversations and build community.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    social: { instagram: "#", linkedin: "#" },
  },
  {
    name: "Arjun Verma",
    role: "Treasurer",
    bio: "Committed to ensuring resources are used effectively to further our mission.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    social: { instagram: "#", linkedin: "#" },
  },
  {
    name: "Kavya Singh",
    role: "Content Lead",
    bio: "Creative storyteller focused on amplifying diverse voices through our platform.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    social: { instagram: "#", linkedin: "#" },
  },
  {
    name: "Vikram Patel",
    role: "Events Coordinator",
    bio: "Expert at bringing people together for impactful workshops and seminars.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    social: { instagram: "#", linkedin: "#" },
  },
]

export default function TeamPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your message! We'll get back to you soon.")
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-mauve/20 via-background to-lavender/10" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-mauve/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-lavender/15 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6">
              Meet Our <span className="text-primary">Team</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind Nisvaan who work tirelessly to create spaces for dialogue and change.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group text-center"
              >
                <div className="relative mb-6 mx-auto w-48 h-48">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-lavender/30 group-hover:scale-105 transition-transform duration-300" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full rounded-full object-cover border-4 border-card"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4 max-w-xs mx-auto">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href={member.social.instagram}
                    className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    aria-label={`${member.name}'s Instagram`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                Have questions, suggestions, or want to collaborate? We&apos;d love to hear from you. Reach out to us through the form or contact us directly.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:nisvaanthegenderdialogueofbhu@gmail.com" className="text-foreground hover:text-primary transition-colors">
                      nisvaanthegenderdialogueofbhu@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Instagram className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                    <a href="https://instagram.com/nisvaan_bhu" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                      @nisvaan_bhu
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-8 rounded-2xl bg-card border border-border">
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-6">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
              Want to Join the Team?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for passionate individuals who share our vision. If you want to contribute your skills and be part of something meaningful, we&apos;d love to have you.
            </p>
            <a
              href="/join"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300"
            >
              Apply to Join
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
