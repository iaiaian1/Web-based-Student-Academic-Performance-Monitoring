import ReactDOM from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from 'react-to-print'
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../util/firebase-config";
import logo from "../pictures/logo.png"

const TeacherReportCardModal = ({ open, children, onClose , activities, students, accounts}) => {

    let componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [grades, setGrades] = useState()
    const [section, setSection] = useState()
    const subjects = ['filipino', 'english', 'mathematics', 'ap', 'mapeh', 'science', 'mtb']
    let totalAverage = 0
    let firstTotal = 0
    let secondTotal = 0
    let thirdTotal = 0
    let fourthTotal = 0 
    let firstTotalAverage = 0
    let secondTotalAverage = 0
    let thirdTotalAverage = 0
    let fourthTotalAverage = 0 

    const calculate = async() => {     

        students?.map((student)=> {
            let performanceTotal = 0
            let performanceScore = 0

            let summativeTotal = 0
            let summativeScore = 0
    
            let periodicalTotal = 0
            let periodicalScore = 0

            let subjectGrade = 0
    
            let firstQuarter = 0
            let secondQuarter = 0
            let thirdQuarter = 0
            let fourthQuarter = 0
            
            subjects.map((subject) => {
                firstQuarter = 0
                secondQuarter = 0
                thirdQuarter = 0
                fourthQuarter = 0

                subjectGrade = 0

                let quarter=1
                while(quarter < 5){
                    performanceTotal = 0
                    performanceScore = 0

                    summativeTotal = 0
                    summativeScore = 0
            
                    periodicalTotal = 0
                    periodicalScore = 0

                    subjectGrade = 0

                    activities.map((activity) => {
                        if(parseInt(activity.quarter) === quarter){
                            //Check if its the same section id youre in
                            if(activity.section === localStorage.getItem("section_id")){
                                if(activity.subject === subject) {
                                    //GET TOTALS
                                    //Add to performance, 50% weight
                                    if(activity.type === "performance" || activity.type === "project" || activity.type === "recitation"){
                                        performanceTotal += activity.total
                                    }
                                    //Add to summative, 30% weight
                                    if(activity.type === "summative"){
                                        summativeTotal += activity.total
                                    }
                                    //Add to quarterly (periodical), 30% weight
                                    if(activity.type === "periodical"){
                                        periodicalTotal += activity.total
                                    }
                                    
                                    //GET TOTAL SCORE
                                    for (let [key, value] of Object.entries(activity.scores)) {
                                        //Change id getter method depending on account type
                                        // let student_id = ""
                                        // if(localStorage.getItem("type") === "student"){
                                        //     student_id = localStorage.getItem("user_id")
                                        // }else if(localStorage.getItem("type") === "teacher"){
                                        //     student_id = localStorage.getItem("student_id")
                                        // }
            
                                        if(key === student){
                                            // console.log(subject+ key + student)
                                            if(activity.type === "performance" || activity.type === "project" || activity.type === "recitation"){
                                                performanceScore += value
                                            }else if(activity.type === "summative"){
                                                summativeScore += value
                                            }else if(activity.type === "periodical"){
                                                periodicalScore += value
                                            }
                                        }
                                    }
                                }
                            } 
                        }
                    })
                    //Calculation
                    //Performance 50% , Summative 30% and Periodical 20%.
                    let performanceWeight = ((performanceScore * 100)/ performanceTotal) * .5
                    let summativeWeight = ((summativeScore * 100)/ summativeTotal) * .3
                    let periodicalWeight = ((periodicalScore * 100)/ periodicalTotal) * .2
            
                    subjectGrade = performanceWeight + summativeWeight + periodicalWeight
                    if(isNaN(subjectGrade)){
                        subjectGrade = 0
                    }
                    //console.log(`Subject: ${subject} - ${subjectGrade}  quarter: ${quarter} student: ${student}`)
                    if(quarter === 1){
                        firstQuarter = subjectGrade
                    }else if(quarter === 2){
                        secondQuarter = subjectGrade
                    }else if(quarter === 3) {
                        thirdQuarter = subjectGrade
                    }else if(quarter === 4){
                        fourthQuarter = subjectGrade
                    }
                    setGrade(student, subject, firstQuarter, secondQuarter, thirdQuarter, fourthQuarter)
                    quarter++  
                }
                //console.log(`name: ${student} subject: ${subject} 1: ${firstQuarter} 2: ${secondQuarter} 3: ${thirdQuarter} 4: ${fourthQuarter}`)
                //setGrade(student, subject, firstQuarter, secondQuarter, thirdQuarter, fourthQuarter)
            })
        })
    }

    const setGrade = async(student, subject, firstQuarter, secondQuarter, thirdQuarter, fourthQuarter) => {
        //console.log(`name: ${student} subject: ${subject} 1: ${firstQuarter} 2: ${secondQuarter} 3: ${thirdQuarter} 4: ${fourthQuarter}`)
        const section = localStorage.getItem("section_id")
        const colRef = doc(db, "grades", student)

        let subjectAverage = (firstQuarter + secondQuarter + thirdQuarter + fourthQuarter) / 4
        
        await setDoc(colRef, {
            [subject] : {
                student: student,
                section: section,
                subject: subject,
                firstQuarter : firstQuarter,
                secondQuarter : secondQuarter,
                thirdQuarter : thirdQuarter,
                fourthQuarter : fourthQuarter,
                subjectAverage : subjectAverage,
            }
        }, {merge : true})

        getGrade()
    }

    const getGrade = async() => {
        const colRef = collection(db, "grades")
        const snapshot = await getDocs(colRef)

        setGrades(snapshot.docs.map((grade) => ({
            id: grade.id, ...grade.data()
        })))

        
    }

    const getSection = async() => {
        const colRef = doc(db, "sections", `${localStorage.getItem("section_id")}`)

        const snapshot = await getDoc(colRef)
        setSection(snapshot.data())
    }

    useEffect(() => {
        getGrade()
        getSection()
    },[])

    useEffect(() => {
        calculate()
    }, [activities])

    if (!open) return null;
    
    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5 h-3/4 sm:h-1/2 w-5/6 sm:w-1/2">
                <div className="p-2 overflow-y-auto w-full h-full bg-white" ref={componentRef}>
                    {/* <p className="self-start text-2xl font-bold mb-5 underline">Report card</p> */}
                    {accounts.map((account) => {
                        totalAverage = 0
                        firstTotal = 0
                        secondTotal = 0
                        thirdTotal = 0
                        fourthTotal = 0 
                        firstTotalAverage = 0
                        secondTotalAverage = 0
                        thirdTotalAverage = 0
                        fourthTotalAverage = 0 
                        return(
                            grades.map((grade) => {
                                //Band aid solution. i just wanna graduate ffs.
                                if(account.username === grade.id && grade.ap.section === localStorage.getItem('section_id')){
                                    // console.log(grade.ap.section)
                                    totalAverage = 0
                                    return(
                                        <div key={account.id}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <img src={logo} className="object-cover w-12 h-12 sm:w-16 sm:h-16"/>
                                                <p className="text-2xl font-bold underline pagebreak" key={account.id}>Report card</p>
                                            </div>
                                            <p className="font-bold underline">{account.name} Grade {section.section}</p>
                                            <p className="font-bold underline">{localStorage.getItem('school_year')}</p>
                                            <div className="w-full h-full p-2">
                                                <table className="table-auto border border-black w-full mb-10">
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
                                                    {subjects.map((subject) => {
                                                        //subjectAverage = (grade[subject].firstQuarter + grade[subject].secondQuarter + grade[subject].thirdQuarter + grade[subject].fourthQuarter) / 4
                                                        //totalAverage += subjectAverage / 7
                                                        totalAverage = 0
                                                        firstTotal += grade[subject].firstQuarter
                                                        secondTotal += grade[subject].secondQuarter
                                                        thirdTotal += grade[subject].thirdQuarter
                                                        fourthTotal += grade[subject].fourthQuarter

                                                        firstTotalAverage = firstTotal / 7
                                                        secondTotalAverage = secondTotal / 7
                                                        thirdTotalAverage = thirdTotal / 7
                                                        fourthTotalAverage = fourthTotal / 7

                                                        totalAverage = (firstTotalAverage + secondTotalAverage + thirdTotalAverage + fourthTotalAverage) / 4
                                                        // console.log(totalAverage)

                                                        return(
                                                            <tbody key={subject}>
                                                                <tr>
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
                                                                    <td className="border-black px-2">

                                                                    </td>                                 
                                                                </tr>
                                                            </tbody>
                                                        );
                                                    })}
                                                    <tbody>
                                                        <tr>
                                                            <td className="border border-black px-2 bg-gray-300 font-bold">Average</td>
                                                            <td className="border border-black px-2 font-bold">
                                                                {firstTotalAverage.toFixed(1)}
                                                            </td>
                                                            <td className="border border-black px-2 font-bold">
                                                                {secondTotalAverage.toFixed(1)}
                                                            </td>
                                                            <td className="border border-black px-2 font-bold">
                                                                {thirdTotalAverage.toFixed(1)}
                                                            </td>
                                                            <td className="border border-black px-2 font-bold">
                                                                {fourthTotalAverage.toFixed(1)}
                                                            </td>
                                                            <td className="border border-black px-2 text-center font-bold">
                                                                {totalAverage.toFixed(1)}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        )
                    })}
                </div>
                <div className="w-1/2 sm:w-fit gap-1 m-1 grid grid-cols-1 sm:grid-cols-3">
                    <button className="bg-green-500 hover:bg-green-600 duration-200 rounded-lg font-bold p-2" onClick={calculate}>Refresh</button>
                    <button className="bg-green-500 hover:bg-green-600 duration-200 rounded-lg font-bold p-2" onClick={handlePrint}>Print</button>
                    <button className="bg-red-500 hover:bg-red-600 duration-200 rounded-lg font-bold p-2" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default TeacherReportCardModal;