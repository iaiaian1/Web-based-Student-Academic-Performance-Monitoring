import { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import CreateStudentAccount from "./CreateTeacherAccount";
import DeactivateSection from "./DeactivateSection";
import ResetAccount from "./ResetAccount";

const AdminPage = () => {

    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [isOpen3, setIsOpen3] = useState(false)

    const logout = async() => {
        localStorage.clear()
        navigate('/')
    }

    useEffect(() => {
        if(localStorage.getItem("user_name") === null || localStorage.getItem("user_id") === null || localStorage.getItem("type") !== "admin" || localStorage.getItem("account_id") === null){
            navigate('/')
        }
    }, [])

    return (
        <>
            <div className="flex h-screen items-center justify-center bg-gradient-to-tl from-blue-100 via-blue-300 to-blue-500">
                <div className="flex flex-col items-center justify-center h-2/4 w-11/12 rounded-lg bg-blue-400 p-5">
                    <p className="font-bold text-2xl">ADMIN</p>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-1 m-1">
                        <button className="font-bold break-words text-xs sm:text-lg p-2 bg-green-500" onClick={() => setIsOpen(true)}>Create teacher account</button>
                        <button className="font-bold break-words text-xs sm:text-lg p-2 bg-green-500" onClick={() => setIsOpen2(true)}>Deactivate / Activate section</button>
                        <button className="font-bold break-words text-xs sm:text-lg p-2 bg-green-500" onClick={() => setIsOpen3(true)}>Reset account</button>
                        <button className="font-bold break-words text-xs sm:text-lg p-2 bg-red-500" onClick={() => logout()}>Logout</button>
                    </div>
                </div>
            </div>
            <CreateStudentAccount open={isOpen} onClose={() => setIsOpen(false)}>

            </CreateStudentAccount>
            <DeactivateSection open={isOpen2} onClose={() => setIsOpen2(false)}>

            </DeactivateSection>
            <ResetAccount open={isOpen3} onClose={() => setIsOpen3(false)}>

            </ResetAccount>
        </>
     );
}
 
export default AdminPage;