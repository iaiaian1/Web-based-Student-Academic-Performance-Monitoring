import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import { db } from "../util/firebase-config";
import GradeModal from "./GradeModal";
import SettingsModal from "./SettingsModal";

const Student = () => {

    const [quarter, setQuarter] = useState('1')
    const [section, setSection] = useState('')
    const [activities, setActivities] = useState([])
    const [sections, setSections] = useState([])

    //Modal
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)

    const navigate = useNavigate()

    const getActivities = async() => {
        const activitiesRef = collection(db, "activities")
        const snapshot = await getDocs(activitiesRef)
        setActivities(snapshot.docs.map((activity) => ({
            ...activity.data(), id: activity.id
        })))
    }

    const getSections = async() => {
        const sectionsRef = collection(db, "sections")
        const snapshot = await getDocs(sectionsRef)
        setSections(snapshot.docs.map((section) => ({
            ...section.data(), id: section.id
        })))
    }

    function Logout(){
        localStorage.clear()
        navigate('/')
      }

    useEffect(() => {
        getActivities()
        getSections()
    }, [])

    return ( 
        <>
            <div className="flex h-screen items-center justify-center bg-gradient-to-tl from-blue-100 via-blue-300 to-blue-500">
                <div className="flex flex-col items-center justify-center h-5/6 w-11/12 rounded-lg bg-blue-400 p-5">
                    <div className="flex justify-between w-full">
                        <p className="text-xl sm:text-3xl font-bold">Hello, {localStorage.getItem("user_name").toUpperCase()}!</p>
                        <button className="w-1/5 font-bold text-xs sm:text-xl bg-red-500 rounded-lg" onClick={() => setIsOpen2(true)}>Settings</button>
                    </div>
                    <div className="bg-blue-500 rounded-lg p-2 w-full mt-3">
                        <p className="font-bold">Quarter</p>
                        <select className="text-sm w-full p-1" value={quarter} onChange={(e) => {setQuarter(e.target.value);}}>
                            <option value="1">1st grading</option>
                            <option value="2">2nd grading</option>
                            <option value="3">3rd grading</option>
                            <option value="4">4th grading</option>
                        </select>
                    </div>
                    <div className="bg-blue-500 rounded-lg p-2 w-full mt-3">
                        <p className="font-bold">Section</p>
                        <select className="text-sm w-full p-1" value={section} onChange={(e) => {setSection(e.target.value);}}>
                            <option value="">Select</option>
                            {sections.map((section) => {
                                if(section.students){
                                    if(section.students.includes(localStorage.getItem('user_id'))){
                                        return(
                                            <option key={section.id} value={section.id}>{ section.level } - { section.section } - { section.subject }</option>
                                        )
                                    }
                                }
                            })}
                        </select>
                        
                    </div>
                    <Tabs className="h-full w-full m-2 overflow-y-auto self-center text-sm sm:text-base">
                        <TabList>
                            <Tab>Performance</Tab>
                            <Tab>Periodical Test</Tab>
                            <Tab>Project</Tab>
                            <Tab>Recitations</Tab>
                            <Tab>Summative Test</Tab>
                        </TabList>
                        <TabPanel className="break-words">
                        {/* Performance */}
                        <div>
                            { activities.map((activity) => {
                            if(activity.quarter === quarter && activity.type === "performance" && activity.section === section){
                                return(
                                <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                                    <p className="break-words">{ activity.name } - { activity.scores[localStorage.getItem("user_id")] }/{ activity.total }</p>                                                                                                                                
                                </div>
                                )
                            }
                            }) }
                        </div>
                        </TabPanel>
                        <TabPanel>
                        {/* Periodical Test */}
                        <div>
                            { activities.map((activity) => {
                            if(activity.quarter === quarter && activity.type === "periodical" && activity.section === section){
                                return(
                                <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                                    <p>{ activity.name } - { activity.scores[localStorage.getItem("user_id")] }/{ activity.total }</p>                                                                                                                                
                                </div>
                                )
                            }
                            }) }
                        </div>
                        </TabPanel>
                        <TabPanel>
                        {/* Project */}
                        <div>
                            { activities.map((activity) => {
                            if(activity.quarter === quarter && activity.type === "project" && activity.section === section){
                                return(
                                <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                                    <p>{ activity.name } - { activity.scores[localStorage.getItem("user_id")] }/{ activity.total }</p>                                                                                                                                
                                </div>
                                )
                            }
                            }) }
                        </div>
                        </TabPanel>
                        <TabPanel>
                        {/* Recitations */}
                        <div>
                            { activities.map((activity) => {
                            if(activity.quarter === quarter && activity.type === "recitation" && activity.section === section){
                                return(
                                <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                                    <p>{ activity.name } - { activity.scores[localStorage.getItem("user_id")] }/{ activity.total }</p>                                                                                                                                
                                </div>
                                )
                            }
                            }) }
                        </div>
                        </TabPanel>
                        <TabPanel>
                        {/* Summative Test */}
                        <div>
                            { activities.map((activity) => {
                            if(activity.quarter === quarter && activity.type === "summative" && activity.section === section){
                                return(
                                <div key={ activity.id } className="flex justify-between px-10 mb-1 w-full rounded-lg py-1 bg-blue-500">
                                    <p>{ activity.name } - { activity.scores[localStorage.getItem("user_id")] }/{ activity.total }</p>                                                                                                                                
                                </div>
                                )
                            }
                            }) }
                        </div>
                        </TabPanel>
                    </Tabs>
                    {/* Buttons */}
                    <div className="w-full h-1/6 flex justify-around p-5">
                        <button className="w-1/4 font-bold break-words text-sm sm:text-xl bg-green-500" onClick={() => setIsOpen(true)}>GRADES</button>
                        <button className="w-1/4 font-bold break-words text-sm sm:text-xl bg-red-500" onClick={() => Logout()}>LOGOUT</button>
                    </div>
                </div>
            </div>
            <GradeModal open={isOpen} quarter={quarter} section={section} onClose={() => setIsOpen(false)}>
                { activities }
            </GradeModal>
            <SettingsModal open={isOpen2} onClose={() => setIsOpen2(false)}>

            </SettingsModal>
        </>
     );
}
 
export default Student;