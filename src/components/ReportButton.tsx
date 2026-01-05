
"use client"

import { useState } from "react"
import { Flag, AlertTriangle, X } from "lucide-react"
import { useFormState } from "react-dom"
import { reportContent } from "@/app/actions/report"

interface ReportButtonProps {
    targetId: string
    targetType: 'post' | 'thought' | 'profile'
    className?: string
}

const reasons = [
    "Hate speech or discrimination",
    "Harassment or bullying",
    "Nudity or sexual activity",
    "Misinformation",
    "Spam or self-promotion",
    "Other"
]

const initialState = {
    message: '',
    success: false
}

export function ReportButton({ targetId, targetType, className }: ReportButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [state, formAction] = useFormState(reportContent, initialState)
    const [justReported, setJustReported] = useState(false)

    if (state.success && !justReported) {
        setJustReported(true)
        setTimeout(() => {
            setIsOpen(false)
            setJustReported(false)
        }, 2000)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`text-muted-foreground/50 hover:text-destructive transition-colors ${className}`}
                title="Report Content"
            >
                <Flag className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6 text-destructive">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className="text-xl font-serif font-bold">Report Content</h3>
                        </div>

                        {state.success ? (
                            <div className="text-center py-8 text-green-600">
                                <p className="font-medium">{state.message}</p>
                            </div>
                        ) : (
                            <form action={formAction} className="space-y-4">
                                <input type="hidden" name="targetId" value={targetId} />
                                <input type="hidden" name="targetType" value={targetType} />

                                <div>
                                    <label className="block text-sm font-medium mb-2">Why are you reporting this?</label>
                                    <select name="reason" className="w-full p-2 rounded-lg bg-secondary/50 border border-border" required>
                                        <option value="">Select a reason...</option>
                                        {reasons.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Additional details (optional)</label>
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        className="w-full p-2 rounded-lg bg-secondary/50 border border-border resize-none"
                                        placeholder="Help us understand the issue..."
                                    />
                                </div>

                                <div className="pt-2 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 rounded-full border border-border hover:bg-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
