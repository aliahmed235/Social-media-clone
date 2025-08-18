import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { setAuth } from "../auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setErr(""); setMsg("");
        if (!email || !password) return setErr("Email and password are required.");
        try {
            setLoading(true);
            const { data } = await api.post("/login", { email, password }); // { user, token }
            setAuth(data.user, data.token);
            setMsg("Logged in");
            navigate("/");
        } catch (e) {
            const status = e?.response?.status;
            if (status === 401) setErr("Invalid credentials.");
            else if (status === 422) setErr("Please check the email/password format.");
            else setErr("Network or server error. Try again.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container">
            <div className="grid">
                <section className="card">
                    <div className="card-inner">
                        <h2>Login</h2>
                        <form className="form" onSubmit={submit}>
                            <input className="input" placeholder="Email" type="email"
                                   value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" />
                            <input className="input" placeholder="Password" type="password"
                                   value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" />
                            <button className="btn primary" type="submit" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        {msg && <p style={{ color: "var(--accent-2)", marginTop: 10 }}>{msg}</p>}
                        {err && <p style={{ color: "crimson", marginTop: 10 }}>{err}</p>}
                    </div>
                </section>
            </div>
        </main>
    );
}
