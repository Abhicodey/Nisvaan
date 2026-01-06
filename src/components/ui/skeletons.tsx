import { Loader2 } from "lucide-react";

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto animate-pulse">
            {/* Header */}
            <div className="mb-10">
                <div className="h-8 w-64 bg-secondary/50 rounded-lg mb-4"></div>
                <div className="h-4 w-96 bg-secondary/30 rounded-lg"></div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border">
                <div className="h-10 w-32 bg-secondary/40 rounded-t-lg"></div>
                <div className="h-10 w-32 bg-secondary/40 rounded-t-lg"></div>
                <div className="h-10 w-32 bg-secondary/40 rounded-t-lg"></div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                <div className="h-8 w-48 bg-secondary/50 rounded-lg mb-4"></div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="h-48 bg-card border border-border rounded-xl"></div>
                    <div className="h-48 bg-card border border-border rounded-xl"></div>
                </div>
            </div>
        </div>
    )
}

export function NavbarSkeleton() {
    return (
        <div className="flex items-center gap-6 animate-pulse">
            <div className="h-4 w-16 bg-secondary/50 rounded"></div>
            <div className="h-4 w-16 bg-secondary/50 rounded"></div>
            <div className="h-8 w-8 rounded-full bg-secondary/50"></div>
        </div>
    )
}

export function ProfileSkeleton() {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Left Column */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col items-center h-[500px]">
                        <div className="w-40 h-40 rounded-full bg-secondary mb-6"></div>
                        <div className="h-8 w-48 bg-secondary/50 rounded mb-4"></div>
                        <div className="h-4 w-32 bg-secondary/30 rounded mb-6"></div>
                        <div className="h-10 w-full bg-secondary/20 rounded-xl mt-auto"></div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="h-12 w-64 bg-secondary/50 rounded mb-8"></div>

                    {/* Bio Section */}
                    <div className="bg-card border border-border/50 rounded-3xl p-10 h-64"></div>

                    {/* Grid */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-card border border-border/50 rounded-3xl p-6 h-32"></div>
                        <div className="bg-card border border-border/50 rounded-3xl p-6 h-32"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
