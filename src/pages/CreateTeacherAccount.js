import ReactDOM from "react-dom";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../util/firebase-config";
import { useNavigate } from "react-router";
import logo from "../pictures/logo.png"

const CreateStudentAccount = ({ open, children, onClose }) => {

    const navigate = useNavigate()
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const [accounts, setAccounts] = useState([])
    // dirty code. :(
    const [accounts2, setAccounts2] = useState([])
    const accountsRef = collection(db, "accounts")

    const getAccounts = async() => {
        let snapshot = await getDocs(accountsRef)
        setAccounts(snapshot.docs.map((account) => (
            account.data().username
        )))
        setAccounts2(snapshot.docs.map((account) => ({
            ...account.data(), id: account.id
            // account.data().username
        })))
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
                <div className="flex items-center w-full mb-2">
                    <img src={logo} className="object-cover w-14 sm:w-20 h-14 sm:h-20" alt="logo"/>
                    <p className="text-2xl font-bold">Create Teacher Account</p>
                </div>
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
                    <p className="font-bold mt-2">Registered teacher list</p>
                    <div className="border-2 h-72 mb-2 px-2 overflow-auto">
                        {accounts2 && accounts2.map((account) => {
                            if(account.type == "teacher"){
                                return(
                                    <div className="flex" key={account.id}>
                                        <p className="font-bold w-24">{account.username}</p>
                                        <p className="">- {account.name}</p>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        <input
                            type="submit"
                            value="Create Teacher Account"
                            className="rounded-lg bg-green-500 hover:bg-green-600 duration-200 font-bold p-2 cursor-pointer"
                            onClick={() => addTeacher()}
                        />
                        <button className="bg-red-500 hover:bg-red-600 duration-200 rounded-lg font-bold p-2" onClick={onClose}>CLOSE</button>
                    </div>
                </form>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default CreateStudentAccount;