
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useProfile } from "@/hooks/useProfile"
import { NavbarSkeleton } from "@/components/ui/skeletons"
import { NotificationManager } from "@/components/NotificationManager"

const publicLinks = [
  { href: "/about", label: "About Us" },
  { href: "/stand-for", label: "Stand For" },
  { href: "/events", label: "Events" },
  { href: "/voices", label: "Voices" },
  // { href: "/resources", label: "Resources" },
  // { href: "/team", label: "Team" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  // Use cached profile
  const { profile, user, isLoading, signOut } = useProfile()

  const [notificationCount, setNotificationCount] = useState(0)
  const [latestEventId, setLatestEventId] = useState<string | null>(null)
  const [isRead, setIsRead] = useState(false)
  const router = useRouter()
  const supabase = createClient() // Still needed for events/notifications

  // Effect for notifications ONLY (no user fetching)
  useEffect(() => {
    const seenId = localStorage.getItem('nisvaan_seen_event_id')

    async function fetchNotifications() {
      if (!user) return

      // Fetch Notification Count (Upcoming Events)
      const now = new Date().toISOString()
      const { data: events, count: eventCount } = await supabase
        .from('events')
        .select('id', { count: 'exact' })
        .gt('date', now)
        .eq('is_hidden', false)
        .order('date', { ascending: true })
        .limit(1)

      let flaggedCount = 0
      // Use profile from hook
      if (profile?.role === 'president') {
        const { count: fCount } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('moderation_state', 'under_review')

        flaggedCount = fCount || 0
      }

      const totalEventCount = eventCount || 0
      let showEventBadge = false

      if (events && events.length > 0) {
        const nextEventId = events[0].id
        setLatestEventId(nextEventId)

        if (seenId !== nextEventId) {
          showEventBadge = true
        }
      }

      const finalCount = flaggedCount + (showEventBadge ? totalEventCount : 0)

      setNotificationCount(finalCount)
      setIsRead(finalCount === 0)
    }

    if (!isLoading && user) {
      fetchNotifications()
    }

    // Listen for read events
    const handleRead = (e: any) => {
      if (e.detail === latestEventId) {
        setIsRead(true)
      }
    }
    window.addEventListener('notificationsRead', handleRead)

    return () => {
      window.removeEventListener('notificationsRead', handleRead)
    }
  }, [supabase, user, profile, isLoading, latestEventId])

  const handleSignOut = async () => {
    await signOut()
  }

  const getDashboardLink = () => {
    if (!profile) return '/dashboard/user'
    if (profile.role === 'president') return '/dashboard/president'
    if (profile.role === 'media_manager') return '/dashboard/media'
    return '/dashboard/user'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo-updated.png"
              alt="Nisvaan Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-full"
            />
            <span className="text-2xl font-serif font-semibold text-primary group-hover:text-primary/80 transition-colors">Nisvaan</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            <div className="h-4 w-px bg-border mx-2" />

            {isLoading ? (
              <NavbarSkeleton />
            ) : user ? (
              <div className="flex items-center gap-6">
                <Link
                  href={getDashboardLink()}
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group relative"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Dashboard</span>
                  {notificationCount > 0 && !isRead && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-sm animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-secondary flex items-center justify-center overflow-hidden border border-primary/20 shadow-sm">
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt="Avatar"
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-serif font-bold text-primary">
                          {(profile?.name || user.email)?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-3 w-56 bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="text-sm font-semibold text-foreground truncate">{profile?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate font-medium">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                      <Link href={getDashboardLink()} className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/5 rounded-lg text-left transition-colors mt-1">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold px-6 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/25"
              >
                Login
              </Link>
            )}

            <NotificationManager />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {
          isOpen && (
            <div className="lg:hidden pb-4 border-t border-border mt-2 pt-4">
              <div className="flex flex-col gap-2">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                {user ? (
                  <>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-lg"
                    >
                      Dashboard
                      {notificationCount > 0 && !isRead && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                          {notificationCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary/20 to-secondary flex items-center justify-center overflow-hidden border border-primary/20 shadow-sm">
                        {profile?.avatar_url ? (
                          <Image
                            src={profile.avatar_url}
                            alt="Avatar"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-serif font-bold text-primary">
                            {(profile?.name || user.email)?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      Profile
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setIsOpen(false); }}
                      className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/50 rounded-lg"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )
        }
      </div >
    </nav >
  )
}
