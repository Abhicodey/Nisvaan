
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { login, signup } from "./actions"
import { GoogleAuthButton } from "./GoogleAuthButton"
import Link from "next/link"
import { ArrowLeft, User, Lock, Mail, Calendar } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [loading, setLoading] = useState(false)

    // We wrap the server actions to handle loading state
    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        if (mode === 'signup') {
            const password = formData.get('password') as string
            const confirm = formData.get('confirmPassword') as string
            if (password !== confirm) {
                alert("Passwords do not match!")
                setLoading(false)
                return
            }
            const res = await signup(formData)
            if (res?.success) {
                router.push('/')
            } else {
                alert(res?.error || "Signup failed")
            }
        } else {
            const res = await login(formData)
            if (res?.success) {
                router.push('/') // Redirect login to home as well for better UX
            } else {
                alert(res?.error || "Login failed")
            }
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />

            {/* Return Home */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors z-20">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="w-full max-w-md bg-card/40 backdrop-blur-md border border-border/50 shadow-2xl rounded-3xl overflow-hidden relative z-10">

                {/* Toggle Header */}
                <div className="flex bg-secondary/50 p-1.5 m-4 rounded-xl relative">
                    <motion.div
                        className="absolute inset-y-1.5 rounded-lg bg-card shadow-sm"
                        initial={false}
                        animate={{
                            left: mode === 'login' ? '0.375rem' : '50%',
                            width: 'calc(50% - 0.375rem)'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />

                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors text-center ${mode === 'login' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode('signup')}
                        className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors text-center ${mode === 'signup' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="px-8 pb-8 pt-2">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-foreground">
                            {mode === 'login' ? 'Welcome Back' : 'Join Nisvaan'}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-2">
                            {mode === 'login' ? 'Continue your journey with us.' : 'Start your journey of dialogue and change.'}
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {/* Signup Extra Fields */}
                                {mode === 'signup' && (
                                    <>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                name="fullName"
                                                required
                                                placeholder="Full Name"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50 text-foreground"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                name="age"
                                                type="number"
                                                required
                                                placeholder="Age"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50 text-foreground"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Common Fields */}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Email Address"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50 text-foreground"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Password"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50 text-foreground"
                                    />
                                </div>

                                {mode === 'signup' && (
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            placeholder="Confirm Password"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50 text-foreground"
                                        />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                    </div>

                    <GoogleAuthButton />

                    <p className="text-center text-xs text-muted-foreground mt-8">
                        By {mode === 'login' ? 'signing in' : 'signing up'}, you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
