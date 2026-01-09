"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps extends ImageProps {
    fallbackClassName?: string
    iconClassName?: string
}

export function ImageWithFallback({
    src,
    alt,
    className,
    fallbackClassName,
    iconClassName,
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(false)
    }, [src])

    if (error) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center bg-secondary/50 text-muted-foreground w-full h-full min-h-[200px] p-4",
                    fallbackClassName,
                    className // Apply original className to maintain layout (e.g., responsive width/height)
                )}
            >
                <div className="bg-background/50 p-3 rounded-full mb-2">
                    <ImageOff className={cn("w-6 h-6 opacity-50", iconClassName)} />
                </div>
                <span className="text-xs font-medium text-center opacity-70">
                    Image not available
                </span>
            </div>
        )
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    )
}
