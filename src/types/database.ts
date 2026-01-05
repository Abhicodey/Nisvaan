export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type UserRole = 'user' | 'media_manager' | 'president'
export type ModerationState = 'normal' | 'under_review' | 'removed' | 'suspended'

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string
                    age: number | null
                    bio: string | null
                    avatar_url: string | null
                    role: UserRole
                    account_status: ModerationState
                    moderation_state: ModerationState
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    age?: number | null
                    bio?: string | null
                    avatar_url?: string | null
                    role?: UserRole
                    account_status?: ModerationState
                    moderation_state?: ModerationState
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    age?: number | null
                    bio?: string | null
                    avatar_url?: string | null
                    role?: UserRole
                    account_status?: ModerationState
                    moderation_state?: ModerationState
                    created_at?: string
                }
            }
            posts: {
                Row: {
                    id: string
                    title: string
                    content: string
                    category: string | null
                    author_id: string
                    moderation_state: ModerationState
                    image_url: string | null // Kept for UI
                    excerpt: string | null   // Kept for UI
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    content: string
                    category?: string | null
                    author_id: string
                    moderation_state?: ModerationState
                    image_url?: string | null
                    excerpt?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    content?: string
                    category?: string | null
                    author_id?: string
                    moderation_state?: ModerationState
                    image_url?: string | null
                    excerpt?: string | null
                    created_at?: string
                }
            }
            voice_likes: {
                Row: {
                    id: string
                    post_id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    user_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    user_id?: string
                    created_at?: string
                }
            }
            reports: {
                Row: {
                    id: string
                    post_id: string
                    reported_by: string
                    reason: 'abuse' | 'hate' | 'harassment' | 'spam' | 'misinformation'
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    reported_by: string
                    reason: 'abuse' | 'hate' | 'harassment' | 'spam' | 'misinformation'
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    reported_by?: string
                    reason?: 'abuse' | 'hate' | 'harassment' | 'spam' | 'misinformation'
                    created_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    message: string
                    link: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    message: string
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    message?: string
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
            }
            logs: {
                Row: {
                    id: string
                    action: string
                    performed_by: string | null
                    target_id: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    action: string
                    performed_by?: string | null
                    target_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    action?: string
                    performed_by?: string | null
                    target_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    title: string
                    date: string | null
                    location: string | null
                    image_urls: string[] | null
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    date?: string | null
                    location?: string | null
                    image_urls?: string[] | null
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    date?: string | null
                    location?: string | null
                    image_urls?: string[] | null
                    created_by?: string | null
                    created_at?: string
                }
            }
            event_registrations: {
                Row: {
                    id: string
                    event_id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    user_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    user_id?: string
                    created_at?: string
                }
            }
            feedback: {
                Row: {
                    id: string
                    message: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    message: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    message?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [key: string]: {
                Row: Record<string, unknown>
            }
        }
        Functions: {
            [key: string]: {
                Args: Record<string, unknown>
                Returns: unknown
            }
        }
        Enums: {
            user_role: UserRole
            moderation_state: ModerationState
        }
    }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Entity Types for easier import
export type Profile = Tables<'profiles'>
export type Post = Tables<'posts'>
// export type Thought = Tables<'thoughts'> // Removed
export type VoiceLike = Tables<'voice_likes'>
export type Report = Tables<'reports'>
export type Notification = Tables<'notifications'>
export type Event = Tables<'events'>
export type EventRegistration = Tables<'event_registrations'>
export type Feedback = Tables<'feedback'>
export type Log = Tables<'logs'>
