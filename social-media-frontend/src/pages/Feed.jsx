import { useEffect, useState } from "react";
import api from "../api";
import { getUser } from "../auth";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const currentUser = getUser();

    async function load(url = "/posts") {
        setErr(""); setMsg("");
        try {
            const { data } = await api.get(url);
            setPosts(Array.isArray(data) ? data : data.data ?? []);
        } catch (e) {
            setErr("Failed to load posts");
            console.error(e);
        }
    }

    async function createPost(e) {
        e.preventDefault();
        try {
            await api.post("/posts", { title, body });
            setTitle(""); setBody("");
            setMsg("Post created");
            load();
        } catch (e) {
            setErr(e?.response?.data?.message || "Create failed");
        }
    }

    function startEdit(p) {
        setEditingId(p.id);
        setEditTitle(p.title);
        setEditBody(p.body);
    }

    async function saveEdit(id) {
        try {
            await api.put(`/posts/${id}`, { title: editTitle, body: editBody });
            setEditingId(null);
            setMsg("Post updated");
            load();
        } catch (e) {
            setErr(e?.response?.data?.message || "Update failed");
        }
    }

    async function remove(id) {
        try {
            await api.delete(`/posts/${id}`);
            setMsg("Post deleted");
            load();
        } catch (e) {
            setErr(e?.response?.data?.message || "Delete failed");
        }
    }

    async function restore(id) {
        try {
            await api.post(`/posts/${id}/restore`);
            setMsg("Post restored");
            load();
        } catch (e) {
            setErr(e?.response?.data?.message || "Restore failed");
        }
    }

    useEffect(() => { load(); }, []);

    return (
        <main className="container">
            <div className="grid">
                <section className="card">
                    <div className="card-inner">
                        <h2>Feed</h2>

                        {currentUser ? (
                            <form className="form" onSubmit={createPost} style={{ marginTop: 8 }}>
                                <input className="input" placeholder="Title" value={title}
                                       onChange={(e)=>setTitle(e.target.value)} />
                                <textarea className="textarea" placeholder="What's on your mind?" value={body}
                                          onChange={(e)=>setBody(e.target.value)} />
                                <button className="btn primary" type="submit">Post</button>
                            </form>
                        ) : (
                            <p className="muted">Log in to create a post.</p>
                        )}

                        {msg && <p style={{ color: "var(--accent-2)" }}>{msg}</p>}
                        {err && <p style={{ color: "crimson" }}>{err}</p>}
                    </div>
                </section>

                <aside className="card">
                    <div className="card-inner">
                        <h2>Tips</h2>
                        <p className="muted">Your API base is proxied via <code>/api</code> in dev.</p>
                        <p className="muted">Soft-deleted posts can be restored.</p>
                    </div>
                </aside>
            </div>

            <section className="card" style={{ marginTop: 16 }}>
                <div className="card-inner">
                    <h2>Recent posts</h2>
                    <div className="feed">
                        {posts.map((p) => {
                            const isOwner = currentUser && p.user_id === currentUser.id;
                            return (
                                <article className="post" key={p.id}>
                                    {editingId === p.id ? (
                                        <>
                                            <input className="input" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} />
                                            <textarea className="textarea" value={editBody} onChange={(e)=>setEditBody(e.target.value)} />
                                            <div style={{ display:"flex", gap:10 }}>
                                                <button className="btn primary" onClick={()=>saveEdit(p.id)}>Save</button>
                                                <button className="btn" onClick={()=>setEditingId(null)}>Cancel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="post-title">{p.title}</h3>
                                            <div style={{ whiteSpace: "pre-wrap" }}>{p.body}</div>
                                            <div className="post-meta">#{p.id}{p.deleted_at ? " • (deleted)" : ""}</div>

                                            {isOwner && (
                                                <div style={{ display:"flex", gap:10, marginTop: 8 }}>
                                                    <button className="btn" onClick={()=>startEdit(p)}>Edit</button>
                                                    {!p.deleted_at ? (
                                                        <button className="btn" onClick={()=>remove(p.id)}>Delete</button>
                                                    ) : (
                                                        <button className="btn" onClick={()=>restore(p.id)}>Restore</button>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </article>
                            );
                        })}
                        {posts.length === 0 && <p className="muted">No posts yet.</p>}
                    </div>
                </div>
            </section>
        </main>
    );
}
