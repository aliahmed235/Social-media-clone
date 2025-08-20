import { useEffect, useState } from 'react'

export default function Notice({ message, type='info', duration=2600 }){
    const [open, setOpen] = useState(Boolean(message))
    useEffect(() => {
        if (!message) return
        setOpen(true)
        const t = setTimeout(() => setOpen(false), duration)
        return () => clearTimeout(t)
    }, [message, duration])

    if (!open) return null
    const color = type === 'error' ? 'var(--danger)' : (type==='success' ? 'var(--success)' : 'var(--primary)')
    return (
        <div className="container" role="status" aria-live="polite">
            <div className="card p-3" style={{borderColor: color}}>
                <div className="row spread">
                    <div style={{fontWeight:700, color}}>{type.toUpperCase()}</div>
                    <div className="small">{message}</div>
                </div>
            </div>
        </div>
    )
}
