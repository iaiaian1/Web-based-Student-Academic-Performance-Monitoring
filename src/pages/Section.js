import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../util/firebase-config"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import AddStudentModal from "./AddStudentModal";
import AddActivityModal from "./AddActivityModal";
import StudentFocusModal from "./StudentFocusModal";
import GradingScaleModal from "./GradingScaleModal";
import ActivityTracker from "./ActivityTracker";
import searchImage from "../pictures/search.png";
import returnImage from "../pictures/return.png";
import TeacherReportCardModal from "./TeacherReportCardModal";

const Section = () => {

    const section = localStorage.getItem('section').toUpperCase()
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([])
    const [students, setStudents] = useState([])
    const [activities, setActivities] = useState([])

    //MODALS
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [isOpen3, setIsOpen3] = useState(false)
    const [isOpen4, setIsOpen4] = useState(false)
    const [isOpen5, setIsOpen5] = useState(false)
    const [isOpen6, setIsOpen6] = useState(false)

    //Functions
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

    //Search function
    const [searchTerm, setSearchTerm] = useState('')

    // const deleteSection = () => {
    //     confirmAlert({
    //         title: 'Delete section',
    //         message: 'Are you sure to do this?',
    //         buttons: [
    //             {
    //                 label: 'Yes',
    //                 onClick: () => {
    //                     const sectionDoc = doc(db, "sections", localStorage.getItem('section_id'));
    //                     deleteDoc(sectionDoc)
    //                     navigate('/teacher')
    //                 }
    //             },
    //             {
    //                 label: 'No',
    //                 //onClick: () => console.log('no')
    //             }
    //         ]
    //     });
    // };
    
    useEffect(() => {
        if(localStorage.getItem("user_name") === null || localStorage.getItem("user_id") === null || localStorage.getItem("type") !== "teacher" || localStorage.getItem("account_id") === null){
            navigate('/')
        }
        getAccounts();
        getStudents();
        getActivities();
    }, [])

    return ( 
        <>
            <div className="flex h-screen items-center justify-center bg-gradient-to-tl from-blue-100 via-blue-300 to-blue-500">
                <div className="flex gap-y-2 h-5/6 w-11/12 flex-col items-center rounded-lg bg-blue-400 p-5">
                    <div className="flex justify-between w-full">
                        <p className="text-xl sm:text-3xl font-bold">SECTION: {section}</p>
                        {/* <button className="w-1/5 font-bold text-xs sm:text-xl bg-red-500 rounded-lg" onClick={() => deleteSection()}>DELETE SECTION</button> */}
                        <p>Section ID: {localStorage.getItem("section_id")}</p>
                    </div>

                    <div className="mt-5 flex h-5/6 w-full flex-col items-center justify-center overflow-auto">
                        <p className="self-start text-xl sm:text-2xl font-bold underline">Students</p>

                        {/* Search div */}
                        <div className="w-full self-start flex justify-between items-center text-md font-bold py-2">
                            <div className="flex items-center gap-x-1">
                                <img src={searchImage} className="object-cover w-5 h-5" alt="search"/>
                                <input
                                    type="text"
                                    placeholder="Name search..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="p-1 rounded-sm"
                                />
                            </div>
                            <div className="p-2 rounded-lg invisible sm:visible bg-red-500" onClick={()=> navigate('/teacher')}>
                                <img src={returnImage} className="object-cover w-6 h-6" alt="return"/>
                            </div>
                        </div>
                        
                    

                        {/* Section box */}
                        <div className="grid grid-cols-1 gap-3 w-full h-full items-center justify-center rounded-lg border bg-blue-500 overflow-y-scroll p-2 px-5 sm:px-32">
                            {students && accounts.map((account) => {

                                if (searchTerm === ""){
                                    //Render all if searchterm is empty
                                    //Render data ONLY if the student is enrolled in sections' students.
                                    if(students.includes(account.username)){
                                        return(
                                            <div key={account.username} className="flex items-center justify-center rounded-lg bg-green-400 p-5 text-sm sm:text-base" onClick={() => {setIsOpen3(true);localStorage.setItem("student_id", account.username.toLowerCase());localStorage.setItem("student_name", account.name.toLowerCase())}}>
                                                <p className="break-words font-bold">
                                                    {account.username.toUpperCase()} - {account.name.toUpperCase()}
                                                </p>
                                            </div>
                                        )
                                    }
                                }else{
                                    //Render only the items matching searchterm
                                    //Render data ONLY if the student is enrolled in sections' students.
                                    if(students.includes(account.username) && account.name.toLowerCase().replace(/ /g, '').includes(searchTerm.toLowerCase())){
                                        return(
                                            <div key={account.username} className="flex items-center justify-center rounded-lg bg-green-400 p-5 text-sm sm:text-base" onClick={() => {setIsOpen3(true);localStorage.setItem("student_id", account.username.toLowerCase());localStorage.setItem("student_name", account.name.toLowerCase())}}>
                                                <p className="break-words font-bold">
                                                    {account.username.toUpperCase()} - {account.name.toUpperCase()}
                                                </p>
                                            </div>
                                        )
                                    }
                                }
                            })}
                            {/* <div className="flex items-center justify-center rounded-lg bg-green-400 p-5 text-sm sm:text-base">
                                <p className="break-words font-bold">
                                    foo bar baz
                                </p>
                            </div> */}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-1 m-1">
                        <button className="font-bold break-words text-sm sm:text-xl p-2 bg-green-500 rounded-lg" onClick={() => setIsOpen(true)}>Add student</button>
                        <button className="font-bold break-words text-sm sm:text-xl p-2 bg-green-500 rounded-lg" onClick={() => setIsOpen2(true)}>Add activity</button>
                        <button className="font-bold break-words text-sm sm:text-xl p-2 bg-green-500 rounded-lg" onClick={() => setIsOpen4(true)}>Grading Scale</button>
                        <button className="font-bold break-words text-sm sm:text-xl p-2 bg-green-500 rounded-lg" onClick={() => setIsOpen5(true)}>Activities</button>
                        <button className="font-bold break-words text-sm sm:text-xl p-2 bg-green-500 rounded-lg" onClick={() => setIsOpen6(true)}>Report Card</button>
                    </div>
                </div>
            </div>
            <AddStudentModal open={isOpen} onClose={() => setIsOpen(false)} populateStudents={() => getStudents()}>
                {accounts}{students}
            </AddStudentModal>
            <AddActivityModal open={isOpen2} onClose={() => setIsOpen2(false)} populateActivities={() => getActivities()}>
                { students }
            </AddActivityModal>
            <StudentFocusModal open={isOpen3} activities={activities} onClose={() => setIsOpen3(false)} populateActivities={() => getActivities()} populateStudents={ () => getStudents() }>
                { activities }
            </StudentFocusModal>
            <GradingScaleModal open={isOpen4} onClose={() => setIsOpen4(false)}>

            </GradingScaleModal>
            <ActivityTracker open={isOpen5} onClose={() => setIsOpen5(false)} activities={activities} students={students} accounts={accounts}>

            </ActivityTracker>
            <TeacherReportCardModal open={isOpen6} onClose={() => setIsOpen6(false)} activities={activities} students={students} accounts={accounts}>

            </TeacherReportCardModal>
        </>
     );
}
 
export default Section;