import { Link } from 'react-router-dom'
import './NotFound.css'


export default function NotFound() {
    return (
        <div className='notFound'>
            This page doesn't exist.
            <Link to="/">Return to home page</Link>
        </div>
    )
}