'use client'

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createEvent } from '@/app/events/actions'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Upload, Calendar, MapPin, Type, FileText, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

function CreateEventContent() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Determine Type: 'upcoming' or 'past' (default to past/generic if unspecified, but we link with params now)
    const type = searchParams.get('type')
    const isUpcoming = type === 'upcoming'

    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState("")

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const maxImages = isUpcoming ? 1 : 10
        if (files.length + previewUrls.length > maxImages) {
            toast.error(`Maximum ${maxImages} image${maxImages > 1 ? 's' : ''} allowed`)
            return
        }

        setUploading(true)
        setUploadProgress(`0/${files.length}`)

        const supabase = createClient()
        let completed = 0

        const uploadFile = async (file: File) => {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`Skipped ${file.name}: Too large (>10MB)`)
                return null
            }

            const fileExt = file.name.split('.').pop()?.toLowerCase()
            const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `events/${fileName}`

            try {
                const { error: uploadError } = await supabase.storage
                    .from('event-media')
                    .upload(filePath, file, {
                        contentType: file.type,
                        upsert: true
                    })

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('event-media')
                    .getPublicUrl(filePath)

                return publicUrl
            } catch (error) {
                console.error(`Failed to upload ${file.name}`, error)
                toast.error(`Failed to upload ${file.name}`)
                return null
            } finally {
                completed++
                setUploadProgress(`${completed}/${files.length}`)
            }
        }

        const fileArray = Array.from(files)
        const results: (string | null)[] = []
        const MAX_CONCURRENT = 3

        for (let i = 0; i < fileArray.length; i += MAX_CONCURRENT) {
            const chunk = fileArray.slice(i, i + MAX_CONCURRENT)
            const chunkResults = await Promise.all(chunk.map(file => uploadFile(file)))
            results.push(...chunkResults)
        }

        const successUrls = results.filter((url): url is string => url !== null)

        if (successUrls.length > 0) {
            setPreviewUrls(prev => [...prev, ...successUrls])
            toast.success(`${successUrls.length} images uploaded`)
        }

        setUploading(false)
        setUploadProgress("")
        e.target.value = ''
    }

    const removeImage = (index: number) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (previewUrls.length > 0) {
            formData.set('imageUrls', JSON.stringify(previewUrls))
        }

        startTransition(async () => {
            const result = await createEvent(null, formData)
            if (result.success) {
                toast.success(result.message)
                router.push('/events')
            } else {
                toast.error(result.message || "Failed to create event")
            }
        })
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold mb-2">
                        {isUpcoming ? "Schedule Upcoming Event" : "Add Past Event Highlights"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isUpcoming
                            ? "Announce a new event and notify the community."
                            : "Document a past event with a photo gallery and recap."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                    {/* Hidden Type Field */}
                    <input type="hidden" name="eventType" value={type || 'past'} />

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">
                            {isUpcoming ? "Cover Image" : "Event Gallery"}
                        </label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-secondary/50 transition-colors relative group">
                            <input
                                type="file"
                                accept="image/*"
                                multiple={!isUpcoming}
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                disabled={uploading}
                            />
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <span>Uploading {uploadProgress}...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8" />
                                        <span>Click to select {isUpcoming ? "image" : "images"} (Max {isUpcoming ? "1" : "10"})</span>
                                        <span className="text-xs">Direct Client Upload • Max 10MB each</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {previewUrls.map((url, index) => (
                                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden group/img animate-in fade-in zoom-in duration-300">
                                        <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {index === 0 && (
                                            <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-1 font-bold uppercase">
                                                Cover Image
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Type className="w-4 h-4" /> Title
                        </label>
                        <input name="title" required className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all focus:border-primary" placeholder="e.g., Annual Gender Dialogue" />
                    </div>

                    {/* Date & Location */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                required
                                min={isUpcoming ? new Date().toISOString().slice(0, 16) : undefined}
                                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Location
                            </label>
                            <input name="location" required className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all focus:border-primary" placeholder="e.g., Seminar Hall or Zoom" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Description / Context
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={6}
                            className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all focus:border-primary"
                            placeholder="Describe the event..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || uploading}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium shadow hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (isUpcoming ? "Schedule Event" : "Publish Highlights")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function CreateEventPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center"><Loader2 className="animate-spin" /></div>}>
            <CreateEventContent />
        </Suspense>
    )
}
