"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Instagram, MessageCircle, Mail, Send, Users, Heart, Sparkles, MessageSquare, Linkedin, Loader2 } from "lucide-react"
import { submitMembershipApplication, submitAnonymousFeedback } from "./actions"
import { toast } from "sonner"

const benefits = [
  {
    icon: Users,
    title: "Community",
    description: "Join a supportive network of like-minded individuals passionate about equality.",
  },
  {
    icon: Sparkles,
    title: "Events",
    description: "Get early access to workshops, seminars, open mics, and exclusive member gatherings.",
  },
  {
    icon: Heart,
    title: "Growth",
    description: "Develop leadership skills, public speaking abilities, and deepen your understanding.",
  },
  {
    icon: MessageSquare,
    title: "Voice",
    description: "Share your perspectives, contribute to discussions, and be part of meaningful change.",
  },
]

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
]

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    education_status: "college", // 'school' | 'college'
    college: "", // School/College Name based on selection
    course: "", // Course/Department (Optional for School)
    year: "", // Only for college
    state: "",
    area: "",
    pincode: "",
    interest: "",
    message: "",
  })

  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      const result = await submitMembershipApplication(null, formDataObj)

      if (result.success) {
        toast.success(result.message)
        // Reset form
        setFormData({
          name: "", email: "", phone: "", dob: "", education_status: "college",
          college: "", course: "", year: "", state: "", area: "", pincode: "",
          interest: "", message: "",
        })
      } else {
        toast.error(result.message)
        if (result.errors) {
          // Log for debug, but toast shows general failure
          console.error(result.errors)
        }
      }
    })
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-peach/20 via-background to-mauve/10" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-peach/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-mauve/15 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-6">🌻</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6">
              <span className="text-primary">Join</span> Our Community
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Every thought matters, and every voice counts. Become part of a movement that believes in dialogue, equality, and empowerment.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Why Join Nisvaan?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Be part of something meaningful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                Connect With Us
              </h2>
              <p className="text-muted-foreground mb-8">
                Join our community through these platforms to stay updated on events, discussions, and opportunities.
              </p>

              <div className="space-y-6">
                <a
                  href="https://chat.whatsapp.com/I4n0hAI6GRBLcdbtyzCANs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border hover:border-green-500/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp Group</h3>
                    <p className="text-sm text-muted-foreground">Join our active community chat</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/nisvaan_bhu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border hover:border-pink-500/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                    <Instagram className="w-7 h-7 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Instagram</h3>
                    <p className="text-sm text-muted-foreground">@nisvaan_bhu - Follow for updates</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/nisvaan-the-gender-dialogue-of-bhu-nisvaan-0100843a3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Linkedin className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">LinkedIn</h3>
                    <p className="text-sm text-muted-foreground">Connect with us on LinkedIn</p>
                  </div>
                </a>

                <a
                  href="mailto:nisvaanthegenderdialogueofbhu@gmail.com"
                  className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-sm text-muted-foreground">nisvaanthegenderdialogueofbhu@gmail.com</p>
                  </div>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-8 rounded-2xl bg-card border border-border">
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
                  Membership Form
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
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
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone (Numbers only)
                      </label>
                      <input
                        type="tel"
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: val })
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                        placeholder="1234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <hr className="border-border/50 my-2" />

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      I am currently in:
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, education_status: 'school' })}
                        className={`flex-1 py-2 rounded-lg border transition-colors ${formData.education_status === 'school' ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-border hover:bg-secondary/50'}`}
                      >
                        School
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, education_status: 'college' })}
                        className={`flex-1 py-2 rounded-lg border transition-colors ${formData.education_status === 'college' ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-border hover:bg-secondary/50'}`}
                      >
                        College / University
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {formData.education_status === 'college' ? 'College / University Name' : 'School Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                        placeholder={formData.education_status === 'college' ? "e.g. Banaras Hindu University" : "e.g. Central Hindu Boys School"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {formData.education_status === 'college' ? 'Course / Department' : 'Class / Grade'}
                      </label>
                      <input
                        type="text"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                        placeholder={formData.education_status === 'college' ? "e.g. B.A. English" : "e.g. Class 12"}
                      />
                    </div>

                    {formData.education_status === 'college' && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Year of Study
                        </label>
                        <select
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                        >
                          <option value="">Select year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="pg">Post Graduate</option>
                          <option value="phd">PhD</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <hr className="border-border/50 my-2" />

                  {/* Location */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State
                      </label>
                      <select
                        value={formData.state}
                        required
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Area / City
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. Hyderabad Gate, Varanasi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                          setFormData({ ...formData, pincode: val })
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. 221005"
                      />
                    </div>
                  </div>

                  <hr className="border-border/50 my-2" />

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Area of Interest
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select interest</option>
                      <option value="events">Event Organization</option>
                      <option value="content">Content & Writing</option>
                      <option value="social">Social Media</option>
                      <option value="outreach">Community Outreach</option>
                      <option value="all">All of the above</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Why do you want to join? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about yourself and why you're interested..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isPending ? "Sending..." : "Submit Application"}
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
            className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-lavender/30 to-peach/30 border border-border"
          >
            <div className="text-5xl mb-6">💬</div>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              Anonymous Feedback Box
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Have suggestions, thoughts, or feedback you&apos;d like to share anonymously? We value every perspective.
            </p>
            <FeedbackForm />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function FeedbackForm() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const formData = new FormData()
      formData.append('message', message)

      const result = await submitAnonymousFeedback(null, formData)

      if (result.success) {
        toast.success(result.message)
        setMessage("")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <form onSubmit={handleFeedbackSubmit} className="max-w-md mx-auto">
      <textarea
        rows={4}
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts anonymously..."
        className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none transition-colors resize-none mb-4"
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Submit Anonymously"}
      </button>
    </form>
  )
}
