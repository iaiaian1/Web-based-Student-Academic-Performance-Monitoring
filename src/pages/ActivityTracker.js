import ReactDOM from "react-dom";

const ActivityTracker = ({ open, children, onClose, activities }) => {

    

    if (!open) return null;
    console.log(activities)

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="w-5/6 h-2/3 flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <p className="text-2xl font-bold mb-5">Activities</p>
                { activities.map((activity) => {
                    if(activity.section === localStorage.getItem("section_id")){
                        return(
                            <div key={activity.id}>
                                <table>
                                    
                                </table>
                            </div>
                        )
                    }
                }) }
                
                <button className="bg-green-400 py-1 px-5 rounded-lg font-bold mt-2" onClick={onClose}>CLOSE</button>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default ActivityTracker;