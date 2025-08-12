import { useEffect, useState } from "react";
import api, { setToken, getToken } from "./api";

export default function App() {
    const [mode, setMode] = useState(getToken() ? "feed" : "signup"); // 'signup' | 'login' | 'feed'
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [post, setPost] = useState({ title: "", body: "" });
    const [posts, setPosts] = useState([]);
    const [busy, setBusy] = useState(false);

    useEffect(() => { fetchPosts(); }, []);

    async function fetchPosts() {
        try {
            const { data } = await api.get("/api/posts");
            setPosts(data);
        } catch (e) {
            console.error(e);
            alert("Failed to load posts");
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        setBusy(true);
        try {
            const { data } = await api.post("/api/signup", form);
            setToken(data.token);
            setMode("feed");
            setForm({ name: "", email: "", password: "" });
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        } finally { setBusy(false); }
    }

    async function handleLogin(e) {
        e.preventDefault();
        setBusy(true);
        try {
            const { data } = await api.post("/api/login", {
                email: form.email,
                password: form.password,
            });
            setToken(data.token);
            setMode("feed");
            setForm({ name: "", email: "", password: "" });
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally { setBusy(false); }
    }

    async function handleCreatePost(e) {
        e.preventDefault();
        setBusy(true);
        try {
            await api.post("/api/posts", post);
            setPost({ title: "", body: "" });
            await fetchPosts();
        } catch (err) {
            const m = err.response?.data?.message || JSON.stringify(err.response?.data?.errors ?? {});
            alert("Create failed: " + m);
        } finally { setBusy(false); }
    }

    function logout() {
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
        setMode("login");
    }

    return (
        <>
            <header className="header">
                <div className="header-inner">
                    <div className="brand">
                        <div className="brand-badge">SM</div>
                        <div>Social Media Clone</div>
                    </div>
                    <div className="toolbar">
                        <button className="btn ghost" onClick={() => setMode("feed")}>Feed</button>
                        {!getToken() ? (
                            <>
                                <button className="btn" onClick={() => setMode("signup")}>Sign up</button>
                                <button className="btn" onClick={() => setMode("login")}>Log in</button>
                            </>
                        ) : (
                            <button className="btn" onClick={logout}>Log out</button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container">
                <div className="grid">
                    <section className="card">
                        <div className="card-inner">
                            {mode === "signup" && !getToken() && (
                                <form className="form" onSubmit={handleSignup}>
                                    <h2>Create account</h2>
                                    <input className="input" placeholder="Name" required
                                           value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
                                    <input className="input" type="email" placeholder="Email" required
                                           value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
                                    <input className="input" type="password" placeholder="Password (min 8)" required
                                           value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
                                    <div style={{display:'flex', gap:10}}>
                                        <button className="btn primary" disabled={busy} type="submit">
                                            {busy ? "Creating..." : "Sign up"}
                                        </button>
                                        <button className="btn" type="button" onClick={()=>setMode("login")}>I have an account</button>
                                    </div>
                                </form>
                            )}

                            {mode === "login" && !getToken() && (
                                <form className="form" onSubmit={handleLogin}>
                                    <h2>Welcome back</h2>
                                    <input className="input" type="email" placeholder="Email" required
                                           value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
                                    <input className="input" type="password" placeholder="Password" required
                                           value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
                                    <div style={{display:'flex', gap:10}}>
                                        <button className="btn primary" disabled={busy} type="submit">
                                            {busy ? "Logging in..." : "Log in"}
                                        </button>
                                        <button className="btn" type="button" onClick={()=>setMode("signup")}>Create account</button>
                                    </div>
                                </form>
                            )}

                            {mode === "feed" && (
                                <>
                                    <h2>Feed</h2>
                                    {getToken() ? (
                                        <form className="form" onSubmit={handleCreatePost} style={{marginTop:8}}>
                                            <input className="input" placeholder="Title" required
                                                   value={post.title} onChange={e=>setPost({...post, title:e.target.value})}/>
                                            <textarea className="textarea" placeholder="What's on your mind?" required
                                                      value={post.body} onChange={e=>setPost({...post, body:e.target.value})}/>
                                            <button className="btn primary" disabled={busy} type="submit">
                                                {busy ? "Posting..." : "Post"}
                                            </button>
                                        </form>
                                    ) : (
                                        <p className="muted">Log in to create a post.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </section>

                    <aside className="card">
                        <div className="card-inner">
                            <h2>Tips</h2>
                            <p className="muted">Use a second browser tab at <code>/api/posts</code> to watch the feed JSON while you post here.</p>
                            <p className="muted">All requests talk to your Laravel API at <code>http://127.0.0.1:8000</code>.</p>
                        </div>
                    </aside>
                </div>

                <section className="card" style={{marginTop:16}}>
                    <div className="card-inner">
                        <h2>Recent posts</h2>
                        <div className="feed">
                            {posts.map(p => (
                                <article className="post" key={p.id}>
                                    <h3 className="post-title">{p.title}</h3>
                                    <div style={{whiteSpace:"pre-wrap"}}>{p.body}</div>
                                    <div className="post-meta">#{p.id}</div>
                                </article>
                            ))}
                            {posts.length === 0 && <p className="muted">No posts yet.</p>}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
