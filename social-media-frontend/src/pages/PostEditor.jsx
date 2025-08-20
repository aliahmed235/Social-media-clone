import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import Spinner from '../components/Spinner.jsx'

export default function PostEditor(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(Boolean(id))
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!id) return
        (async () => {
            try{
                const { data } = await api.get(`/posts/${id}`)
                const p = data?.data || data
                setTitle(p?.title || '')
                setBody(p?.body || '')
            }catch{ setError('Failed to load post.') }
            finally{ setLoading(false) }
        })()
    }, [id])

    const save = async (e) => {
        e.preventDefault()
        setError(null)
        try{
            if (id){
                await api.patch(`/posts/${id}`, { title, body })
            }else{
                await api.post('/posts', { title, body })
            }
            navigate(id ? '/me/posts' : '/')
        }catch(err){
            setError(err?.response?.data?.message || 'Save failed.')
        }
    }

    if (loading) return <div className="container"><Spinner/></div>

    return (
        <div className="container">
            <div className="card p-5">
                <h2 style={{marginTop:0}}>{id ? 'Edit Post' : 'New Post'}</h2>
                {error && <div className="small" style={{color:'var(--danger)'}}>{error}</div>}
                <form className="grid" onSubmit={save} style={{gap:'1rem'}}>
                    <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required minLength={2}/>
                    <textarea className="input" rows="8" placeholder="Write something..." value={body} onChange={e=>setBody(e.target.value)} required minLength={2}></textarea>
                    <div className="row" style={{justifyContent:'flex-end'}}>
                        <button className="btn secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
                        <button className="btn" type="submit">{id ? 'Save changes' : 'Publish'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
