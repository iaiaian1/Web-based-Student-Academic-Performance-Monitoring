import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import 'react-tabs/style/react-tabs.css';
import { db } from "../util/firebase-config";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const EditActivity = ({ open, children, onClose, activities, populateActivities }) => {

    //fetch activities documents, map only section id on localstorage or filter map on display. it will have its own  inputbox?
    //bonus:  activity type divider.
    //Summative tests 30%, performance tasks 50% ag quarterly assessment 20%.
    //Ang projects, ag recitation dala sa performance tasks.
    //ginabasehan is performance task, summative test, recitation, projects kag periodical test

    const [newName, setNewName] = useState('')
    const [newTotal, setNewTotal] = useState('')
    const [status, setStatus] = useState('')
    let activityId = localStorage.getItem("activity_id")
    

    // const updateScore = async() => {
    //     const activityRef = doc(db, "activities", localStorage.getItem("activity_id"))
    //     if (newScore === ""){
    //         setStatus('Please give a score')
    //     }else if(newTotal === '' && newScore <= parseInt(localStorage.getItem("activity_total"))){
    //         //UPDATE SCORE
    //         await updateDoc(activityRef, { 
    //             [`scores.${localStorage.getItem("student_id")}`] : parseInt(newScore)
    //         })
    //         setStatus('Score updated')
    //         setNewScore('')
    //         setNewTotal('')
    //         populateActivities()
    //     }else if(newTotal !== "" && newScore <= newTotal){
    //         //Set new total score
    //         localStorage.setItem("activity_total", newTotal)
    //         //UPDATE SCORE
    //         await updateDoc(activityRef, { 
    //             [`scores.${localStorage.getItem("student_id")}`] : parseInt(newScore),
    //             "total" : parseInt(newTotal)
    //         })
    //         setStatus('Score and total updated')
    //         setNewScore('')
    //         setNewTotal('')
    //         populateActivities()
    //     }else{
    //         setStatus('New score is bigger than current total')
    //     }
    // }
    // const handleChangeName = (event, id) => {
    //     const updatedActivities = activities.map(activity => {
    //       if (activity.id === id) {
    //         //If activity id is matched, modify that and then return.
    //         //activity.scores[studentId] = parseInt(event.target.value)
    //         activity.name = event.target.value
    //         console.log(activity.name)
    //         return { ...activity };
    //       }
    //       //If not, just return.
    //       return activity;
    //     });
    //     //Set the old activities object with the newly modified one.
    //     activities = updatedActivities;
    // };

    // const handleChangeTotal = (event, id) => {
    //     const updatedActivities = activities.map(activity => {
    //       if (activity.id === id) {
    //         //If activity id is matched, modify that and then return.
    //         //activity.scores[studentId] = parseInt(event.target.value)
    //         activity.total = parseInt(event.target.value)
    //         console.log(typeof event.target.value)
    //         return { ...activity };
    //       }
    //       //If not, just return.
    //       return activity;
    //     });
    //     //Set the old activities object with the newly modified one.
    //     activities = updatedActivities;
    // };


    // const updateActivity = async(id) => {
    //     let activityId
    //     activities.map((activity) => {
    //         if(activity.id == id){
    //             activityId = activity.id


    //         }
    //     })
    // }

    const updateActivity = (e) => {
        e.preventDefault()

        let activityRef = doc(db, "activities", activityId)

        activities.map((activity) => {
            if(activity.id == activityId){
                if(newName == '' && newTotal == ''){
                    return setStatus('No inputs!')
                }

                if(newName != '' && newTotal != ''){
                    // activity.name = newName
                    // activity.total = newTotal
                    updateDoc(activityRef, {
                        name : newName,
                        total : parseInt(newTotal)
                    })
                }else if(newName != ''){
                    //activity.name = newName
                    updateDoc(activityRef, {
                        name : newName
                    })
                }else if(newTotal != ''){
                    //activity.total = newTotal
                    updateDoc(activityRef, {
                        total : parseInt(newTotal)
                    })
                }

                // console.log('reached match')
                populateActivities()
                setStatus('Activity updated')
            }
        })
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
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.2]">
        <div className="flex flex-col items-start justify-start rounded-lg bg-blue-400 p-5">
            <p className="text-lg self-center font-bold sm:text-2xl">Edit Activity</p>
            <form onSubmit={(e) => updateActivity(e)} className="flex flex-col justify-between w-full h-full p-2">
                { activities.map((activity) => {
                    if(activity.id === activityId){
                        // localStorage.setItem("activity_total", activity.total)
                        return(
                            <div key={ activity.id } >
                                <div>
                                    <p className="font-bold break-words">{ activity.name }</p>
                                    <p className="font-bold break-words">0/{ activity.total }</p>
                                    <p>{status}</p>
                                </div>

                                <p className="break-words mt-2">Change activity name</p>
                                <input 
                                    type="text"
                                    value={newName}
                                    onChange={event => setNewName(event.target.value)}
                                />
                                <p className="break-words">Change total score</p>
                                <input 
                                    className="ml-1"
                                    type="number"
                                    min={activity.total}
                                    value={activity.value}
                                    onChange={event => setNewTotal(event.target.value)}
                                />
                            </div>     
                        )
                    }
                }) }
                {/* <div className="grid sm:grid-cols-3 grid-cols-1 gap-2 mt-2">
                    <input
                        type="submit"
                        value="CHANGE"
                        className="rounded-lg bg-green-500 font-bold p-1"
                        onClick={() => {}}
                    />
                    <button onClick={() => {deleteActivity();}} className="rounded-lg bg-orange-500 font-bold p-1">DELETE</button>
                    <button></button>
                    <button onClick={() => {onClose();}} className="rounded-lg bg-red-500 font-bold p-1">CLOSE</button>
                </div> */}
                {/* Buttons */}
                <div className="grid grid-rows-1 sm:grid-cols-3 gap-2 w-full self-center mt-2">
                    <button type="submit" className="bg-green-500 font-bold rounded-lg p-1">Save</button>
                    <button className="rounded-lg bg-orange-500 font-bold p-1" onClick={() => {deleteActivity();}}>Delete</button>
                    <button className="bg-red-500 rounded-lg font-bold p-1" onClick={onClose}>Close</button>
                </div>
            </form>
        </div>
    </div>,
    document.getElementById("portal")
    );
};

export default EditActivity;
