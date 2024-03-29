import React, { useState } from "react";
import ReactDOM from "react-dom";
import { db } from "../util/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import logo from "../pictures/logo.png"

const AddActivityModal = ({ open, children, onClose, populateActivities, students }) => {

  const [term, setTerm] = useState('1')
  const [type, setType] = useState('performance')
  const [subject, setSubject] = useState('filipino')
  const [activity, setActivity] = useState('')
  const [total, setTotal] = useState('')
  const [status, setStatus] = useState('')

  const colRef = collection(db, "activities")

  const addActivity = async() =>{
    if (subject == "" || term === "" || type === "" || activity === "" || total === "") {
      setStatus("Please fill up required fields");
    }else{
      //Check if null
      if(students.length !== 0){
        //Initialize object
        const scores = {}
        await students.forEach((element) => {
          scores[element] = 0
        })
        await addDoc(colRef, { subject: subject, quarter: term, type: type, name: activity, total: parseInt(total), section: localStorage.getItem("section_id"), scores: scores })
        alert('Added')
        setActivity('')
        setTotal('')
        setStatus('Activity added')
        populateActivities()
      }else{
        setStatus('No students! :(')
      }
    }
  }

  if (!open) return null;

  return ReactDOM.createPortal(
  <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
      <div className="flex flex-col items-start justify-center w-2/3 sm:w-2/5 rounded-lg bg-blue-400 p-5">
        <div className="flex items-center justify-between w-full gap-2 mb-2 rounded-lg">
          <img src={logo} className="object-cover w-10 h-10 sm:w-14 sm:h-14"/> 
          <p className="text-2xl font-bold underline">Add activity</p>
          <img src={logo} className="object-cover w-10 h-10 sm:w-14 sm:h-14 opacity-0"/> 
        </div>
        <p>{ status }</p>
        <form id="addSectionForm" onSubmit={(e) => e.preventDefault()} className="w-full">
            {/* QUARTER */}
            <p className="font-bold">Subject</p>
            <select id="countries" className="text-sm w-full p-1" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="filipino">Filipino</option>
              <option value="english">English</option>
              <option value="mathematics">Mathematics</option>
              <option value="ap">Araling Panlipunan</option>
              <option value="mapeh">MAPEH</option>
              <option value="science">Science</option>
              <option value="mtb">MTB</option>
            </select>
            <p className="font-bold">Quarter</p>
            <select id="countries" className="text-sm w-full p-1" value={term} onChange={(e) => setTerm(e.target.value)}>
              <option value="1">1st grading</option>
              <option value="2">2nd grading</option>
              <option value="3">3rd grading</option>
              <option value="4">4th grading</option>
            </select>
            {/* TYPE */}
            <p className="font-bold">Activity type</p>
            <select id="countries" className="text-sm w-full p-1" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="performance">Performance task</option>
              <option value="periodical">Periodical test</option>
              <option value="project">Project</option>
              <option value="recitation">Recitation</option>
              <option value="summative">Summative test</option>
            </select>
            {/* NAME */}
            <p className="font-bold">Activity name</p>
            <input 
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
              className="w-full"
            />
            {/* TOTAL */}
            <p className="font-bold">Total score</p>
            <input 
              type="number"
              min="1"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              required
              className="w-full"
            />
            <div className="mt-3 flex justify-around flex-col gap-y-2 sm:flex-row">
              <input
                type="submit"
                value="ADD"
                className="w-2/3 sm:w-1/4 self-center rounded-lg bg-green-500 py-1 px-1 font-bold hover:bg-green-600 duration-200"
                onClick={() => addActivity()}
              />
              <button onClick={() => {onClose();}} className="w-2/3 sm:w-1/4 self-center rounded-lg bg-red-500 hover:bg-red-600 duration-200 py-1 px-1 font-bold">CLOSE</button>
            </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default AddActivityModal;
