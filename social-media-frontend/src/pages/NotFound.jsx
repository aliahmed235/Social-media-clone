import { Link } from 'react-router-dom'
export default function NotFound(){
    return (
        <div className="container center">
            <h2>Not found</h2>
            <p className="small">That page doesn’t exist.</p>
            <Link className="btn" to="/">Go home</Link>
        </div>
    )
}
