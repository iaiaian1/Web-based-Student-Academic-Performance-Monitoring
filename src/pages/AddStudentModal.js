import React, { useState } from "react";
import ReactDOM from "react-dom";
import { db } from "../util/firebase-config";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";
import searchImage from "../pictures/search.png"
import logo from "../pictures/logo.png"

const AddStudentModal = ({ open, children, onClose, populateStudents }) => {

  // const [studentId, setStudentId] = useState('')
  // const [status, setStatus] = useState('')

  const sectionArrayRef = doc(db, "sections", localStorage.getItem('section_id'))

  //Search
  const [searchTerm, setSearchTerm] = useState('')

  // const addStudent1 = async() =>{
  //   // function uploadStudent(){
  //   //   updateDoc(sectionArrayRef, { students: arrayUnion(studentId) })
  //   //   setStatus('Student enrolled')
  //   //   setStudentId('')
  //   //   return true
  //   // }

  //   if (studentId === "") {
  //     setStatus("Please fill up required fields");
  //   }else{
  //     children[0].some(account => {
  //       //Check if exists
  //       if(account.username === studentId.toLowerCase()){
  //         //Check if not null
  //         if(children[1]){
  //           //Continue, check if enrolled.
  //           if(children[1].includes(studentId.toLowerCase())){
  //             setStatus('Already enrolled')
  //             return true
  //           }else{
  //             updateDoc(sectionArrayRef, { students: arrayUnion(studentId.toLowerCase()) })
  //             setStatus('Student enrolled')
  //             setStudentId('')
  //             populateStudents()
  //             return true
  //           }
  //         }else{
  //           updateDoc(sectionArrayRef, { students: arrayUnion(studentId.toLowerCase()) })
  //           setStatus('Student enrolled')
  //           setStudentId('')
  //           populateStudents()
  //           return true
  //         }
  //       }else{
  //         setStatus('Student not found')
  //       }
  //     })
  //   }
  // }

  const addStudent = async (studentId)=>{
    updateDoc(sectionArrayRef, { students: arrayUnion(studentId.toLowerCase()) })
    alert("Student added");
    populateStudents()
  }
  
  if (!open) return null;

  return ReactDOM.createPortal(
  <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
      <div className="flex flex-col items-start justify-center w-2/3 sm:w-1/3 h-2/3 rounded-lg bg-blue-400 p-5">
        <div className="flex items-center gap-2 mb-2">
          <img src={logo} className="object-cover w-10 h-10 sm:w-14 sm:h-14"/>
          <p className="text-2xl font-bold underline">Student list</p>
        </div>

        {/* Search div */}
        <div className="flex justify-center items-center text-md font-bold py-2">
          <img src={searchImage} className="object-cover w-5 h-5" alt="search"/>
          <input
            type="text"
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-1 rounded-sm"
          />
        </div>

        <div className="w-full h-full grid grid-cols-1 content-start overflow-y-auto gap-y-1 bg-blue-500 p-2 rounded-lg">
          {/* {console.log(children[0])} */}
          {children[0].map((account) => {

            if(searchTerm === ""){
              if(!children[1]?.includes(account.username) && account.type === "student"){
                return(
                  <div key={account.username} className="flex justify-between items-center rounded-lg bg-green-500 hover:bg-green-400 duration-200 p-5 text-sm sm:text-base">
                    <p>{account.username} - {account.name}</p>
                    <button className="bg-green-600 p-2 rounded-lg font-bold" onClick={() => {addStudent(account.username)}}>Enroll</button>
                  </div>
                )
              }
            }else{
              if(!children[1]?.includes(account.username) && account.type === "student" && account.name.toLowerCase().replace(/ /g, '').includes(searchTerm.toLowerCase())){
                return(
                  <div key={account.username} className="h-min flex justify-between items-center rounded-lg bg-green-400 p-5 text-sm sm:text-base">
                    <p>{account.username} - {account.name}</p>
                    <button className="bg-green-500 p-2 rounded-lg font-bold" onClick={() => {addStudent(account.username)}}>Enroll</button>
                  </div>
                )
              }
            }

          })}
        </div>
        
        <div className="w-full m-1 p-2 flex justify-center items-center">
          {/* <input
            type="submit"
            value="ADD"
            className="rounded-lg bg-green-500 font-bold p-2"
            onClick={() => addStudent()}
          /> */}
          <button onClick={() => {onClose();}} className="rounded-lg bg-red-500 hover:bg-red-600 duration-200 font-bold p-2 px-5">Close</button>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default AddStudentModal;
