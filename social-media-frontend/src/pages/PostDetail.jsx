import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { isAuthed } from "../auth";

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    const load = async () => {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
    };

    useEffect(() => { load(); }, [id]);

    const deletePost = async () => {
        if (!window.confirm("Delete this post?")) return;
        await api.delete(`/posts/${id}`);
        navigate("/feed");
    };

    if (!post) return <p>Loading...</p>;

    return (
        <div className="card">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            {isAuthed() && (
                <button className="btn" onClick={deletePost}>Delete</button>
            )}
        </div>
    );
}
