import ReactDOM from "react-dom";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../util/firebase-config";
import { useNavigate } from "react-router";

const CreateStudentAccount = ({ open, children, onClose }) => {

    const navigate = useNavigate()
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const [accounts, setAccounts] = useState([])
    const accountsRef = collection(db, "accounts")

    const getAccounts = async() => {
        let snapshot = await getDocs(accountsRef)
        setAccounts(snapshot.docs.map((account) => (
            account.data().username
        )))
    }

    const addTeacher = async() => {
        if (id === "" || name === "" || password === ""){
            setStatus('Please provide required fields')
        }else{
            if(accounts.includes(id)){
                setStatus('Account already exist')
            }else{
                await addDoc(accountsRef, {
                    name : name,
                    password  : password,
                    type : "teacher",
                    username : id.toLowerCase()
                })
                setStatus('Teacher account added!')
                clear()
            }
        }
    }
    
    function clear(){
        setId('')
        setName('')
        setPassword('')
    }

    // const logout = async() => {
    //     localStorage.clear()
    //     navigate('/')
    // }

    useEffect(() => {
        if(localStorage.getItem("user_name") === null || localStorage.getItem("user_id") === null || localStorage.getItem("type") !== "admin" || localStorage.getItem("account_id") === null){
            navigate('/')
        }
        getAccounts();
    }, [])


    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <p className="text-2xl font-bold mb-5">Create Teacher Account</p>
                <p>{ status }</p>
                <form onSubmit={(e) => e.preventDefault()} className="w-full h-full flex flex-col justify-center">
                    <p className="font-bold">Teacher ID</p>
                    <input 
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className="w-full"
                    />
                    <p className="font-bold">Teacher name</p>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full"
                    />
                    <p className="font-bold">Password</p>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full"
                    />
                    <div className="mt-5 w-full flex justify-around flex-col gap-y-2 sm:flex-row">
                        <input
                            type="submit"
                            value="ADD"
                            className="w-2/3 sm:w-1/4 self-center rounded-lg bg-green-300 py-2 px-5 font-bold"
                            onClick={() => addTeacher()}
                        />
                        <button className="bg-green-400 py-1 px-5 rounded-lg font-bold mt-2" onClick={onClose}>CLOSE</button>
                    </div>
                </form>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default CreateStudentAccount;