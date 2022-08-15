import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../util/firebase-config";
import AddSectionModal from "./AddSectionModal";
import CreateStudentAccountModal from "./CreateStudentAccountModal";
import SettingsModal from "./SettingsModal";

const Teacher = () => {

  const navigate = useNavigate();

  //Modal
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  //Populate sections
  const [sections, setSections] = useState([])
  const [accounts, setAccounts] = useState([])
  const sectionsColRef = collection(db, "sections")
  const accountsColRef = collection(db, "accounts")

  //get accounts
  const getAccounts = async () => {
    const snapshot = await getDocs(accountsColRef)
    setAccounts(snapshot.docs.map((account) => (
      account.data().username
    )))
    //console.log('get account ran')
  }

  //get section
  const getSections = async () => {
    const snapshot = await getDocs(sectionsColRef)
    setSections(snapshot.docs.map((section) => ({
      id: section.id, ...section.data()
    })))
  }

  //Logout
  function Logout(){
    localStorage.clear()
    navigate('/')
  }

  function openSection(id){
    sections.map((section) => {
      if (section.id === id){
        localStorage.setItem("section_id", id);
        localStorage.setItem("level", section.level);
        localStorage.setItem("section", section.section);
        localStorage.setItem("subject", section.subject);
      }
    })
    navigate('section')
  }
  
  useEffect(() => {
    if(localStorage.getItem("user_name") === null || localStorage.getItem("user_id") === null || localStorage.getItem("type") !== "teacher" || localStorage.getItem("account_id") === null){
      navigate('/')
    }
    getSections();
    getAccounts();
  }, [])

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gradient-to-tl from-blue-100 via-blue-300 to-blue-500">
        <div className="flex gap-y-2 h-5/6 w-11/12 flex-col items-center rounded-lg bg-blue-400 p-5">
          <div className="flex justify-between w-full">
            <p className="text-xl sm:text-3xl font-bold">Hello, Teacher {localStorage.getItem("user_name")}!</p>
            <button className="w-1/5 font-bold text-xs sm:text-xl bg-red-500 rounded-lg" onClick={() => setIsOpen3(true)}>Settings</button>
          </div>
          <div className="mt-5 flex h-5/6 w-full flex-col items-center justify-center">
            <p className="self-start text-xl font-bold">Sections</p>
            
            {/* Section box */}
            <div className="grid grid-cols-2 sm:grid-cols-5 h-full w-full gap-1 rounded-lg border bg-blue-500 p-5 overflow-auto">
              {sections.map((section) => {
                //Render data ONLY if the teacher is the same as the teacher in localstorage.
                if(section.teacher === localStorage.getItem('user_id')){
                  return(
                    <div key={section.id} className="flex h-14 w-full items-center justify-center rounded-lg bg-green-400 p-1 text-sm sm:text-base" onClick={() => openSection(section.id)}>
                      <p className="break-words font-bold">
                        {section.level} - {section.section} - {section.subject}
                      </p>
                    </div>
                  )
                }
              })}
            </div>

            {/* Buttons */}
            <div className="w-full h-1/6 flex justify-around p-5">
              <button className="w-1/4 font-bold break-words text-sm sm:text-xl bg-green-500" onClick={() => setIsOpen(true)}>Add a section</button>
              <button className="w-1/4 font-bold break-words text-xs sm:text-lg bg-green-500" onClick={() => setIsOpen2(true)}>Create student account</button>
              <button className="w-1/4 font-bold break-words text-sm sm:text-xl bg-red-500" onClick={() => Logout()}>Logout</button>
            </div>
          </div>
        </div>
      </div>
      
      <AddSectionModal open={isOpen} onClose={() => setIsOpen(false)} populateSection={() => getSections()}>
        Passed data.
      </AddSectionModal>
      <CreateStudentAccountModal open={isOpen2} onClose={() => setIsOpen2(false)} getAccounts={() => getAccounts()}>
        {accounts}
      </CreateStudentAccountModal>
      <SettingsModal open={isOpen3} onClose={() => setIsOpen3(false)}>

      </SettingsModal>
    </>
  );
};

export default Teacher;
