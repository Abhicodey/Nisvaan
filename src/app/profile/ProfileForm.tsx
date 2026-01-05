'use client'

import { useState, useRef, useTransition } from 'react'
import { updateProfile, uploadAvatar } from './actions'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Loader2, Camera, User, LogOut, Pencil, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
    profile: {
        name: string | null
        age: number | null
        bio: string | null
        avatar_url: string | null
        role: 'user' | 'media_manager' | 'president'
        moderation_state: 'normal' | 'under_review' | 'suspended'
    } | null
    userEmail: string | undefined
}

export default function ProfileForm({ profile, userEmail }: ProfileFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // State for local fields
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)

    // Editable fields state
    type FieldName = 'fullName' | 'age' | 'bio'
    const [formData, setFormData] = useState({
        fullName: profile?.name || '',
        age: profile?.age?.toString() || '',
        bio: profile?.bio || ''
    })

    const [editingField, setEditingField] = useState<FieldName | null>(null)

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = event.target.files?.[0]
            if (!file) return

            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size must be less than 2MB")
                return
            }

            const data = new FormData()
            data.append('file', file)

            const result = await uploadAvatar(data)

            if (!result.success || !result.publicUrl) {
                throw new Error(result.message || "Upload failed")
            }

            setAvatarUrl(result.publicUrl)

            // Auto-save the profile with new avatar URL
            const profileData = new FormData()
            profileData.append('fullName', formData.fullName)
            profileData.append('age', formData.age)
            profileData.append('bio', formData.bio)
            profileData.append('avatarUrl', result.publicUrl)

            startTransition(async () => {
                const updateResult = await updateProfile(null, profileData)
                if (updateResult.success) {
                    toast.success("Profile picture updated")
                } else {
                    toast.error("Failed to save profile picture")
                }
            })

        } catch (error: any) {
            console.error(error)
            toast.error("Error uploading image: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSave = (field: FieldName) => {
        setEditingField(null)

        if (field === 'fullName' && formData.fullName.trim().length < 2) {
            toast.error("Name must be at least 2 characters")
            return
        }

        const data = new FormData()
        data.append('fullName', formData.fullName)
        data.append('age', formData.age)
        data.append('bio', formData.bio)
        if (avatarUrl) data.append('avatarUrl', avatarUrl)

        startTransition(async () => {
            const result = await updateProfile(null, data)
            if (result.success) {
                toast.success("Saved")
            } else {
                toast.error(result.message || "Failed to save")
            }
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent, field: FieldName) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSave(field)
        }
        if (e.key === 'Escape') {
            setEditingField(null)
        }
    }

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            {/* 
               Background Strategy:
               Use absolute positioning scoped to this container to avoid covering the footer.
               The container itself flows naturally, pushing the footer down.
            */}
            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-br from-lavender/30 via-background to-peach/20 pointer-events-none -z-20" />

            {/* Ambient Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-20 left-10 w-96 h-96 bg-lavender/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-peach/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT COLUMN - Sticky Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-4 lg:sticky lg:top-24 space-y-6"
                    >
                        {/* 
                           SOLID CARD FIX:
                           Changed bg-card/40 to bg-[#121212] (solid darker color).
                           Added distinct border and shadow.
                        */}
                        <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">

                            {/* Card Glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                            {/* Status Banner */}
                            {profile?.moderation_state && profile.moderation_state !== 'normal' && (
                                <div className="w-full mb-6 py-2 px-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-bold uppercase tracking-wider">
                                    Account {profile.moderation_state.replace('_', ' ')}
                                </div>
                            )}

                            {/* Avatar */}
                            <div className="relative mb-6 cursor-pointer group/avatar" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-40 h-40 rounded-full border-4 border-[#121212] shadow-2xl overflow-hidden relative z-10 bg-secondary mx-auto ring-1 ring-white/10">
                                    {avatarUrl ? (
                                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover transition-transform duration-500 group-hover/avatar:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-5xl font-serif text-muted-foreground">
                                            {(formData.fullName || userEmail)?.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    {/* Upload Overlay */}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Loading Overlay */}
                                    {(uploading || (isPending && !editingField)) && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-full opacity-0 group-hover/avatar:opacity-100 blur-xl transition-opacity duration-500" />
                                <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                <p className="text-xs text-muted-foreground mt-3 opacity-0 group-hover/avatar:opacity-100 transition-opacity">Click to change photo</p>
                            </div>

                            {/* Name & Role */}
                            <div className="w-full space-y-2 mb-6">
                                {editingField === 'fullName' ? (
                                    <input
                                        autoFocus
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        onBlur={() => handleSave('fullName')}
                                        onKeyDown={(e) => handleKeyDown(e, 'fullName')}
                                        className="text-3xl font-serif font-bold text-center bg-transparent border-b border-primary focus:border-primary outline-none text-foreground w-full pb-1"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <h1
                                        onClick={() => setEditingField('fullName')}
                                        className="text-3xl font-serif font-bold text-foreground cursor-pointer hover:text-primary transition-colors flex items-center justify-center gap-2 group/name"
                                    >
                                        {formData.fullName || "Set Your Name"}
                                        <Pencil className="w-4 h-4 opacity-0 group-hover/name:opacity-50 text-muted-foreground" />
                                    </h1>
                                )}

                                <p className="text-sm font-medium text-muted-foreground">{userEmail}</p>
                            </div>

                            {/* Role Badge */}
                            <div className="mb-8">
                                {profile?.role === 'president' ? (
                                    <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]">
                                        President
                                    </span>
                                ) : profile?.role === 'media_manager' ? (
                                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]">
                                        Media Manager
                                    </span>
                                ) : (
                                    <span className="px-4 py-1.5 rounded-full bg-zinc-800 border border-white/10 text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">
                                        Member
                                    </span>
                                )}
                            </div>

                            {/* Sign Out */}
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all text-sm font-medium flex items-center justify-center gap-2 group/logout text-muted-foreground"
                            >
                                <LogOut className="w-4 h-4 transition-transform group-hover/logout:-translate-x-1" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN - Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-8 space-y-8"
                    >
                        {/* Welcome Header */}
                        <div className="mb-8">
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">
                                Hey, <span className="text-primary">{formData.fullName?.split(' ')[0] || 'Friend'}</span>.
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                This is your personal space in the Nisvaan community. Keep your profile updated to help others connect with you.
                            </p>
                        </div>

                        {/* Bio Section - SOLID */}
                        <section className="bg-[#121212] border border-white/10 rounded-3xl p-8 md:p-10 relative group hover:border-primary/20 transition-colors shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-serif font-semibold text-foreground flex items-center gap-2">
                                    <span className="text-2xl">✍️</span> Your Story
                                </h3>
                                {!editingField && (
                                    <button
                                        onClick={() => setEditingField('bio')}
                                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Pencil className="w-3 h-3" /> Edit Bio
                                    </button>
                                )}
                            </div>

                            {editingField === 'bio' ? (
                                <div className="space-y-4">
                                    <textarea
                                        autoFocus
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        onBlur={() => handleSave('bio')}
                                        onKeyDown={(e) => handleKeyDown(e, 'bio')}
                                        className="w-full bg-black/20 p-6 rounded-xl border border-primary/30 text-lg leading-relaxed text-foreground font-serif outline-none focus:ring-2 focus:ring-primary/20 min-h-[200px]"
                                        placeholder="Share a bit about your journey, interests, or what feminism means to you..."
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingField(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                                        <button onClick={() => handleSave('bio')} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg flex items-center gap-2">
                                            <Check className="w-4 h-4" /> Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setEditingField('bio')}
                                    className="cursor-pointer min-h-[100px]"
                                >
                                    <p className={`text-lg leading-loose ${formData.bio ? 'text-foreground/90 font-serif' : 'text-muted-foreground/60 italic'}`}>
                                        {formData.bio || "No bio yet. Click here to tell us about yourself..."}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* Age Card - SOLID */}
                            <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 group hover:border-primary/20 transition-colors shadow-lg" onClick={() => setEditingField('age')}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Age</h4>
                                        {editingField === 'age' ? (
                                            <div className="flex items-center gap-2 mt-2">
                                                <input
                                                    autoFocus
                                                    type="number"
                                                    value={formData.age}
                                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                    onBlur={() => handleSave('age')}
                                                    onKeyDown={(e) => handleKeyDown(e, 'age')}
                                                    className="w-20 bg-black/20 px-3 py-1 rounded border border-primary/50 text-xl font-medium outline-none text-foreground"
                                                    placeholder="25"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-3xl font-serif text-foreground mt-2 group-hover:text-primary transition-colors">
                                                {formData.age ? formData.age : <span className="text-xl text-muted-foreground italic">Add</span>}
                                            </p>
                                        )}
                                    </div>
                                    <div className="p-3 bg-zinc-900 rounded-full text-zinc-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                </div>
                            </section>

                            {/* Member Status Card - SOLID */}
                            <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-lg">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Member Status</h4>
                                        <p className="text-3xl font-serif text-foreground mt-2">
                                            Active
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-900/20 text-green-500 rounded-full">
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Saving Indicator */}
                        <AnimatePresence>
                            {(isPending || uploading) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="fixed bottom-8 right-8 bg-foreground text-background px-4 py-2 rounded-full shadow-lg flex items-center gap-3 z-50 text-sm font-medium"
                                >
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {uploading ? "Uploading image..." : "Saving changes..."}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                </div>
            </div>
        </div>
    )
}
