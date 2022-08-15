import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const GradeModal = ({ open, children, onClose, quarter, section, activities }) => {

    const [finalGrade, setFinalGrade] = useState(0)
    const [remarks, setRemarks] = useState('')

    const calculateGrades = async() => {
        //Projects and recitation is under performance, add them all here.
        let performanceTotal = 0
        let performanceScore = 0

        let summativeTotal = 0
        let summativeScore = 0

        let periodicalTotal = 0
        let periodicalScore = 0

        //Loop through inherited array
        children.map((activity) => {
            //Select quarter
            if(activity.quarter === quarter){
                //Check if its the same section id youre in
                if(activity.section === section){
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
                        let student_id = ""
                        if(localStorage.getItem("type") === "student"){
                            student_id = localStorage.getItem("user_id")
                        }else if(localStorage.getItem("type") === "teacher"){
                            student_id = localStorage.getItem("student_id")
                        }

                        if(key === student_id){
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
                 
        })
        //Calculation
        //Performance 50% , Summative 30% and Periodical 20%.
        let performanceWeight = ((performanceScore * 100)/ performanceTotal) * .5
        let summativeWeight = ((summativeScore * 100)/ summativeTotal) * .3
        let periodicalWeight = ((periodicalScore * 100)/ periodicalTotal) * .2
        setFinalGrade(performanceWeight + summativeWeight + periodicalWeight)
    }

    useEffect(() => {
        calculateGrades()
    }, [quarter, section, activities])

    useEffect(() => {
        if(finalGrade >= 90){
            setRemarks('Outstanding')
        }else if(finalGrade >= 85   ){
            setRemarks('Very satisfactory')
        }else if(finalGrade >= 80){
            setRemarks('Satisfactory')
        }else if(finalGrade >= 75){
            setRemarks('Fairly satisfactory')
        }else if(isNaN(finalGrade)){
            setRemarks('Input more grades')
        }else{
            setRemarks('Did not meet expectations')
        }
    }, [finalGrade])

    if (!open) return null;

    return ReactDOM.createPortal(
    <div className="fixed inset-0 z-20 flex h-full w-full items-center justify-center bg-black/[.2]">
        <div className="flex flex-col items-center justify-between h-1/4 w-1/3 rounded-lg bg-blue-400 p-2">
            <p className="text-xl font-bold sm:text-2xl">Grades</p>
            <p className="text-xl sm:text-2xl">Average - { finalGrade && finalGrade.toFixed(1) }</p>
            <p className="text-base sm:text-xl">Remarks - { remarks }</p>
            <button onClick={() => {onClose();}} className="w-2/3 sm:w-1/3 rounded-lg bg-green-300 py-2 px-1 font-bold text-xs sm:text-md">CLOSE</button>
        </div>
    </div>,
    document.getElementById("portal")
    );
};

export default GradeModal;
