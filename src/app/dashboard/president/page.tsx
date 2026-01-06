'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldAlert, CheckCircle, Trash2, ExternalLink, Clock, Skull, EyeOff, Eye, Crown, Clapperboard, UserMinus } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import Link from 'next/link'
import { restorePost, removePost } from '@/app/voices/actions'
import { cn } from '@/lib/utils'
import { MarkNotificationsAsRead } from '@/components/MarkNotificationsAsRead'
import { useProfile } from '@/hooks/useProfile'
import { DashboardSkeleton } from '@/components/ui/skeletons'

export default function PresidentDashboard() {
    const [activeTab, setActiveTab] = useState<'governance' | 'users' | 'media'>('governance')
    const [users, setUsers] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])
    const [allPosts, setAllPosts] = useState<any[]>([])
    const [flaggedPosts, setFlaggedPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { profile, isLoading: isProfileLoading } = useProfile()
    const [isPending, startTransition] = useTransition()

    // ... (rest of useEffects)

    // ... (rest of handlers)

    const handleUpdateRole = (userId: string, newRole: 'president' | 'media_manager' | 'user') => {
        if (!confirm(`Change this user's role to ${newRole.replace('_', ' ')}?`)) return
        startTransition(async () => {
            const { updateUserRole } = await import('@/app/admin/actions')
            const res = await updateUserRole(userId, newRole)
            if (res.success) {
                toast.success(res.message)
                // Optimistic Update
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
            } else {
                toast.error(res.message)
            }
        })
    }

    // Filter for Mark as Read

    useEffect(() => {
        if (isProfileLoading) return

        if (!profile) {
            router.push('/login')
            return
        }

        if (profile.role !== 'president') {
            toast.error("Restricted Access")
            router.push('/')
            return
        }

        const fetchDashboard = async () => {
            const supabase = createClient()

            // Fetch Flagged Posts
            const { data: flagged } = await supabase
                .from('posts')
                .select('*, profiles(name, email), reports(reason, created_at)')
                .eq('moderation_state', 'under_review')
                .order('created_at', { ascending: false })
            setFlaggedPosts(flagged || [])

            // Fetch Users
            const { data: allUsers } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
            setUsers(allUsers || [])

            // Fetch All Events [NEW]
            const { data: recentEvents } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false })
            setEvents(recentEvents || [])

            // Fetch All Posts [NEW] for general management
            const { data: recentPosts } = await supabase
                .from('posts')
                .select('*, profiles(name,email)')
                .order('created_at', { ascending: false })
                // Limit removed or adjusted as needed, but let's keep it consistent
                .limit(50)
            setAllPosts(recentPosts || [])

            setLoading(false)
        }

        fetchDashboard()
    }, [router, profile, isProfileLoading])

    // --- HANDLERS ---

    // Governance: Flagged Content Handlers
    const handleRemove = (postId: string) => {
        if (!confirm("Permanently delete this post?")) return
        startTransition(async () => {
            const { removePost } = await import('@/app/voices/actions')
            const res = await removePost(postId)
            if (res.success) {
                toast.success("Post Removed")
                setFlaggedPosts(prev => prev.filter(p => p.id !== postId))
                setAllPosts(prev => prev.filter(p => p.id !== postId))
            } else {
                toast.error(res.message)
            }
        })
    }

    const handleRestore = (postId: string) => {
        startTransition(async () => {
            const { restorePost } = await import('@/app/voices/actions')
            const res = await restorePost(postId)
            if (res.success) {
                toast.success("Post Restored")
                setFlaggedPosts(prev => prev.filter(p => p.id !== postId))
            } else {
                toast.error(res.message)
            }
        })
    }

    // User Management Handlers (already implemented below...)

    // Global Media Handlers
    const handleToggleEvent = (eventId: string, isHidden: boolean) => {
        startTransition(async () => {
            const { toggleEventVisibility } = await import('@/app/admin/actions')
            const res = await toggleEventVisibility(eventId, isHidden)
            if (res.success) {
                toast.success(res.message)
                setEvents(prev => prev.map(e => e.id === eventId ? { ...e, is_hidden: isHidden } : e))
            } else {
                toast.error(res.message)
            }
        })
    }

    const handleDeleteEvent = (eventId: string) => {
        if (!confirm("Delete this event?")) return
        startTransition(async () => {
            const { deleteEvent } = await import('@/app/admin/actions')
            const res = await deleteEvent(eventId)
            if (res.success) {
                toast.success("Event Deleted")
                setEvents(prev => prev.filter(e => e.id !== eventId))
            } else {
                toast.error(res.message)
            }
        })
    }

    const handleToggleVoice = (postId: string, isHidden: boolean) => {
        startTransition(async () => {
            const { toggleVoiceVisibility } = await import('@/app/admin/actions')
            const res = await toggleVoiceVisibility(postId, isHidden)
            if (res.success) {
                toast.success(res.message)
                setAllPosts(prev => prev.map(p => p.id === postId ? { ...p, is_hidden: isHidden } : p))
            } else {
                toast.error(res.message)
            }
        })
    }

    const handleSuspendUser = (userId: string) => {
        if (!confirm("Suspend this user? They will not be able to log in.")) return
        startTransition(async () => {
            const { suspendUser } = await import('@/app/admin/actions')
            const res = await suspendUser(userId)
            if (res.success) {
                toast.success("User Suspended")
                setUsers(users.map(u => u.id === userId ? { ...u, account_status: 'suspended' } : u))
            } else {
                toast.error(res.message)
            }
        })
    }

    const handleTimeoutUser = (userId: string, minutes: number) => {
        if (!confirm(`Timeout this user for ${minutes} minutes?`)) return
        startTransition(async () => {
            const { timeoutUser } = await import('@/app/admin/actions')
            const res = await timeoutUser(userId, minutes)
            if (res.success) {
                toast.success(res.message)
                // Optimistic update
                setUsers(users.map(u => u.id === userId ? { ...u, account_status: 'suspended' } : u))
            } else {
                toast.error(res.message)
            }
        })
    }

    const handleDeleteUser = (userId: string) => {
        if (!confirm("WARNING: PROCEEDING WILL PERMANENTLY DELETE THIS USER.")) return
        if (!confirm("Are you absolutely sure? This cannot be undone.")) return

        startTransition(async () => {
            const { deleteUser } = await import('@/app/admin/actions')
            const res = await deleteUser(userId)
            if (res.success) {
                toast.success("User Deleted")
                setUsers(prev => prev.filter(u => u.id !== userId))
            } else {
                toast.error(res.message)
            }
        })
    }

    const handleRestoreUser = (userId: string) => {
        if (!confirm("Restore this user account?")) return
        startTransition(async () => {
            const { restoreUser } = await import('@/app/admin/actions')
            const res = await restoreUser(userId)
            if (res.success) {
                toast.success("User Restored")
                setUsers(users.map(u => u.id === userId ? { ...u, account_status: 'normal' } : u))
            } else {
                toast.error(res.message)
            }
        })
    }

    // Filter for Mark as Read
    const upcomingEvents = events
        .filter(e => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const latestEventId = upcomingEvents[0]?.id || null

    if (loading || isProfileLoading) return <DashboardSkeleton />

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto">
            <MarkNotificationsAsRead latestEventId={latestEventId} />
            <header className="mb-10">
                <h1 className="text-3xl font-serif font-bold mb-2 flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-destructive" />
                    President's Console
                </h1>
                <p className="text-muted-foreground">
                    Manage community safety and membership.
                </p>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border">
                <button
                    onClick={() => setActiveTab('governance')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-all",
                        activeTab === 'governance'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Safety Center (Reports)
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-all",
                        activeTab === 'users'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-all",
                        activeTab === 'media'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Events & Content
                </button>
            </div>

            {activeTab === 'governance' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                        Flagged Voices (Automatic)
                        <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">{flaggedPosts.length}</span>
                    </h2>
                    {/* ... (rest of governance) */}
                    {flaggedPosts.length === 0 ? (
                        <div className="p-12 text-center bg-card border border-dashed border-border rounded-xl">
                            <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
                            <h3 className="text-lg font-medium">All Clear</h3>
                            <p className="text-muted-foreground">No content is currently under review.</p>
                        </div>
                    ) : (
                        flaggedPosts.map(post => (
                            <div key={post.id} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6">
                                {/* Preview */}
                                <div className="w-full md:w-1/3 bg-secondary/30 rounded-lg p-4">
                                    <h3 className="font-serif font-bold text-lg mb-2">{post.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        By {post.profiles?.name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="prose prose-sm dark:prose-invert max-h-48 overflow-y-auto mb-4">
                                        {post.excerpt}
                                    </div>
                                    {post.image_url && (
                                        <div className="relative h-32 w-full rounded overflow-hidden">
                                            <Image src={post.image_url} alt="Cover" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                                        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <span className="font-bold block mb-1">Status: Under Review</span>
                                            <p className="mb-2">This post was auto-hidden due to community reports.</p>

                                            {/* Report Reasons */}
                                            {post.reports && post.reports.length > 0 && (
                                                <div className="bg-background/50 rounded p-2 text-xs text-foreground/80 mt-2 border border-destructive/20">
                                                    <span className="font-semibold block mb-1">Reported for:</span>
                                                    <ul className="list-disc list-inside space-y-0.5">
                                                        {post.reports.map((r: any, idx: number) => (
                                                            <li key={idx}>
                                                                <span className="capitalize">{r.reason}</span>
                                                                <span className="text-muted-foreground ml-2 opacity-70">
                                                                    {new Date(r.created_at).toLocaleDateString()}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 justify-end mt-4">
                                        <button
                                            onClick={() => handleRemove(post.id)}
                                            disabled={isPending}
                                            className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove Permanently
                                        </button>
                                        <button
                                            onClick={() => handleRestore(post.id)}
                                            disabled={isPending}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors text-sm font-medium"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Restore to Feed
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* USERS TAB (Unchanged) */}
            {activeTab === 'users' && (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{u.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium uppercase",
                                                u.role === 'president' ? "bg-purple-100 text-purple-700" :
                                                    u.role === 'media_manager' ? "bg-blue-100 text-blue-700" :
                                                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                            )}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                                u.account_status === 'suspended' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                            )}>
                                                {u.account_status || 'normal'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                            {/* Role Management */}
                                            {/* Do not show role actions for the Original President (hard check on specific email to match backend) */}
                                            {u.email !== "nisvaanthegenderdialogueofbhu@gmail.com" && (
                                                <div className="flex items-center gap-1 bg-primary/10 rounded-lg p-1 mr-2">
                                                    {u.role !== 'president' && (
                                                        <button
                                                            onClick={() => handleUpdateRole(u.id, 'president')}
                                                            disabled={isPending}
                                                            className="p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                                                            title="Promote to President"
                                                        >
                                                            <Crown className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {u.role !== 'media_manager' && (
                                                        <button
                                                            onClick={() => handleUpdateRole(u.id, 'media_manager')}
                                                            disabled={isPending}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                            title={u.role === 'president' ? "Demote to Media Manager" : "Promote to Media Manager"}
                                                        >
                                                            <Clapperboard className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {u.role !== 'user' && (
                                                        <button
                                                            onClick={() => handleUpdateRole(u.id, 'user')}
                                                            disabled={isPending}
                                                            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                                                            title="Demote to User"
                                                        >
                                                            <UserMinus className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {u.role !== 'president' && (
                                                <>
                                                    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 mr-2">
                                                        <Clock className="w-3 h-3 text-muted-foreground ml-1" />
                                                        <button
                                                            onClick={() => handleTimeoutUser(u.id, 60)}
                                                            disabled={isPending}
                                                            className="px-2 py-1 text-xs hover:bg-background rounded transition-colors"
                                                            title="Timeout 1 Hour"
                                                        >
                                                            1h
                                                        </button>
                                                        <button
                                                            onClick={() => handleTimeoutUser(u.id, 1440)}
                                                            disabled={isPending}
                                                            className="px-2 py-1 text-xs hover:bg-background rounded transition-colors"
                                                            title="Timeout 24 Hours"
                                                        >
                                                            24h
                                                        </button>
                                                        <button
                                                            onClick={() => handleTimeoutUser(u.id, 10080)}
                                                            disabled={isPending}
                                                            className="px-2 py-1 text-xs hover:bg-background rounded transition-colors"
                                                            title="Timeout 1 Week"
                                                        >
                                                            7d
                                                        </button>
                                                    </div>

                                                    {u.account_status === 'suspended' ? (
                                                        <button
                                                            onClick={() => handleRestoreUser(u.id)}
                                                            disabled={isPending}
                                                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                                            title="Restore User"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs mr-2 font-mono">ACTIVE</span>
                                                    )}

                                                    <div className="w-px h-6 bg-border mx-1"></div>

                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        disabled={isPending}
                                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                        title="PERMANENTLY DELETE"
                                                    >
                                                        <Skull className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'media' && (
                <div className="space-y-12">

                    {/* EVENTS LIST */}
                    {/* EVENTS LIST */}
                    <div className="space-y-10">
                        {/* Upcoming Events */}
                        <section>
                            <h3 className="text-xl font-medium mb-4 pb-2 border-b border-border flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Upcoming Events
                            </h3>
                            {events.filter(e => new Date(e.date) > new Date()).length === 0 ? (
                                <p className="text-muted-foreground italic">No upcoming events scheduled.</p>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-3">
                                    {events.filter(e => new Date(e.date) > new Date()).map(event => (
                                        <div key={event.id} className={cn("bg-card border border-border rounded-xl overflow-hidden relative group", event.is_hidden && "opacity-75 border-dashed")}>
                                            <div className="aspect-video relative bg-secondary">
                                                {event.image_urls?.[0] ? <Image src={event.image_urls[0]} alt={event.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" /> : null}
                                                {event.is_hidden && (
                                                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                                                        <span className="bg-background/80 px-3 py-1 rounded-full text-xs font-bold border border-border flex items-center gap-2">
                                                            <EyeOff className="w-3 h-3" /> Hidden
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold truncate">{event.title}</h4>
                                                <p className="text-xs text-muted-foreground mb-4">{new Date(event.date).toLocaleDateString()}</p>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleToggleEvent(event.id, !event.is_hidden)}
                                                        disabled={isPending}
                                                        className={cn(
                                                            "flex-1 py-2 text-xs border rounded transition-colors flex items-center justify-center gap-2",
                                                            event.is_hidden ? "border-primary text-primary hover:bg-primary/10" : "border-border text-muted-foreground hover:bg-secondary"
                                                        )}
                                                    >
                                                        {event.is_hidden ? <><Eye className="w-3 h-3" /> Unhide</> : <><EyeOff className="w-3 h-3" /> Hide</>}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                        disabled={isPending}
                                                        className="py-2 px-3 text-xs border border-destructive/20 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Past Highlights */}
                        <section>
                            <h3 className="text-xl font-medium mb-4 pb-2 border-b border-border flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-secondary-foreground" />
                                Past Highlights
                            </h3>
                            {events.filter(e => new Date(e.date) <= new Date()).length === 0 ? (
                                <p className="text-muted-foreground italic">No past events found.</p>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-3">
                                    {events.filter(e => new Date(e.date) <= new Date()).map(event => (
                                        <div key={event.id} className={cn("bg-card border border-border rounded-xl overflow-hidden relative group", event.is_hidden && "opacity-75 border-dashed")}>
                                            <div className="aspect-video relative bg-secondary">
                                                {event.image_urls?.[0] ? <Image src={event.image_urls[0]} alt={event.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" /> : null}
                                                {event.is_hidden && (
                                                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                                                        <span className="bg-background/80 px-3 py-1 rounded-full text-xs font-bold border border-border flex items-center gap-2">
                                                            <EyeOff className="w-3 h-3" /> Hidden
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold truncate">{event.title}</h4>
                                                <p className="text-xs text-muted-foreground mb-4">{new Date(event.date).toLocaleDateString()}</p>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleToggleEvent(event.id, !event.is_hidden)}
                                                        disabled={isPending}
                                                        className={cn(
                                                            "flex-1 py-2 text-xs border rounded transition-colors flex items-center justify-center gap-2",
                                                            event.is_hidden ? "border-primary text-primary hover:bg-primary/10" : "border-border text-muted-foreground hover:bg-secondary"
                                                        )}
                                                    >
                                                        {event.is_hidden ? <><Eye className="w-3 h-3" /> Unhide</> : <><EyeOff className="w-3 h-3" /> Hide</>}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                        disabled={isPending}
                                                        className="py-2 px-3 text-xs border border-destructive/20 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* ALL VOICES */}
                    <section>
                        <h3 className="text-xl font-medium mb-4 pb-2 border-b border-border">All Voices</h3>
                        <div className="space-y-4">
                            {allPosts.map((post: any) => (
                                <div key={post.id} className={cn("bg-card border border-border rounded-lg p-4 flex items-center gap-4", post.is_hidden && "opacity-75 border-dashed")}>
                                    <div className="w-12 h-12 bg-secondary rounded overflow-hidden relative flex-shrink-0">
                                        {post.image_url && <Image src={post.image_url} alt="t" fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate flex items-center gap-2">
                                            {post.title}
                                            {post.is_hidden && <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">Hidden</span>}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">By {post.profiles?.name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleVoice(post.id, !post.is_hidden)}
                                            className={cn(
                                                "px-3 py-2 rounded flex items-center gap-2 text-xs font-medium border transition-colors",
                                                post.is_hidden
                                                    ? "bg-primary/10 text-primary border-primary hover:bg-primary/20"
                                                    : "hover:bg-secondary text-muted-foreground border-border"
                                            )}
                                        >
                                            {post.is_hidden ? <><Eye className="w-4 h-4" /> Unhide</> : <><EyeOff className="w-4 h-4" /> Hide</>}
                                        </button>
                                        <button
                                            onClick={() => handleRemove(post.id)} // Permanent Remove
                                            className="px-3 py-2 hover:bg-destructive/10 rounded text-destructive flex items-center gap-2 text-xs font-medium border border-destructive/20"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div >
    )
}
