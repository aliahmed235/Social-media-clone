export default function ConfirmModal({title='Are you sure?', body='This action cannot be undone.', confirmText='Delete', cancelText='Cancel', onConfirm, onCancel}){
    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="card modal p-5">
                <h3 style={{marginTop:0}}>{title}</h3>
                <p className="small">{body}</p>
                <div className="row mt-4" style={{justifyContent:'flex-end'}}>
                    <button className="btn secondary" onClick={onCancel}>{cancelText}</button>
                    <button className="btn danger" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    )
}
