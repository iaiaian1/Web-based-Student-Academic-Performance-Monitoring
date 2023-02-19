import ReactDOM from "react-dom";
import { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../util/firebase-config";
import logo from "../pictures/logo.png"

const EditScoresModal = ({ open, children, onClose, activities, populateActivities }) => {

    //Basically get activities, handle changes on onChange and apply it on activities, when submitted, update each activitiy document each. only from this specific section to save writes and speed

    const [quarter, setQuarter] = useState('1')
    const [subject, setSubject] = useState('filipino')
    const formRef = useRef(null)
    let studentId = localStorage.getItem('student_id')

    const handleChange = (event, id) => {
        const updatedActivities = activities.map(activity => {
          if (activity.id === id) {
            //If activity id is matched, modify that and then return.
            activity.scores[studentId] = parseInt(event.target.value)
            return { ...activity };
          }
          //If not, just return.
          return activity;
        });
        //Set the old activities object with the newly modified one.
        activities = updatedActivities;

        //Checker
        // activities.map((activity) => {
        //     if (activity.quarter === quarter && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
    
        //         console.log(activity)
        //     }
        // })
    };

    const submit = async(e) => {
        e.preventDefault()

        activities.map((activity) => {
            if(activity.section === localStorage.getItem("section_id")){
                let acitivityRef = doc(db, "activities", activity.id)
                updateDoc(acitivityRef, {
                    [`scores.${studentId}`] : parseInt(activity.scores[studentId])
                })

                // console.log(activity.scores[studentId])
            }
        })
        populateActivities()
        formRef.current.reset()
        //console.log('submitted')
    }

    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <div className="flex items-center justify-evenly mb-2 w-full">
                    <img src={logo} className="object-cover w-12 h-12 sm:w-16 sm:h-16"/>
                    <p className="text-2xl font-bold underline">Edit scores</p>
                    <img src={logo} className="object-cover w-12 h-12 sm:w-16 sm:h-16 opacity-0"/>
                </div>
                <div className="bg-blue-500 rounded-lg p-2 mb-2 w-full">
                    <p className="font-bold">Subject</p>
                    <select className="text-sm sm:text-base w-full p-1" value={subject} onChange={(e) => {setSubject(e.target.value);}}>
                        <option value="filipino">Filipino</option>
                        <option value="english">English</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="ap">Araling Panlipunan</option>
                        <option value="mapeh">MAPEH</option>
                        <option value="science">Science</option>
                        <option value="mtb">MTB</option>
                    </select>
                    <p className="font-bold">Quarter</p>
                    <select className="text-sm sm:text-base w-full p-1" value={quarter} onChange={(e) => {setQuarter(e.target.value);}}>
                        <option value="1">1st grading</option>
                        <option value="2">2nd grading</option>
                        <option value="3">3rd grading</option>
                        <option value="4">4th grading</option>
                    </select>
                </div>
                <form ref={formRef} onSubmit={(e) => submit(e)}>
                    <div className="h-80 w-80 overflow-y-auto mb-5 p-1">
                        <p className="text-lg sm:text-xl underline font-bold mb-1">Performance</p>
                        {activities.map((activity) => {
                            if (activity.quarter === quarter && activity.type === "performance" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                                return(
                                    <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                                    <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>         
                                    <input
                                            className="ml-1"
                                            key={activity.id}
                                            type="number"
                                            min="0"
                                            max={activity.total}
                                            value={activity.value}
                                            onChange={event => handleChange(event, activity.id)}
                                        />
                                                                                                                                            
                                    </div>
                                )
                            }
                        })}

                        <p className="text-lg sm:text-xl underline font-bold mb-1">Periodical Test</p>
                        {activities.map((activity) => {
                            if (activity.quarter === quarter && activity.type === "periodical" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                                return(
                                    <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                                    <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>         
                                    <input
                                            key={activity.id}
                                            type="number"
                                            min="0"
                                            max={activity.total}
                                            value={activity.value}
                                            onChange={event => handleChange(event, activity.id)}
                                        />                                                                                                                  
                                    </div>
                                )
                            }
                        })}

                        <p className="text-lg sm:text-xl underline font-bold mb-1">Project</p>
                        {activities.map((activity) => {
                            if (activity.quarter === quarter && activity.type === "project" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                                return(
                                    <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                                    <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>         
                                    <input
                                            key={activity.id}
                                            type="number"
                                            min="0"
                                            max={activity.total}
                                            value={activity.value}
                                            onChange={event => handleChange(event, activity.id)}
                                        />                                                                                                                  
                                    </div>
                                )
                            }
                        })}

                        <p className="text-lg sm:text-xl underline font-bold mb-1">Recitations</p>
                        {activities.map((activity) => {
                            if (activity.quarter === quarter && activity.type === "recitation" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                                return(
                                    <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                                    <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>         
                                    <input
                                            key={activity.id}
                                            type="number"
                                            min="0"
                                            max={activity.total}
                                            value={activity.value}
                                            onChange={event => handleChange(event, activity.id)}
                                        />                                                                                                                  
                                    </div>
                                )
                            }
                        })}

                        <p className="text-lg sm:text-xl underline font-bold mb-1">Summative</p>
                        {activities.map((activity) => {
                            if (activity.quarter === quarter && activity.type === "summative" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                                return(
                                    <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                                    <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>         
                                    <input
                                            key={activity.id}
                                            type="number"
                                            min="0"
                                            max={activity.total}
                                            value={activity.value}
                                            onChange={event => handleChange(event, activity.id)}
                                        />                                                                                                                  
                                    </div>
                                )
                            }
                        })}
                    </div>
                    
                    {/* Buttons */}
                    <div className="grid grid-rows-1 sm:grid-cols-2 gap-2 w-full self-center">
                        <button type="submit" className="bg-green-500 hover:bg-green-600 duration-200 font-bold rounded-lg ">Submit</button>
                        <button className="bg-red-500 hover:bg-red-600 duration-200 rounded-lg font-bold " onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default EditScoresModal;