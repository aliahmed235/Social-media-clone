import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { setAuth } from '../auth'

export default function Signup(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const submit = async (e) => {
        e.preventDefault()
        setError(null)
        try{
            const { data } = await api.post('/signup', { name, email, password })
            const user = data?.user || data?.data?.user || null
            const token = data?.token || data?.data?.token || data?.access_token
            if (user && token){ setAuth(user, token); navigate('/') }
            else setError('Unexpected response from server.')
        }catch(err){
            setError(err?.response?.data?.message || 'Sign up failed.')
        }
    }

    return (
        <div className="container">
            <div className="card p-5" style={{maxWidth:'520px', margin:'6vh auto'}}>
                <h2 style={{marginTop:0}}>Create account</h2>
                {error && <div className="small" style={{color:'var(--danger)'}}>{error}</div>}
                <form className="grid" onSubmit={submit}>
                    <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
                    <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                    <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                    <button className="btn" type="submit">Sign up</button>
                    <div className="small">Have an account? <Link to="/login">Log in</Link></div>
                </form>
            </div>
        </div>
    )
}
