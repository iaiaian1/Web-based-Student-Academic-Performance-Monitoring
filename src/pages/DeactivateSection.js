import ReactDOM from "react-dom";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../util/firebase-config";
import { useNavigate } from "react-router";

const DeactivateSection = ({ open, children, onClose }) => {

    const [sections, setSections] = useState()
    const sectionsRef = collection(db, "sections")

    const getSections = async() => {
        let snapshot = await getDocs(sectionsRef)
        setSections(snapshot.docs.map((section) => ({
            ...section.data(), id: section.id
        })))
    }

    const activate = async(section) =>{
        let sectionRef = doc(db, "sections", section)
        await updateDoc(sectionRef, {
            status: "active"
        })
    }

    const deactivate = async(section) =>{
        let sectionRef = doc(db, "sections", section)
        await updateDoc(sectionRef, {
            status: "inactive"
        })
    }

    useEffect(() => {
        getSections();
    }, [])


    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5 w-5/6 sm:w-3/4 h-3/4">
                <p className="text-2xl font-bold mb-2">Deactivate/Activate section</p>
                <p className="mb-2 text-xl">Deactivate to remove a section in teacher's panel</p>
                <div className="bg-blue-500 overflow-auto w-full p-1">
                    {sections.map((section) => {
                        return(
                            <div className="flex justify-between items-center p-1 border border-white" key={section.id}>
                                <div className="font-bold text-xs sm:text-lg">
                                    <p>Teacher: {section.teacher}</p>
                                    <p>{section.section}({section.year})</p>
                                    <p className="text-white">{section.id}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-1">
                                    <button className="bg-green-400 hover:bg-green-500 duration-200 py-1 px-2 rounded-lg font-bold text-xs sm:text-base" onClick={() => activate(section.id)}>Activate</button>
                                    <button className="bg-red-400 hover:bg-red-500 duration-200 py-1 px-2 rounded-lg font-bold text-xs sm:text-base" onClick={() => deactivate(section.id)}>Deactivate</button>
                                </div>
                            </div>                         
                        )
                    })}
                </div>
                <button className="bg-red-500 hover:bg-red-600 duration-200 py-1 px-5 rounded-lg font-bold mt-2" onClick={onClose}>CLOSE</button>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default DeactivateSection;