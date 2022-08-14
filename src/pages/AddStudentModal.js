import React, { useState } from "react";
import ReactDOM from "react-dom";
import { db } from "../util/firebase-config";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";

const AddStudentModal = ({ open, children, onClose, populateStudents }) => {

  const [studentId, setStudentId] = useState('')
  const [status, setStatus] = useState('')

  const sectionArrayRef = doc(db, "sections", localStorage.getItem('section_id'))

  const addStudent = async() =>{
    // function uploadStudent(){
    //   updateDoc(sectionArrayRef, { students: arrayUnion(studentId) })
    //   setStatus('Student enrolled')
    //   setStudentId('')
    //   return true
    // }

    if (studentId === "") {
      setStatus("Please fill up required fields");
    }else{
      children[0].some(account => {
        //Check if exists
        if(account.username === studentId){
          //Check if not null
          if(children[1]){
            //Continue, check if enrolled.
            if(children[1].includes(studentId)){
              setStatus('Already enrolled')
              return true
            }else{
              updateDoc(sectionArrayRef, { students: arrayUnion(studentId) })
              setStatus('Student enrolled')
              setStudentId('')
              populateStudents()
              return true
            }
          }else{
            updateDoc(sectionArrayRef, { students: arrayUnion(studentId) })
            setStatus('Student enrolled')
            setStudentId('')
            populateStudents()
            return true
          }
        }else{
          setStatus('Student not found')
        }
      })
    }
  }
  
  if (!open) return null;

  return ReactDOM.createPortal(
  <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
      <div className="flex flex-col items-start justify-center h-1/3 w-2/3 rounded-lg bg-blue-400 p-5">
        <p className="text-2xl font-bold mb-5">Add student</p>
        <p>{ status }</p>
        <form id="addSectionForm" onSubmit={(e) => e.preventDefault()} className="w-full">
            <p className="font-bold">Student ID</p>
            <input 
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
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
              <button onClick={() => {onClose();}} className="w-2/3 sm:w-1/4 self-center rounded-lg bg-green-300 py-2 px-5 font-bold">CLOSE</button>
            </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default AddStudentModal;
