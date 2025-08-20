export function normalizePost(raw){
    if (!raw) return null
    const user = raw.user || {}
    return {
        id: raw.id,
        title: raw.title ?? '',
        body: raw.body ?? '',
        created_at: raw.created_at ?? null,
        updated_at: raw.updated_at ?? null,
        user: {
            id: user.id ?? raw.user_id ?? null,
            name: user.name ?? raw.user_name ?? 'User'
        },
        deleted_at: raw.deleted_at ?? null
    }
}
