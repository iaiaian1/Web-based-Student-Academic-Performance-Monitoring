import ReactDOM from "react-dom";
import { arrayRemove, deleteField, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../util/firebase-config";

const DropoutStudent = ({ open, children, onClose }) => {

    const [sections, setSections] = useState()
    const [activities, setActivities] = useState()

    const [studentId, setStudentId] = useState('')
    const [sectionId, setSectionId] = useState('')

    const sectionsRef = collection(db, "sections")
    const activitiesRef = collection(db, "activities")

    const [status, setStatus] = useState('')

    const getSections = async() => {
        let snapshot = await getDocs(sectionsRef)
        setSections(snapshot.docs.map((section) => ({
            ...section.data(), id: section.id
        })))
    }
    const getActivities = async() => {
        let snapshot = await getDocs(activitiesRef)
        setActivities(snapshot.docs.map((activity) => ({
            ...activity.data(), id: activity.id
        })))
    }

    const dropStudent = async() =>{
        //Check if field is not empty
        if(studentId !== "" && sectionId !== ""){
            //DELETE FIELD FROM SECTION AND REMOVE INSTANCES IN EVERY ACTIVITIES
            //Remove student from section list 1/2
            let sectionRef = doc(db, "sections", sectionId)
            await updateDoc(sectionRef, {
                students : arrayRemove(studentId)
            })

            //Remove from name from section's activities 2/2
            activities.map((activity) => {
                if(activity.section === sectionId){ 
                    let activityRef = doc(db, "activities", activity.id)
                    updateDoc(activityRef, {
                        [`scores.${studentId}`] : deleteField()
                    })
                }
            })
            setStatus('Dropout success')
        }else{
            setStatus('Fill the input field')
        }
        setStudentId("")
    }

    useEffect(() => {
        getSections();
        getActivities();
    }, [])


    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5 w-5/6 sm:w-3/4 h-3/4">
                <p className="text-2xl font-bold mb-2">Student Dropout</p>
                <p className="mb-2 text-xl">Enter student's ID in section's input field</p>
                <p>{status}</p>
                <div className="bg-blue-500 overflow-auto w-full p-1">
                    {sections.map((section) => {
                        return(
                            <div className="flex justify-between items-center p-1 border border-white" key={section.id} onClick={() => setSectionId(section.id)}>
                                <div className="font-bold text-xs sm:text-lg">
                                    <p>Teacher: {section.teacher}</p>
                                    <p>{section.section}({section.year})</p>
                                    <p className="text-white">{section.id}</p>
                                </div>
                            </div>                         
                        )
                    })}
                </div>
                <div className="grid grid-rows-4 gap-1 mt-2 w-3/4">
                    <div className="flex gap-1">
                        <p>Section ID:</p>
                        <p className="break-all">{ sectionId }</p>
                    </div>
                    <div className="flex gap-1">
                        <p>Student ID:</p>
                        <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full"/>
                    </div>
                    <button className="bg-orange-500 rounded-lg font-bold    " onClick={() => dropStudent()}>Drop</button>
                    <button className="bg-red-500 rounded-lg font-bold" onClick={onClose}>CLOSE</button>
                </div>
                
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default DropoutStudent;