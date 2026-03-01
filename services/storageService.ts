import { supabase } from './supabaseClient'

export const storageService = {
    async uploadMedia(file: File, bucket: string = 'post-media') {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { data: null, error: new Error('User not authenticated') }

        const fileName = `${user.id}/${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file)

        if (error) return { data: null, error }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)

        return { publicUrl, error: null }
    }
}
