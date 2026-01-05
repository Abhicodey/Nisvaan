"use client"

import { motion } from "framer-motion"
import { Book, Video, Headphones, GraduationCap, Phone, ExternalLink, Heart } from "lucide-react"

const resourceCategories = [
  {
    icon: Book,
    title: "Books",
    description: "Essential feminist literature and gender studies texts",
    resources: [
      { name: "The Second Sex - Simone de Beauvoir", link: "#" },
      { name: "We Should All Be Feminists - Chimamanda Ngozi Adichie", link: "#" },
      { name: "Bad Feminist - Roxane Gay", link: "#" },
      { name: "Men Explain Things to Me - Rebecca Solnit", link: "#" },
      { name: "Invisible Women - Caroline Criado Perez", link: "#" },
    ],
  },
  {
    icon: Video,
    title: "Videos & Documentaries",
    description: "Visual content exploring gender and equality",
    resources: [
      { name: "Miss Representation (Documentary)", link: "#" },
      { name: "The Mask You Live In (Documentary)", link: "#" },
      { name: "TED: We Should All Be Feminists", link: "#" },
      { name: "Period. End of Sentence (Documentary)", link: "#" },
      { name: "RBG (Documentary)", link: "#" },
    ],
  },
  {
    icon: Headphones,
    title: "Podcasts",
    description: "Audio content for learning on the go",
    resources: [
      { name: "The Guilty Feminist", link: "#" },
      { name: "Call Your Girlfriend", link: "#" },
      { name: "Stuff Mom Never Told You", link: "#" },
      { name: "The Receipts Podcast", link: "#" },
      { name: "Unladylike", link: "#" },
    ],
  },
  {
    icon: GraduationCap,
    title: "Academic Resources",
    description: "Research papers and academic materials",
    resources: [
      { name: "JSTOR Gender Studies Collection", link: "#" },
      { name: "UN Women Research Publications", link: "#" },
      { name: "Feminist Studies Journal", link: "#" },
      { name: "Signs: Journal of Women in Culture", link: "#" },
      { name: "Gender & Society Journal", link: "#" },
    ],
  },
]

const helplines = [
  {
    name: "Women Helpline (India)",
    number: "181",
    description: "24/7 support for women in distress",
  },
  {
    name: "iCall - Mental Health Support",
    number: "9152987821",
    description: "Free professional counseling service",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    description: "24/7 mental health support",
  },
  {
    name: "National Commission for Women",
    number: "7827-170-170",
    description: "Support for harassment and violence",
  },
]

const infographics = [
  {
    title: "Understanding Consent",
    image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&q=80",
  },
  {
    title: "Wage Gap Facts",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
  },
  {
    title: "Intersectionality 101",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&q=80",
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-lavender/20 via-background to-rose/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-rose/15 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6">
              <span className="text-primary">Resources</span> & Support
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Curated materials to deepen your understanding of feminism, gender studies, and support services when you need them.
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
              Learning Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of books, videos, podcasts, and academic materials
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {category.resources.map((resource, i) => (
                    <li key={i}>
                      <a
                        href={resource.link}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{resource.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-rose/10 via-background to-lavender/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose/20 text-rose mb-4">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Support Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Helplines & Counseling
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              If you or someone you know needs support, these resources are here to help
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helplines.map((helpline, index) => (
              <motion.div
                key={helpline.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  {helpline.name}
                </h3>
                <a
                  href={`tel:${helpline.number}`}
                  className="text-2xl font-bold text-primary hover:underline block mb-2"
                >
                  {helpline.number}
                </a>
                <p className="text-sm text-muted-foreground">{helpline.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Quick Reads
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visual guides and infographics for easy understanding
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {infographics.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-serif font-semibold text-foreground">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
              Suggest a Resource
            </h2>
            <p className="text-muted-foreground mb-8">
              Know a great book, video, or resource that should be on this list? Let us know!
            </p>
            <form className="max-w-md mx-auto flex gap-3">
              <input
                type="text"
                placeholder="Resource name or link"
                className="flex-1 px-4 py-3 rounded-full bg-card border border-border focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
