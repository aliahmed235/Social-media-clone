import { useEffect, useState } from 'react'
import Spinner from '../components/Spinner.jsx'
import PostItem from './PostItem.jsx'
import ConfirmModal from './ConfirmModal.jsx'
import { api } from '../api.js'
import { normalizePost } from '../utils/normalizers'
import { getUser } from '../auth'

export default function MyPosts(){
    const me = getUser()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)
    const [notice, setNotice] = useState(null)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try{
                // If backend supports ?mine=1 this will use it; otherwise we filter here.
                const { data } = await api.get('/posts', { params: { mine: 1 } })
                const list = Array.isArray(data?.data) ? data.data : data
                const normalized = list.map(normalizePost).filter(p => p?.user?.id === me?.id)
                setPosts(normalized)
            }catch(e){
                setNotice('Failed to load your posts.')
            }finally{ setLoading(false) }
        }
        load()
    }, [me?.id])

    const onDelete = (post) => setModal(post)

    const confirmDelete = async () => {
        try{
            await api.delete(`/posts/${modal.id}`)
            setPosts(prev => prev.filter(p => p.id !== modal.id))
            setNotice('Post deleted.')
        }catch(e){
            setNotice('Could not delete post.')
        }finally{ setModal(null) }
    }

    return (
        <div className="container">
            <div className="spread">
                <h2>My Posts</h2>
            </div>
            {loading ? <Spinner/> :
                posts?.length ? (
                    <div className="grid posts">
                        {posts.map(p => <PostItem key={p.id} post={p} onDelete={onDelete} />)}
                    </div>
                ) : <div className="small">You haven’t created any posts yet.</div>
            }
            {modal && (
                <ConfirmModal
                    title="Delete this post?"
                    body="This will permanently remove your post."
                    confirmText="Delete"
                    onConfirm={confirmDelete}
                    onCancel={() => setModal(null)}
                />
            )}
        </div>
    )
}
