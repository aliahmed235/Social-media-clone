import { Link, useNavigate } from "react-router-dom";
import { getUser, isAuthed, clearAuth } from "./auth";
import api from "./api";

export default function Nav() {
    const user = getUser();
    const navigate = useNavigate();

    async function logout() {
        try { await api.post("/logout"); } catch {}
        clearAuth();
        navigate("/login");
    }

    return (
        <header className="header">
            <div className="header-inner">
                <div className="brand">
                    <span className="brand-badge">SM</span>
                    <span>Social Media Clone</span>
                </div>

                <div className="toolbar">
                    <Link to="/" className="btn ghost">Feed</Link>

                    {!isAuthed() ? (
                        <>
                            <Link to="/login" className="btn">Login</Link>
                            <Link to="/signup" className="btn primary">Signup</Link>
                        </>
                    ) : (
                        <>
                            <span className="muted">Hi, {user?.name ?? "User"}</span>
                            <button className="btn" onClick={logout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
