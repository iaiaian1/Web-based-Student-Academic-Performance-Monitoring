import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../util/firebase-config"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import AddStudentModal from "./AddStudentModal";
import AddActivityModal from "./AddActivityModal";
import StudentFocusModal from "./StudentFocusModal";

const Section = () => {

    const level = localStorage.getItem('level').toUpperCase()
    const section = localStorage.getItem('section').toUpperCase()
    const subject = localStorage.getItem('subject').toUpperCase()
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([])
    const [students, setStudents] = useState([])
    const [activities, setActivities] = useState([])

    //MODALS
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [isOpen3, setIsOpen3] = useState(false)

    //Load accounts
    const getAccounts = async () => {
        const colRef = collection(db, "accounts")
        const snapshot = await getDocs(colRef)
        setAccounts(snapshot.docs.map((account) => ({
            id: account.id, ...account.data()
        })))
    }
    //Get section's students
    const getStudents = async() => {
        const docRef = doc(db, "sections", localStorage.getItem('section_id'))
        const snapshot = await getDoc(docRef)
        setStudents(snapshot.data().students)
    }
    //Get activities
    const getActivities = async() => {
        const activitiesRef = collection(db, "activities")
        const snapshot = await getDocs(activitiesRef)
        setActivities(snapshot.docs.map((activity) => ({
        ...activity.data(), id: activity.id
        })))
    }
    //Functions
    const deleteSection = () => {
        confirmAlert({
            title: 'Delete section',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        const sectionDoc = doc(db, "sections", localStorage.getItem('section_id'));
                        deleteDoc(sectionDoc)
                        navigate('/teacher')
                    }
                },
                {
                    label: 'No',
                    //onClick: () => console.log('no')
                }
            ]
        });
    };
    
    useEffect(() => {
        getAccounts();
        getStudents();
        getActivities();
    }, [])

    return ( 
        <>
            <div className="flex h-screen items-center justify-center bg-gradient-to-tl from-blue-100 via-blue-300 to-blue-500">
                <div className="flex gap-y-2 h-5/6 w-11/12 flex-col items-center rounded-lg bg-blue-400 p-5">
                    <div className="flex justify-between w-full">
                        <p className="text-xl sm:text-3xl font-bold">SECTION: {level} - {section} - {subject}</p>
                        <button className="w-1/5 font-bold text-xs sm:text-xl bg-red-500 rounded-lg" onClick={() => deleteSection()}>DELETE SECTION</button>
                    </div>

                    <div className="mt-5 flex h-5/6 w-full flex-col items-center justify-center">
                        <p className="self-start text-xl font-bold">Students</p>
                    

                        {/* Section box */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 h-full w-full gap-1 rounded-lg border bg-blue-500 p-5 overflow-auto">
                            {students && accounts.map((account) => {
                                //Render data ONLY if the student is enrolled in sections' students.
                                if(students.includes(account.username)){
                                    return(
                                        <div key={account.username} className="flex h-14 w-full items-center justify-center rounded-lg bg-green-400 p-1 text-xs sm:text-sm" onClick={() => {setIsOpen3(true);localStorage.setItem("student_id", account.username.toLowerCase());localStorage.setItem("student_name", account.name.toLowerCase())}}>
                                            <p className="break-words font-bold">
                                                {account.username.toUpperCase()} - {account.name.toUpperCase()}
                                            </p>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="w-full h-1/6 flex justify-around p-5">
                        <button className="w-1/4 font-bold break-words text-sm sm:text-xl bg-green-500" onClick={() => setIsOpen(true)}>Add student</button>
                        <button className="w-1/4 font-bold break-words text-sm sm:text-xl bg-green-500" onClick={() => setIsOpen2(true)}>Add activity</button>
                        <button className="w-1/4 font-bold break-words text-sm sm:text-xl bg-green-500">Grading Scale</button>
                    </div>
                </div>
            </div>
            <AddStudentModal open={isOpen} onClose={() => setIsOpen(false)} populateStudents={() => getStudents()}>
                {accounts}{students}
            </AddStudentModal>
            <AddActivityModal open={isOpen2} onClose={() => setIsOpen2(false)} populateActivities={() => getActivities()}>
                { students }
            </AddActivityModal>
            <StudentFocusModal open={isOpen3} onClose={() => setIsOpen3(false)} populateActivities={() => getActivities()} populateStudents={ () => getStudents() }>
                { activities }
            </StudentFocusModal>
        </>
     );
}
 
export default Section;