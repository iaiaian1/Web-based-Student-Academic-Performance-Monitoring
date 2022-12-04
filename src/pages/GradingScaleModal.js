import ReactDOM from "react-dom";

const GradingScaleModal = ({ open, children, onClose }) => {

    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <p className="text-2xl font-bold mb-5 underline">Grading system</p>
                <div className="w-full h-full">
                    <div className="flex justify-around">
                        <div className="font-bold">
                            <p>Performance</p>
                            <p>Summative</p>
                            <p>Periodical/Quarterly</p>
                        </div>
                        <div className="font-bold">
                            <p>- 50%</p>
                            <p>- 30%</p>
                            <p className="border-b-2 border-black">- 20%</p>
                            <p>&nbsp;100%</p>
                        </div>
                    </div>
                    <div className="font-bold flex flex-col mt-5 gap-y-2">
                        <p>Outsanding 90-100</p>
                        <p>Very satisfactory 85-89</p>
                        <p>Satisfactory 80-84</p>
                        <p>Fairly satisfactory 75-79</p>
                        <p>Did not meet expectations &gt;75</p>
                    </div>
                </div>
                <button className="bg-red-500 py-1 px-5 rounded-lg font-bold mt-2" onClick={onClose}>CLOSE</button>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default GradingScaleModal;