import { NavLink, useNavigate } from 'react-router-dom'
import { getUser, clearToken, clearUser, isAuthed } from '../auth'

export default function Nav(){
    const navigate = useNavigate()
    const user = getUser()

    const logout = () => {
        clearToken(); clearUser()
        navigate('/login')
    }

    return (
        <nav className="header card sticky">
            <div className="container spread">
                <div className="row wrap">
                    <div className="brand">🔥 Social</div>
                    <div className="badge">Dark Blue</div>
                </div>
                <div className="row links">
                    <NavLink to="/" end>Feed</NavLink>
                    {isAuthed() && <NavLink to="/me/posts">My Posts</NavLink>}
                    {isAuthed() && <NavLink to="/posts/new">New</NavLink>}
                    {!isAuthed() && <NavLink to="/login">Login</NavLink>}
                    {!isAuthed() && <NavLink to="/signup">Signup</NavLink>}
                    {isAuthed() && <button className="btn secondary" onClick={logout}>Logout{user?.name?` (${user.name})`:''}</button>}
                </div>
            </div>
        </nav>
    )
}
