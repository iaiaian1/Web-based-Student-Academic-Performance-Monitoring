import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { db } from "../util/firebase-config";
import logo from "../pictures/logo.png"

const AddSectionModal = ({ open, children, onClose, populateSection, sections }) => {
  //TODO add animation

  //Set a default section
  const [sectionSelect, setSectionSelect] = useState('1 - Rose')
  const [status, setStatus] = useState('')
  const sectionsColRef = collection(db, "sections")
  const date = new Date()

  //Add student
  const addSection = async () => {
    if (sectionSelect === "") {
      setStatus("Please fill up required fields");
    }else{
      let schoolYear = `${date.getFullYear()} - ${date.getFullYear()+1}`
      await addDoc(sectionsColRef, {section: sectionSelect, teacher: localStorage.getItem('user_id'), teacherName: localStorage.getItem('user_name'), year: schoolYear, status: "active"})
      Clear()
      alert('Added')
      populateSection()
    }
  }

  //Clear fields
  function Clear(){
    setSectionSelect('')
    setStatus('')
  }

  if (!open) return null;

  return ReactDOM.createPortal(
  <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
      <div className="flex flex-col items-start justify-center h-1/3 sm:h-1/4 w-2/3 sm:w-1/4 rounded-lg bg-blue-400 p-5">
        <div className="flex items-center w-full mb-2">
          <img src={logo} className="object-cover w-14 sm:w-20 h-14 sm:h-20" alt="logo"/>       
          <p className="text-2xl font-bold underline">Add section</p>
          <img src={logo} className="object-cover w-14 sm:w-20 h-14 sm:h-20 opacity-0" alt="logo"/>       
        </div>
        <form id="addSectionForm" onSubmit={(e) => e.preventDefault()} className="w-full">
            <p className="font-bold">Select a section</p>
            <select id="selectId" className="text-sm w-full p-1" value={sectionSelect} onChange={(e) => setSectionSelect(e.target.value)}>
              <option value="1 - Rose" id="1 - Rose">1 - Rose</option>
              <option value="2 - Mango" id="2 - Mango">2 - Mango</option>
              <option value="3 - Narra" id="3 - Narra">3 - Narra</option>
              <option value="4 - Pluto" id="4 - Pluto">4 - Pluto</option>
              <option value="5 - Diamond" id="5 - Diamond">5 - Diamond</option>
              <option value="6 - Rizal" id="6 - Rizal">6 - Rizal</option>
              <option value="Kindergarten" id="Kindergarten">Kindergarten</option>
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <input
                type="submit"
                value="Add"
                className="rounded-lg bg-green-500 hover:bg-green-600 duration-200 py-2 font-bold"
                onClick={() => addSection()}
              />
              <button onClick={() => {onClose();Clear();}} className="rounded-lg bg-red-500 hover:bg-red-600 duration-200 py-2 font-bold">Close</button>
            </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default AddSectionModal;
