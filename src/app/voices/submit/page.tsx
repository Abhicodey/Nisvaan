'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { submitPost } from '../actions'
import { Loader2, Image as ImageIcon, Send, ArrowLeft, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function SubmitVoicePage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [user, setUser] = useState<any>(null)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        category: '',
        content: '',
        imageUrl: ''
    })

    const categories = [
        "Personal Story",
        "Op-Ed",
        "Poetry",
        "Interview",
        "Analysis",
        "Community"
    ]

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login?next=/voices/submit')
            } else {
                setUser(user)
            }
        }
        checkUser()
    }, [router])

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0]
            if (!file) return

            // Client-side size check (e.g. 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB")
                return
            }

            setUploading(true)
            const supabase = createClient()

            // Get user if not already available (though checkUser effect should have run)
            const currentUser = user || (await supabase.auth.getUser()).data.user
            if (!currentUser) throw new Error("User not found")

            const fileExt = file.name.split('.').pop()
            const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, imageUrl: publicUrl }))
            toast.success("Cover image uploaded")

        } catch (error: any) {
            console.error(error)
            toast.error("Error uploading image: " + (error.message || "Unknown error"))
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Submit initiated")

        startTransition(async () => {
            try {
                const submitData = new FormData()
                submitData.append('title', formData.title)
                submitData.append('excerpt', formData.excerpt)
                submitData.append('category', formData.category)
                submitData.append('content', formData.content)
                if (formData.imageUrl) submitData.append('imageUrl', formData.imageUrl)

                console.log("Sending data to server:", Object.fromEntries(submitData))

                const result = await submitPost(null, submitData)
                console.log("Server response:", result)

                if (result.success) {
                    toast.success("Post submitted for review!")
                    router.push('/voices')
                } else {
                    console.error("Submission failed:", result.message)
                    toast.error(result.message || "Failed to submit post")
                }
            } catch (err) {
                console.error("Client-side submission error:", err)
                toast.error("An unexpected error occurred")
            }
        })
    }

    if (!user) return null // Loading or redirecting

    return (
        <div className="min-h-screen relative overflow-hidden pt-24 pb-20">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lavender/20 via-background to-background -z-20" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <Link href="/voices" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Voices
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
                        Submit a <span className="text-primary">Voice</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Share your story, opinion, or art with the Nisvaan community.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden p-8 md:p-10 relative">
                    {/* Gloss */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Title</label>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Give your piece a compelling title..."
                                className="w-full bg-transparent border-b-2 border-border focus:border-primary px-0 py-3 text-3xl font-serif font-bold placeholder:text-muted-foreground/30 outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer hover:bg-secondary/50"
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Cover Image</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        hidden
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                    />
                                    {formData.imageUrl ? (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden group cursor-pointer border border-border" onClick={() => fileInputRef.current?.click()}>
                                            <Image src={formData.imageUrl} alt="Cover" fill className="object-cover transition-transform group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-medium flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Change Image</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, imageUrl: '' }) }}
                                                className="absolute top-2 right-2 bg-black/50 hover:bg-destructive text-white p-1 rounded-full backdrop-blur-sm transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-6 h-6" />
                                                    <span className="text-sm font-medium">Click to upload cover image</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Excerpt / Summary</label>
                            <textarea
                                required
                                maxLength={300}
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="A short description of your post (appears in previews)..."
                                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[80px]"
                            />
                            <div className="text-right text-xs text-muted-foreground">{formData.excerpt.length}/300</div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Content</label>
                            <textarea
                                required
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your story here... (Markdown supported)"
                                className="w-full bg-secondary/30 border border-border rounded-xl px-6 py-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[400px] font-serif text-lg leading-relaxed"
                            />
                            <div className={`text-right text-xs mt-2 ${formData.content.length < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {formData.content.length} / 50 characters minimum
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isPending || uploading}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 shadow-lg hover:shadow-primary/25"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Voice <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
