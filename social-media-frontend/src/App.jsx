import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Feed from './pages/Feed.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import MyPosts from './pages/MyPosts.jsx'
import NotFound from './pages/NotFound.jsx'
import PostEditor from './pages/PostEditor.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './App.css'

export default function App(){
    return (
        <div>
            <Nav />
            <Routes>
                <Route path="/" element={<Feed/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />

                <Route element={<ProtectedRoute/>}>
                    <Route path="/me/posts" element={<MyPosts/>} />
                    <Route path="/posts/new" element={<PostEditor/>} />
                    <Route path="/posts/:id/edit" element={<PostEditor/>} />
                </Route>

                <Route path="*" element={<NotFound/>} />
            </Routes>
            <footer className="container footer">Built for your Laravel API. Theme: Dark Blue.</footer>
        </div>
    )
}
