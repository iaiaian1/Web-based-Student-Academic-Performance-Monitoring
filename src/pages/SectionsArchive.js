import ReactDOM from "react-dom";

const SectionsArchive = ({ open, children, onClose }) => {

    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <p className="text-2xl font-bold mb-5">Sections archive</p>
                <p>Go to admin to reactivate a section</p>
                
                <button className="bg-green-400 py-1 px-5 rounded-lg font-bold mt-2" onClick={onClose}>CLOSE</button>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default SectionsArchive;