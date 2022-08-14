import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { db } from "../util/firebase-config";

const AddSectionModal = ({ open, children, onClose, populateSection }) => {
  //TODO add animation

  const [level, setLevel] = useState('')
  const [section, setSection] = useState('')
  const [subject, setSubject] = useState('')
  const [status, setStatus] = useState('')
  const sectionsColRef = collection(db, "sections")

  //Add student
  const addStudent = async () => {
    if (level === "" || section === "" || subject === "") {
      setStatus("Please fill up required fields");
    }else{
      await addDoc(sectionsColRef, {level: level, section: section, subject: subject, teacher: localStorage.getItem('user_id')})
      Clear()
      alert('Added')
      populateSection()
    }
  }

  //Clear fields
  function Clear(){
    setLevel('')
    setSection('')
    setSubject('')
    setStatus('')
  }
  
  if (!open) return null;

  return ReactDOM.createPortal(
  <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
      <div className="flex flex-col items-start justify-center h-1/3 w-2/3 rounded-lg bg-blue-400 p-5">
        <p className="text-2xl font-bold mb-5">Add section</p>
        <p>{status}</p>
        <form id="addSectionForm" onSubmit={(e) => e.preventDefault()} className="w-full">
            <p className="font-bold">Grade level</p>
            <input 
              type="number"
              min="1"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className="w-full"
            />
            <p className="font-bold">Section name</p>
            <input 
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
              className="w-full"
            />
            <p className="font-bold">Subject</p>
            <input 
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full"
            />
            <div className="mt-3 flex justify-around flex-col gap-y-2 sm:flex-row">
              <input
                type="submit"
                value="ADD"
                className="w-2/3 sm:w-1/4 self-center rounded-lg bg-green-300 py-2 px-5 font-bold"
                onClick={() => addStudent()}
              />
              <button onClick={() => {onClose();Clear();}} className="w-2/3 sm:w-1/4 self-center rounded-lg bg-green-300 py-2 px-5 font-bold">CLOSE</button>
            </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default AddSectionModal;
