import { supabase } from './supabaseClient'

export const authService = {
    async signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { data, error }
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },

    async signOut() {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    onAuthStateChange(callback: (session: any) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session)
        })
    },

    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession()
        return { session, error }
    }
}
