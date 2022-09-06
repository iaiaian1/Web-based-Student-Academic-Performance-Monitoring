import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { db } from "../util/firebase-config";

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
      await addDoc(sectionsColRef, {section: sectionSelect, teacher: localStorage.getItem('user_id'), year: schoolYear, status: "active"})
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
      <div className="flex flex-col items-start justify-center h-2/4 sm:h-1/3 w-2/3 rounded-lg bg-blue-400 p-5">
        <p className="text-2xl font-bold mb-5">Add section</p>
        <p>{status}</p>
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
            <div className="mt-3 flex justify-around flex-col gap-y-2 sm:flex-row">
              <input
                type="submit"
                value="ADD"
                className="w-2/3 sm:w-1/4 self-center rounded-lg bg-green-300 py-2 px-5 font-bold"
                onClick={() => addSection()}
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
