"use client"

import { motion } from "framer-motion"
import { Scale, Globe, Heart, MessageSquare, Quote } from "lucide-react"

const values = [
  {
    icon: Scale,
    title: "Equality",
    description: "At its core, feminism advocates for equal rights and opportunities for all genders. It's not about superiority - it's about recognizing that every person deserves the same respect, opportunities, and treatment regardless of gender.",
    color: "from-lavender/40 to-lavender/10",
  },
  {
    icon: Globe,
    title: "Intersectionality",
    description: "We recognize that gender inequality doesn't exist in isolation. It intersects with race, class, sexuality, disability, and other identities. True feminism must address these overlapping systems of oppression to create meaningful change.",
    color: "from-peach/40 to-peach/10",
  },
  {
    icon: Heart,
    title: "Inclusivity",
    description: "Our feminism welcomes everyone - regardless of gender identity, background, or beliefs. We believe that the movement for equality grows stronger when it embraces diverse voices and experiences.",
    color: "from-rose/40 to-rose/10",
  },
  {
    icon: MessageSquare,
    title: "Respect & Dialogue",
    description: "We believe in the power of respectful conversation. Even when we disagree, we commit to listening with empathy, speaking with kindness, and seeking understanding over winning arguments.",
    color: "from-mauve/40 to-mauve/10",
  },
]

const misconceptions = [
  {
    myth: "Feminism is about hating men",
    truth: "Feminism is about achieving equality for all genders. It challenges harmful systems, not individuals. Many feminists actively work alongside men to dismantle patriarchy, fight toxic masculinity and create healthier norms for everyone.",
  },
  {
    myth: "Feminism is no longer needed",
    truth: "While progress has been made, gender inequality persists in wage gaps, representation, violence against women, and countless other areas. The work continues until equality is fully realized.",
  },
  {
    myth: "Feminism only benefits women",
    truth: "Feminism benefits everyone by challenging restrictive gender roles that harm all genders. It supports men's mental health, parental rights, and freedom from harmful expectations.",
  },
  {
    myth: "You can't be feminine and feminist",
    truth: "Feminism is about choice and freedom from imposed expectations. Whether you embrace traditional femininity, reject it, or create your own expression - that's your choice to make.",
  },
]

const quotes = [
  {
    text: "As long as she thinks of a man, nobody objects to a woman thinking.",
    author: "Virginia Woolf, \"Orlando\"",
  },
  {
    text: "I am not free while any woman is unfree, even when her shackles are very different from my own.",
    author: "Audre Lorde",
  },
  {
    text: "No woman can call herself free who does not control her own body.",
    author: "Margaret Sanger",
  },
]

export default function StandForPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-peach/20 via-background to-lavender/10" />
        <div className="absolute top-10 left-20 w-72 h-72 bg-peach/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-lavender/15 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6">
              What We <span className="text-primary">Stand For</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Understanding feminism - its history, purpose, and the values that guide our movement toward equality.
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
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
              Understanding Feminism
            </h2>
            <p className="text-muted-foreground mb-4">
              Feminism, at its essence, is the belief in and advocacy for the political, economic, and social equality of all genders. It emerged from centuries of women&apos;s struggle for basic rights - the right to vote, to own property, to work, and to be treated as full human beings.
            </p>
            <p className="text-muted-foreground">
              Today&apos;s feminism builds on this legacy while expanding its vision to include all forms of gender-based inequality and the intersecting systems of oppression that affect different communities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-serif font-semibold text-foreground">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Myths vs. Reality
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Let&apos;s address some common misconceptions about feminism
            </p>
          </motion.div>

          <div className="space-y-6">
            {misconceptions.map((item, index) => (
              <motion.div
                key={item.myth}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 md:p-8 rounded-2xl bg-card border border-border"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-3">
                      Myth
                    </span>
                    <p className="text-lg font-medium text-foreground">{item.myth}</p>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                      Reality
                    </span>
                    <p className="text-muted-foreground">{item.truth}</p>
                  </div>
                </div>
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
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Voices of Wisdom
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Inspiration from those who paved the way
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {quotes.map((quote, index) => (
              <motion.div
                key={quote.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-lavender/20 to-peach/20 border border-border"
              >
                <Quote className="w-8 h-8 text-primary/40 mb-4" />
                <p className="font-serif text-lg text-foreground mb-4 italic">
                  &quot;{quote.text}&quot;
                </p>
                <p className="text-primary font-medium">- {quote.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-lavender/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
              A Brief History
            </h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="mb-4">
                The feminist movement has evolved through several &quot;waves,&quot; each building on the achievements of the previous generation:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
              {[
                { wave: "First Wave (1848-1920)", focus: "Focused on legal issues, primarily women's suffrage and property rights." },
                { wave: "Second Wave (1960s-1980s)", focus: "Expanded to workplace equality, reproductive rights, and challenging social norms." },
                { wave: "Third Wave (1990s-2000s)", focus: "Embraced diversity, individual identity, and challenged the definition of femininity." },
                { wave: "Fourth Wave (2010s-Present)", focus: "Digital activism, intersectionality, and addressing sexual harassment and assault." },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2">{item.wave}</h4>
                  <p className="text-muted-foreground text-sm">{item.focus}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
