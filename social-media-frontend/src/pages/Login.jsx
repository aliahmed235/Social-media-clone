import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api.js'
import { setAuth } from '../auth'

export default function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const submit = async (e) => {
        e.preventDefault()
        setError(null)
        try{
            const { data } = await api.post('/login', { email, password })
            const user = data?.user || data?.data?.user || null
            const token = data?.token || data?.data?.token || data?.access_token
            if (user && token){ setAuth(user, token); navigate('/') }
            else setError('Unexpected response from server.')
        }catch(err){
            setError(err?.response?.data?.message || 'Invalid credentials.')
        }
    }

    return (
        <div className="container">
            <div className="card p-5" style={{maxWidth:'520px', margin:'6vh auto'}}>
                <h2 style={{marginTop:0}}>Welcome back</h2>
                {error && <div className="small" style={{color:'var(--danger)'}}>{error}</div>}
                <form className="grid" onSubmit={submit}>
                    <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                    <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                    <button className="btn" type="submit">Log in</button>
                    <div className="small">No account? <Link to="/signup">Create one</Link></div>
                </form>
            </div>
        </div>
    )
}
