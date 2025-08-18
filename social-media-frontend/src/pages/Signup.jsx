import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { setAuth } from "../auth";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [fieldErrs, setFieldErrs] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validEmail = (v) => /\S+@\S+\.\S+/.test(v);

    async function submit(e) {
        e.preventDefault();
        setErr(""); setMsg(""); setFieldErrs({});
        if (!name || !email || !password) return setErr("All fields are required.");
        if (!validEmail(email)) return setErr("Please enter a valid email address.");
        if (password.length < 6) return setErr("Password must be at least 6 characters.");

        try {
            setLoading(true);
            const { data } = await api.post("/signup", { name, email, password }); // { user, token }
            setAuth(data.user, data.token);
            setMsg("Signed up!");
            navigate("/");
        } catch (e) {
            const status = e?.response?.status;
            const errors = e?.response?.data?.errors;
            if (errors && typeof errors === "object") {
                setFieldErrs(errors);
                setErr("Please fix the highlighted fields.");
            } else if (status === 409) {
                setErr("That email is already registered.");
            } else if (status === 422) {
                setErr(e?.response?.data?.message || "Invalid input.");
            } else {
                setErr("Signup failed. Check your connection and try again.");
            }
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
                        <h2>Signup</h2>
                        <form className="form" onSubmit={submit}>
                            <div>
                                <input className="input" placeholder="Name"
                                       value={name} onChange={(e)=>setName(e.target.value)}
                                       aria-invalid={Boolean(fieldErrs.name)} />
                                {fieldErrs.name && <small style={{ color: "crimson" }}>{fieldErrs.name[0]}</small>}
                            </div>

                            <div>
                                <input className="input" placeholder="Email" type="email"
                                       value={email} onChange={(e)=>setEmail(e.target.value)}
                                       aria-invalid={Boolean(fieldErrs.email)} autoComplete="email" />
                                {fieldErrs.email && <small style={{ color: "crimson" }}>{fieldErrs.email[0]}</small>}
                            </div>

                            <div>
                                <input className="input" placeholder="Password" type="password"
                                       value={password} onChange={(e)=>setPassword(e.target.value)}
                                       aria-invalid={Boolean(fieldErrs.password)} autoComplete="new-password" />
                                {fieldErrs.password && <small style={{ color: "crimson" }}>{fieldErrs.password[0]}</small>}
                            </div>

                            <button className="btn primary" type="submit" disabled={loading}>
                                {loading ? "Creating account..." : "Create account"}
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
