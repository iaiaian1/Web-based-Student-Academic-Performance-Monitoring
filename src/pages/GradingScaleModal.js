import ReactDOM from "react-dom";

const GradingScaleModal = ({ open, children, onClose }) => {

    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-start justify-center h-1/3 w-2/3 rounded-lg bg-blue-400 p-5">
                <p className="text-2xl font-bold mb-5">Add section</p>
                asdasd
                <button onClick={onClose}>CLOSE</button>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default GradingScaleModal;