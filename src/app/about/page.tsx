"use client"

import { motion } from "framer-motion"
import { Heart, Users, Target, Eye } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-lavender/20 via-background to-peach/10" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-lavender/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-peach/15 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6">
              About <span className="text-primary">Nisvaan</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the story behind the movement, our mission, and the values that drive us forward.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-4">
                Nisvaan was born out of quiet exhaustion and stubborn hope. Jyotsna, a student at BHU, found herself growing increasingly tired of enforced patriarchal norms that dictated how one should speak, dress, think, and exist. Inspired by the spirit of resistance and collective voice portrayed in the film Moxie, the idea of Nisvaan began as a simple yet radical thought: creating zines as a medium for expression, dissent, and dialogue. What started as a personal urge to speak back soon evolved into a vision of building a space where conversations around gender, power, and lived realities could exist without fear or judgment.
              </p>
              <p className="text-muted-foreground mb-4">
                This vision took shape when Jyotsna reached out to Tanishq, and soon after, Shivangi joined the conversation. Together, the three sat down to articulate what Nisvaan should stand for. They reflected, debated, listened, and learned. Nisvaan became more than a society. It became a safe space to be open, to vent, to question, and to unlearn. A vessel where like-minded individuals could come together, share experiences, explore different paths to challenge patriarchy, and most importantly, support one another. Nisvaan stands as a collective effort to turn dialogue into solidarity and thought into action.
              </p>
              <p className="text-muted-foreground">
                Today, Nisvaan stands as a beacon for students who believe in the transformative power of respectful conversation and the pursuit of equality for all. It continues to grow as a space where voices are heard, differences are engaged with empathy, and dialogue becomes a tool for change rather than division.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }} // Slower, editorial ease
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-lavender/20 rounded-3xl blur-2xl" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Suffragettes_demonstration_in_London%2C_1910.jpg/1280px-Suffragettes_demonstration_in_London%2C_1910.jpg"
                  alt="Suffragettes demonstration in London, 1910"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out scale-105 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-serif text-xl md:text-2xl text-white/90 italic tracking-wide">
                    &quot;Where every voice finds its echo&quot;
                  </p>
                  <p className="text-xs text-white/60 mt-2 uppercase tracking-widest">
                    Suffragettes, London 1910
                  </p>
                </div>
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
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-lavender/30 to-peach/30 border border-border">
              <div className="text-5xl mb-6">🌸</div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
                &quot;True feminism is about equality, not competition.&quot;
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                At Nisvaan, we believe that feminism is not about pitting genders against each other. It&apos;s about recognizing the inherent worth and dignity of every individual, regardless of gender. It&apos;s about working together to create a more just and equitable society for all.
              </p>
            </div>
          </motion.div>
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
              Mission & Vision
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Guided by purpose, driven by passion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                To create an inclusive platform that promotes feminist ideals through open dialogue, education, and community engagement. We strive to:
              </p>
              <ul className="space-y-3">
                {[
                  "Foster respectful conversations about gender and equality",
                  "Challenge misconceptions about feminism",
                  "Empower individuals to become advocates for change",
                  "Build bridges across diverse perspectives",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-lavender/30 dark:bg-lavender/20">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                We envision a world where:
              </p>
              <ul className="space-y-3">
                {[
                  "Gender equality is a lived reality, not just an aspiration",
                  "Every voice is valued and heard with respect",
                  "Feminism is understood as a movement for everyone",
                  "Dialogue replaces division in addressing social issues",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>



      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Our Values in Action
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Unity in Diversity",
                description: "We celebrate different backgrounds, experiences, and viewpoints, recognizing that diversity strengthens our dialogue.",
                image: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Woman_Suffrage_Procession_1913_opening.jpg",
              },
              {
                title: "Dialogue Over Division",
                description: "We choose conversation over confrontation, believing that understanding grows when we truly listen to one another.",
                image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Anicet-Charles-Gabriel_Lemonnier_-_In_the_Salon_of_Madame_Geoffrin_in_1755_-_WGA12652.jpg",
              },
              {
                title: "Empowerment Through Education",
                description: "We share knowledge, resources, and perspectives to help everyone become informed advocates for equality.",
                image: "https://upload.wikimedia.org/wikipedia/commons/0/02/Savitribai_Phule_with_Fatima_Sheikh.jpg",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
