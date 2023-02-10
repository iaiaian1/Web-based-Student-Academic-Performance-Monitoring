import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../util/firebase-config";
import AddSectionModal from "./AddSectionModal";
import CreateStudentAccountModal from "./CreateStudentAccountModal";
//import SectionsArchive from "./SectionsArchive";
import SettingsModal from "./SettingsModal";
import searchImage from "../pictures/search.png"

const Teacher = () => {

  const navigate = useNavigate();

  //Modal
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  //const [isOpen4, setIsOpen4] = useState(false);

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

  //Search function
  const [searchTerm, setSearchTerm] = useState('')

  //Logout
  function Logout(){
    localStorage.clear()
    navigate('/')
  }

  function openSection(id){
    sections.map((section) => {
      if (section.id === id){
        localStorage.setItem("section_id", id);
        localStorage.setItem("section", section.section);
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
            <p className="self-start text-xl sm:text-2xl font-bold underline">Sections</p>
            
            {/* Search div */}
            <div className="self-start flex justify-center items-center gap-x-1 text-md font-bold py-2 ">
              <img src={searchImage} className="object-cover w-5 h-5" alt="search"/>
              <input
                type="text"
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-1 rounded-sm"
              />
            </div>

            {/* Section box */}
            <div className="grid grid-cols-1 gap-3 w-full h-full items-center justify-center rounded-lg border bg-blue-500 overflow-y-scroll p-2 px-5 sm:px-32">
              {sections.map((section) => {
                //Render data ONLY if the teacher is the same as the teacher in localstorage.
                if(searchTerm === ""){
                  //SHOW ALL ITEMS
                  if(section.teacher === localStorage.getItem('user_id') && section.status === "active"){
                    return(
                      <div key={section.id} className="flex items-center justify-center rounded-lg bg-green-400 p-5 text-sm sm:text-base" onClick={() => {openSection(section.id); localStorage.setItem('school_year', section.year)}}>
                        <p className="break-words font-bold">
                          {section.section} ({section.year})
                        </p>
                      </div>
                    )
                  } 
                }else{
                  //Show matching
                  if(section.teacher === localStorage.getItem('user_id') && section.status === "active" && section.section.toLowerCase().replace(/ /g, '').includes(searchTerm.toLowerCase())){
                    return(
                      <div key={section.id} className="flex items-center justify-center rounded-lg bg-green-400 p-5 text-sm sm:text-base" onClick={() => {openSection(section.id); localStorage.setItem('school_year', section.year)}}>
                        <p className="break-words font-bold">
                          {section.section} ({section.year})
                        </p>
                      </div>
                    )
                  } 
                }
                
              })}
            </div>

            {/* Buttons */}
            <div className="w-1/2 sm:w-fit grid grid-cols-1 sm:grid-cols-3 gap-1 m-1">
              <button className="font-bold break-words text-sm sm:text-xl p-2 bg-green-500 rounded-lg" onClick={() => setIsOpen(true)}>Add a section</button>
              <button className="font-bold break-words text-xs sm:text-lg p-2 bg-green-500 rounded-lg" onClick={() => setIsOpen2(true)}>Create student account</button>
              {/* <button className="font-bold break-words text-xs sm:text-lg p-2 bg-green-500" onClick={() => setIsOpen4(true)}>Sections archive</button> */}
              <button className="font-bold break-words text-sm sm:text-xl p-2 bg-red-500 rounded-lg" onClick={() => Logout()}>Logout</button>
            </div>
          </div>
        </div>
      </div>
      
      <AddSectionModal open={isOpen} onClose={() => setIsOpen(false)} populateSection={() => getSections()} sections={sections}>
        Passed data.
      </AddSectionModal>
      <CreateStudentAccountModal open={isOpen2} onClose={() => setIsOpen2(false)} getAccounts={() => getAccounts()}>
        {accounts}
      </CreateStudentAccountModal>
      <SettingsModal open={isOpen3} onClose={() => setIsOpen3(false)}>

      </SettingsModal>
      {/* <SectionsArchive open={isOpen4} onClose={() => setIsOpen4(false)}>

      </SectionsArchive> */}
    </>
  );
};

export default Teacher;
