export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary animate-spin" />
            </div>
        </div>
    )
}

