import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../util/firebase-config";
import ReactDOM from "react-dom";
import AllStudentsModal from "./AllStudentsModal";
import logo from "../pictures/logo.png"

const TopnotchersModal = ({ open, children, onClose, activities, students, accounts }) => {

    // OLD CODE
    // const [grades, setGrades] = useState([])
    // const [studentWithGrades, setStudentWithGrades] = useState([])
    // const subjects = ['filipino', 'english', 'mathematics', 'ap', 'mapeh', 'science', 'mtb']
    
    // const getGrade = async() => {
    //     const colRef = collection(db, "grades")
    //     const snapshot = await getDocs(colRef)

    //     setGrades(snapshot.docs.map((grade) => ({
    //         id: grade.id, ...grade.data()
    //     })))
    // }

    // const calculate = () => {
    //     //Get the grades, calculate overall average, store in object, sort the object and then return

    //     grades.map((grade) => {
    //         students.map((student) => {
    //             if(student == grade.id){
    //                 let average = 0
    //                 subjects.map((subject) => {
    //                     average += grade[subject].subjectAverage
    //                 })
    //                 //setStudentWithGrades(oldArray => [...oldArray, student : {[`${student}`], average : average/7}] );
    //                 setStudentWithGrades(oldArray => [...oldArray, {student : student, average : average/7}] );
    //             }
    //         })
    //     })
    //     const sortedArray = [...studentWithGrades].sort((a, b) => a.average - b.average);
    //     setStudentWithGrades(sortedArray)
    // }

    // useEffect(() => {
    //     getGrade()
    // },[])
    
    // useEffect(() => {
    //     calculate();
    // }, [grades]);

    const [grades, setGrades] = useState([]);
    const [studentWithGrades, setStudentWithGrades] = useState([]);
    const [quarter, setQuarter] = useState('firstQuarter');
    const subjects = ["filipino", "english", "mathematics", "ap", "mapeh", "science", "mtb"];

    const [isOpen, setIsOpen] = useState(false)

    const getGrade = async () => {
        const colRef = collection(db, "grades");
        const snapshot = await getDocs(colRef);

        setGrades(snapshot.docs.map((grade) => ({ 
            id: grade.id, ...grade.data() 
        })));
    };

    const calculate = useCallback(() => {
        let studentsWithAverages = grades
            .filter((grade) => students?.includes(grade.id))
            .map((grade) => {
                let subjectAverages = subjects.map((subject) => grade[subject][quarter]);
                let average = subjectAverages.reduce((sum, subjectAverage) => sum + subjectAverage, 0) / subjects.length;
                return { student: grade.id, average };
                // return { student: grade.id, average };
            });
            
        //Change ID to name
        studentsWithAverages.map((student, index) => {
            accounts.map(account => {
                if(account.username === student.student){
                    studentsWithAverages[index].student = account.name
                }
            })
        })

        let sortedArray = studentsWithAverages.sort((a, b) => b.average - a.average);
        if(sortedArray){
            setStudentWithGrades(sortedArray);
        }
        //console.log('calculate ran')
    }, [grades, students, subjects, accounts, quarter]);

    useEffect(() => {
        getGrade();
    }, []);

    useEffect(() => {
        calculate();
    }, [grades, quarter]);



    if (!open) return null;

    return ReactDOM.createPortal(
        <>
            <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
                <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={logo} className="object-cover w-10 h-10 sm:w-14 sm:h-14"/>
                        <p className="text-2xl font-bold underline">Performance Rankings</p>
                    </div>
                    <div className="bg-blue-500 rounded-lg p-3 mb-2 w-full">
                        <p className="font-bold">Quarter</p>
                        <select className="text-sm sm:text-base w-full p-1" value={quarter} onChange={(e) => {setQuarter(e.target.value);}}>
                            <option value="firstQuarter">1st grading</option>
                            <option value="secondQuarter">2nd grading</option>
                            <option value="thirdQuarter">3rd grading</option>
                            <option value="fourthQuarter">4th grading</option>
                        </select>
                    </div>
                    <div className="overflow-auto h-92 flex flex-col justify-center items-center gap-2">
                        {studentWithGrades && studentWithGrades.map((student, index) => {
                            let emoji;
                            index == 0 ? emoji = '👑' : emoji = ''
                            return(
                                <div key={student.student} className="">
                                    <p className="font-bold text-lg">{emoji} {index+1}. {student.student} - {student.average.toFixed(1)}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-rows-1 sm:grid-cols-2 gap-2 self-center">
                        <button onClick={() => {setIsOpen(true);}} className="bg-blue-500 hover:bg-blue-600 duration-200 font-bold text-lg rounded-lg p-1">Student list</button>
                        <button className="bg-red-500 hover:bg-red-600 duration-200 rounded-lg font-bold p-1" onClick={onClose}>Close</button>
                    </div>

                </div>
            </div>
            <AllStudentsModal open={isOpen} onClose={() => setIsOpen(false)} students = {students} accounts = {accounts}>

            </AllStudentsModal>
        </>,
    document.getElementById("portal")
    );
}
 
export default TopnotchersModal;