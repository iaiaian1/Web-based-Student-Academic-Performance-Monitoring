import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import 'react-tabs/style/react-tabs.css';
import { db } from "../util/firebase-config";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ChangeScoreModal = ({ open, children, onClose, populateActivities }) => {

    //fetch activities documents, map only section id on localstorage or filter map on display. it will have its own  inputbox?
    //bonus:  activity type divider.
    //Summative tests 30%, performance tasks 50% ag quarterly assessment 20%.
    //Ang projects, ag recitation dala sa performance tasks.
    //ginabasehan is performance task, summative test, recitation, projects kag periodical test

    const [newScore, setNewScore] = useState('')
    const [newTotal, setNewTotal] = useState('')
    const [status, setStatus] = useState('')
    

    const updateScore = async() => {
        const activityRef = doc(db, "activities", localStorage.getItem("activity_id"))
        if (newScore === ""){
            setStatus('Please give a score')
        }else if(newTotal === '' && newScore <= parseInt(localStorage.getItem("activity_total"))){
            //UPDATE SCORE
            await updateDoc(activityRef, { 
                [`scores.${localStorage.getItem("student_id")}`] : parseInt(newScore)
            })
            setStatus('Score updated')
            setNewScore('')
            setNewTotal('')
            populateActivities()
        }else if(newTotal !== "" && newScore <= newTotal){
            //Set new total score
            localStorage.setItem("activity_total", newTotal)
            //UPDATE SCORE
            await updateDoc(activityRef, { 
                [`scores.${localStorage.getItem("student_id")}`] : parseInt(newScore),
                "total" : parseInt(newTotal)
            })
            setStatus('Score and total updated')
            setNewScore('')
            setNewTotal('')
            populateActivities()
        }else{
            setStatus('New score is bigger than current total')
        }
    }

    const deleteActivity = async() => {
        const activityRef = doc(db, "activities", localStorage.getItem("activity_id"))
        confirmAlert({
            title: 'Delete activity',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        deleteDoc(activityRef)
                        populateActivities()
                        onClose();
                    }
                },
                {
                    label: 'No',
                    //onClick: () => console.log('no')
                }
            ]
        });
    }

    if (!open) return null;

    return ReactDOM.createPortal(
    <div className="fixed inset-0 z-20 flex h-full w-full items-center justify-center bg-black/[.2]">
        <div className="flex flex-col items-start justify-start rounded-lg bg-blue-400 p-5">
            <p className="text-lg self-center font-bold sm:text-2xl">Edit Activity</p>
            <form id="addSectionForm" onSubmit={(e) => e.preventDefault()} className="flex flex-col justify-between w-full h-full p-2">
                { children && children.map((activity) => {
                    if(activity.id === localStorage.getItem("activity_id")){
                        localStorage.setItem("activity_total", activity.total)
                        return(
                            <div key={ activity.id} >
                                <p className="font-bold break-words">{ activity.name }</p>
                                <p>Score { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>

                                <p className="break-words mt-3">Change score</p>
                                <input type="number" className="w-full" min="1" value={newScore} onChange={(e) => setNewScore(e.target.value)}/>
                                <p>Change total</p>
                                <input type="number" className="w-full" min="1" value={newTotal} onChange={(e) => setNewTotal(e.target.value)}/>
                            </div>     
                        )
                    }
                }) }
                <p>{ status }</p>
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-2 mt-2">
                    <input
                        type="submit"
                        value="CHANGE"
                        className="rounded-lg bg-green-500 font-bold p-1"
                        onClick={() => updateScore()}
                    />
                    <button onClick={() => {deleteActivity();}} className="rounded-lg bg-orange-500 font-bold p-1">DELETE</button>
                    <button onClick={() => {onClose();setStatus('')}} className="rounded-lg bg-red-500 font-bold p-1">CLOSE</button>
                </div>
            </form>
        </div>
    </div>,
    document.getElementById("portal")
    );
};

export default ChangeScoreModal;
