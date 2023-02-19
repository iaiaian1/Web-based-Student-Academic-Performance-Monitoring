import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../util/firebase-config";
import ReactDOM from "react-dom";

const StudentReportCardModal = ({ open, children, onClose }) => {

    const [grades, setGrades] = useState([]);
    const subjects = ["filipino", "english", "mathematics", "ap", "mapeh", "science", "mtb"];
    const studentId = localStorage.getItem("student_id")

    let totalAverage = 0
    let firstTotal = 0
    let secondTotal = 0
    let thirdTotal = 0
    let fourthTotal = 0 
    let firstTotalAverage = 0
    let secondTotalAverage = 0
    let thirdTotalAverage = 0
    let fourthTotalAverage = 0

    const getGrade = async () => {
        const colRef = collection(db, "grades");
        const snapshot = await getDocs(colRef);

        // setGrades(snapshot.docs.map((grade) => ({ 
        //     id: grade.id, ...grade.data() 
        // })));
        // let gradesSnapshot = snapshot.docs.map((grade) => ({ id: grade.id, ...grade.data() })).filter((data) => data.id == studentId)
        setGrades(snapshot.docs.map((grade) => ({ id: grade.id, ...grade.data() })).filter((data) => data.id == studentId))
        // console.log(grades);
        // let grade = gradesSnapshot.filter((data) => data.id == studentId)
        //console.log(grade)
    };

    useEffect(() => {
        getGrade()
    }, [])

    // useEffect(() => {
    //     if(totalAverage >= 90){
    //         // setRemarks('💯 Outstanding')
    //         remarks = 'out'
    //     }else if(totalAverage >= 85   ){
    //         // setRemarks('🌟 Very satisfactory')
    //         remarks = 'outtt'
    //     }else if(totalAverage >= 80){
    //         // setRemarks('🥳 Satisfactory')
    //         remarks = 'ouwerwert'
    //     }else if(totalAverage >= 75){
    //         // setRemarks('😄 Fairly satisfactory')
    //         remarks = 'outqweqweq'
    //     }else if(isNaN(totalAverage)){
    //         // setRemarks('🙂 Input more grades')
    //     }else{
    //         // setRemarks('😬 Did not meet expectations')
    //         remarks = 'oqweqweut'
    //     }
    // }, [totalAverage]);
    const remarks = () => {
        if(totalAverage >= 98){
            return '💯 With Highest Honors'
        }else if(totalAverage >= 95){
            return '💥 With High Honor'
        }else if(totalAverage >= 90){
            return '🧠 Outstanding, with Honor'
        }else if(totalAverage >= 85   ){
            return '🌟 Very satisfactory'
        }else if(totalAverage >= 80){
            return '🥳 Satisfactory'
        }else if(totalAverage >= 75){
            return '😄 Fairly satisfactory'
        }else if(totalAverage <= 0){
            return '🙂 Input more grades'
        }else if(isNaN(totalAverage)){
            return '🤔 Some error'
        }else{
            return '😬 Did not meet expectations'
        }
    }

    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <p className="text-2xl font-bold mb-3 underline">Report Card</p>
                <div className="flex flex-col w-full mb-3">
                    <p className="capitalize"><b>Name:</b> {localStorage.getItem("student_name")}</p>
                    {/* Cant section. ongoing todo with database management */}
                    {/* <p><b>Section:</b> {localStorage.getItem("section")}</p> */}
                    <p><b>LRN:</b> {localStorage.getItem("student_id")}</p>
                </div>
                <div className="w-full h-full flex flex-col items-center">
                    <table className="bg-white">
                        <thead className="border border-black bg-gray-300">
                            <tr>
                                <th className="border border-black px-5">
                                    Subject
                                </th>
                                <th className="border border-black px-2">
                                    1st
                                </th>
                                <th className="border border-black px-2">
                                    2nd
                                </th>
                                <th className="border border-black px-2" >
                                    3rd
                                </th>
                                <th className="border border-black px-2">
                                    4th
                                </th>
                                <th className="border border-black px-2">
                                    Final Average
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades && grades.map((grade) => {
                                // console.log(grade)
                                return(
                                    subjects.map((subject) => {
                                        firstTotal += grade[subject].firstQuarter
                                        secondTotal += grade[subject].secondQuarter
                                        thirdTotal += grade[subject].thirdQuarter
                                        fourthTotal += grade[subject].fourthQuarter

                                        firstTotalAverage = firstTotal / 7
                                        secondTotalAverage = secondTotal / 7
                                        thirdTotalAverage = thirdTotal / 7
                                        fourthTotalAverage = fourthTotal / 7

                                        totalAverage = (firstTotalAverage + secondTotalAverage + thirdTotalAverage + fourthTotalAverage) / 4

                                        return(
                                            <tr key={subject}>
                                                <td className="border border-black px-2">
                                                    {subject.toUpperCase()}
                                                </td>
                                                <td className="border border-black px-2">
                                                    {grade[subject].firstQuarter.toFixed(0)}
                                                </td>
                                                <td className="border border-black px-2">
                                                    {grade[subject].secondQuarter.toFixed(0)}
                                                </td>
                                                <td className="border border-black px-2">
                                                    {grade[subject].thirdQuarter.toFixed(0)}
                                                </td>
                                                <td className="border border-black px-2">
                                                    {grade[subject].fourthQuarter.toFixed(0)}
                                                </td>        
                                                <td className="border-r border-black px-2">

                                                </td>                                 
                                            </tr>
                                        )
                                    })
                                )
                            })}
                        </tbody>
                        <tbody>
                            <tr>
                                <td className="border border-black px-2">
                                    Average
                                </td>
                                <td className="border border-black px-2">
                                    {firstTotalAverage.toFixed(1)}
                                </td>
                                <td className="border border-black px-2">
                                    {secondTotalAverage.toFixed(1)}
                                </td>
                                <td className="border border-black px-2">
                                    {thirdTotalAverage.toFixed(1)}
                                </td>
                                <td className="border border-black px-2">
                                    {fourthTotalAverage.toFixed(1)}
                                </td>        
                                <td className="border border-black px-2 text-center">
                                    {totalAverage.toFixed(1)}
                                </td>                                 
                            </tr>
                        </tbody>
                    </table>
                    <p className="m-2 text-xl">{ remarks()}</p>
                </div>
                <button className="bg-red-500 py-1 px-5 rounded-lg font-bold mt-2" onClick={onClose}>Close</button>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default StudentReportCardModal;