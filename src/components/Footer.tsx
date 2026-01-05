import Link from "next/link"
import { Instagram, Mail, MessageCircle, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-semibold text-primary mb-4">Nisvaan</h3>
            <p className="text-muted-foreground max-w-md">
              The Feminist Gender Dialogue Society of BHU — promoting equality, empathy, and open dialogue through meaningful conversations.
            </p>
            <p className="mt-4 text-sm text-muted-foreground italic">
              &quot;Voices of change begin with dialogue.&quot;
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/events", label: "Events" },
                { href: "/voices", label: "Voices" },
                { href: "/join", label: "Join Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/nisvaan_bhu/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://chat.whatsapp.com/I4n0hAI6GRBLcdbtyzCANs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label="WhatsApp Community"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/nisvaan-the-gender-dialogue-of-bhu-nisvaan-0100843a3/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:nisvaanthegenderdialogueofbhu@gmail.com"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nisvaan — BHU. All rights reserved.</p>
          <p className="mt-1">Empower through empathy.</p>
        </div>
      </div>
    </footer>
  )
}
