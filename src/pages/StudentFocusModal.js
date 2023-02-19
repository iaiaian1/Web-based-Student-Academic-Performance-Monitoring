import { arrayRemove, deleteField, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import { db } from "../util/firebase-config";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ChangeScoreModal from "./ChangeScoreModal";
import GradeModal from "./GradeModal";
import EditScoresModal from "./EditScoresModal";
import StudentReportCardModal from "./StudentReportCardModal";

const StudentFocusModal = ({ open, children, onClose, populateActivities, populateStudents, activities }) => {

  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const [isOpen3, setIsOpen3] = useState(false)
  const [quarter, setQuarter] = useState('1')
  const [subject, setSubject] = useState('filipino')

  function dropStudent(){
    const remove = async() => {
      //DELETE FIELD FROM SECTION AND REMOVE INSTANCES IN EVERY ACTIVITIES
      //Remove student from section list 1/2
      let sectionRef = doc(db, "sections", localStorage.getItem("section_id"))
      await updateDoc(sectionRef, {
        students : arrayRemove(localStorage.getItem("student_id"))
      })
      //Remove from name from section's activities 2/2
      children.forEach((activity) => {
        if(activity.section === localStorage.getItem("section_id")){
          let activityRef = doc(db, "activities", activity.id)
          updateDoc(activityRef, {
            [`scores.${localStorage.getItem("student_id")}`] : deleteField()
          })
        }
      })
    }

    confirmAlert({
        title: 'Drop student',
        message: 'Are you sure to do this?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => {
                  remove()
                  populateStudents()
                  onClose()
                }
            },
            {
                label: 'No',
            }
        ]
    });
  }

  if (!open) return null;

  return ReactDOM.createPortal(
  <>
    <div className="fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-black/[.54]">
        <div className="flex flex-col items-center justify-center h-5/6 w-5/6 sm:w-2/3 rounded-lg bg-blue-400 p-5">
          <p className="text-lg sm:text-2xl font-bold">{ localStorage.getItem("student_id").toUpperCase() } - { localStorage.getItem("student_name").toUpperCase() }</p>
          <form id="addSectionForm" onSubmit={(e) => e.preventDefault()} className="flex flex-col justify-between w-full h-full p-2">
              <div className="bg-blue-500 rounded-lg p-2">
                <p className="font-bold">Subject</p>
                <select className="text-sm sm:text-base w-full p-1" value={subject} onChange={(e) => {setSubject(e.target.value);populateActivities();}}>
                  <option value="filipino">Filipino</option>
                  <option value="english">English</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="ap">Araling Panlipunan</option>
                  <option value="mapeh">MAPEH</option>
                  <option value="science">Science</option>
                  <option value="mtb">MTB</option>
                </select>
                <p className="font-bold">Quarter</p>
                <select className="text-sm sm:text-base w-full p-1" value={quarter} onChange={(e) => {setQuarter(e.target.value);populateActivities();}}>
                  <option value="1">1st grading</option>
                  <option value="2">2nd grading</option>
                  <option value="3">3rd grading</option>
                  <option value="4">4th grading</option>
                </select>
              </div>

              <div className="ActivityTypeWrapper h-full w-full m-2 overflow-y-auto self-center text-sm sm:text-lg">
                {/* Performance */}
                <div className="p-2 bg-blue-500 rounded-lg">
                  <p className="text-lg sm:text-xl underline font-bold mb-1">Performance</p>
                  { children.map((activity) => {
                    if(activity.quarter === quarter && activity.type === "performance" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                      return(
                        <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                          <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                           
                          {/* <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button> */}
                        </div>
                      )
                    }
                  }) }
                </div>

                {/* Periodical Test */}
                <div className="p-2 bg-blue-500 rounded-lg mt-2">
                  <p className="text-lg sm:text-xl underline font-bold mb-1">Periodical Test</p>
                  { children.map((activity) => {
                    if(activity.quarter === quarter && activity.type === "periodical" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                      return(
                        <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                          <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                          {/* <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button> */}
                        </div>
                      )
                    }
                  }) }
                </div>

                {/* Project */}
                <div className="p-2 bg-blue-500 rounded-lg mt-2">
                  <p className="text-lg sm:text-xl underline font-bold mb-1">Project</p>
                  { children.map((activity) => {
                    if(activity.quarter === quarter && activity.type === "project" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                      return(
                        <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                          <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                          {/* <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button> */}
                        </div>
                      )
                    }
                  }) }
                </div>

                {/* Recitations */}
                <div className="p-2 bg-blue-500 rounded-lg mt-2">
                  <p className="text-lg sm:text-xl underline font-bold mb-1">Recitations</p>
                  { children.map((activity) => {
                    if(activity.quarter === quarter && activity.type === "recitation" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                      return(
                        <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                          <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                          {/* <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button> */}
                        </div>
                      )
                    }
                  }) }
                </div>

                {/* Summative test */}
                <div className="p-2 bg-blue-500 rounded-lg mt-2">
                  <p className="text-lg sm:text-xl underline font-bold mb-1">Summative Test</p>
                  { children.map((activity) => {
                    if(activity.quarter === quarter && activity.type === "summative" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                      return(
                        <div key={ activity.id } className="flex justify-between px-2 mb-1 w-full">
                          <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                          {/* <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button> */}
                        </div>
                      )
                    }
                  }) }
                </div>

              </div>

              {/* <Tabs className="h-full w-full m-2 overflow-y-auto self-center text-sm sm:text-base">
                <TabList>
                    <Tab>Performance</Tab>
                    <Tab>Periodical Test</Tab>
                    <Tab>Project</Tab>
                    <Tab>Recitations</Tab>
                    <Tab>Summative Test</Tab>
                </TabList>
                <TabPanel className="break-words">
                  
                  <div>
                    { children.map((activity) => {
                      if(activity.quarter === quarter && activity.type === "performance" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                        return(
                          <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                            <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                            <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button>
                          </div>
                        )
                      }
                    }) }
                  </div>
                </TabPanel>
                <TabPanel>
                  
                  <div>
                    { children.map((activity) => {
                      if(activity.quarter === quarter && activity.type === "periodical" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                        return(
                          <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                            <p>{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                            <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button>
                          </div>
                        )
                      }
                    }) }
                  </div>
                </TabPanel>
                <TabPanel>
                  
                  <div>
                    { children.map((activity) => {
                      if(activity.quarter === quarter && activity.type === "project" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                        return(
                          <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                            <p>{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                            <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button>
                          </div>
                        )
                      }
                    }) }
                  </div>
                </TabPanel>
                <TabPanel>
                  
                  <div>
                    { children.map((activity) => {
                      if(activity.quarter === quarter && activity.type === "recitation" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                        return(
                          <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                            <p>{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                            <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button>
                          </div>
                        )
                      }
                    }) }
                  </div>
                </TabPanel>
                <TabPanel>
                  
                  <div>
                    { children.map((activity) => {
                      if(activity.quarter === quarter && activity.type === "summative" && activity.section === localStorage.getItem("section_id") && activity.subject === subject){
                        return(
                          <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                            <p>{ activity.name } - { activity.scores[localStorage.getItem("student_id")] }/{ activity.total }</p>                                                                                                                                
                            <button className="bg-green-500 px-2 rounded-lg font-bold" onClick={() => {setIsOpen(true);localStorage.setItem("activity_id", activity.id)}}>Edit</button>
                          </div>
                        )
                      }
                    }) }
                  </div>
                </TabPanel>
              </Tabs> */}

              <div className="grid grid-rows-1 sm:grid-cols-3 gap-2 m-1 w-1/2 self-center">
                <button onClick={() => {setIsOpen3(true);}} className="bg-blue-500 hover:bg-blue-600 duration-200 font-bold text-lg rounded-lg ">Edit scores</button>
                <button onClick={() => {setIsOpen2(true);}} className="rounded-lg bg-green-500 hover:bg-green-600 duration-200 font-bold text-lg">Grades</button>
                {/* <button onClick={() => {dropStudent();}} className="w-2/3 sm:w-1/4 self-center rounded-lg bg-red-500 py-2 px-1 font-bold text-xs sm:text-lg">DROPOUT</button> */}
                <button onClick={() => {onClose();}} className="rounded-lg bg-red-500 hover:bg-red-600 duration-200 font-bold text-lg">Close</button>
              </div>
          </form>
        </div>
      </div>
      <ChangeScoreModal open={isOpen} onClose={() => setIsOpen(false)} populateActivities={ () => populateActivities()}>
        { children }
      </ChangeScoreModal>
      {/* <GradeModal open={isOpen2} quarter={quarter} activities={activities} section={localStorage.getItem("section_id")} subject={subject} onClose={() => setIsOpen2(false)}>
        { children }
      </GradeModal> */}
      <StudentReportCardModal open={isOpen2} onClose={() => setIsOpen2(false)}>

      </StudentReportCardModal>
      <EditScoresModal open={isOpen3} onClose={() => setIsOpen3(false)} activities={activities} populateActivities={ () => populateActivities()}>

      </EditScoresModal>
    </>,
    document.getElementById("portal")
  );
};

export default StudentFocusModal;
