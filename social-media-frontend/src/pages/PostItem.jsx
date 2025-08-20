import { Link } from 'react-router-dom'
import { getUser } from '../auth'

export default function PostItem({ post, onDelete }){
    const me = getUser()
    const isOwner = me?.id && (post?.user?.id === me.id)

    return (
        <article className="card p-4">
            <header className="spread mb-2">
                <h3 style={{margin:0, fontSize:'1.1rem'}}>{post.title}</h3>
                <span className="badge">by {post.user?.name ?? 'Unknown'}</span>
            </header>
            <p className="small" style={{whiteSpace:'pre-wrap'}}>{post.body}</p>
            <footer className="row mt-3">
                {isOwner && (
                    <>
                        <Link className="btn secondary" to={`/posts/${post.id}/edit`}>Edit</Link>
                        <button className="btn danger" onClick={() => onDelete?.(post)}>Delete</button>
                    </>
                )}
            </footer>
        </article>
    )
}
