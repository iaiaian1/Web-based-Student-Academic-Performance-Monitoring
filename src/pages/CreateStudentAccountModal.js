import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { db } from "../util/firebase-config";
import logo from "../pictures/logo.png"

const CreateStudentAccountModal = ({ open, children, onClose, getAccounts }) => {

    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const accountsRef = collection(db, "accounts")

    const createAccount = async() => {
        if (id === "" || name === "" || password === "") {
            setStatus("Please fill up required fields");
        }else{
            //Check the index of id state if it exists in inherited prop array.
            if(children.indexOf(id.toLowerCase()) === -1){
                addDoc(accountsRef, { username: id.toLowerCase(), name: name, password: password, type: "student" })
                alert('Added')
                Clear()
                getAccounts()
            }else{
                setStatus("Account already exists");
            }
        }
        
    }

    function Clear(){
        setId('')
        setName('')
        setPassword('')
        setStatus('')
    }
  
    if (!open) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-start justify-center rounded-lg bg-blue-400 p-5">
                <div className="flex items-center w-full mb-2">
                    <img src={logo} className="object-cover w-14 sm:w-20 h-14 sm:h-20" alt="logo"/>  
                    <p className="text-xl sm:text-2xl font-bold underline">New student account</p>
                </div>
                <p>{status}</p>
                <form id="addSectionForm" onSubmit={(e) => e.preventDefault()} className="w-full">
                    <p className="font-bold">LRN</p>
                    <input 
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className="w-full"
                    />
                    <p className="font-bold">Name</p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <input
                            type="submit"
                            value="Create"
                            className="self-center rounded-lg bg-green-500 hover:bg-green-600 duration-200 py-2 px-5 font-bold cursor-pointer"
                            onClick={() => createAccount()}
                        />
                        <button onClick={() => {onClose();}} className=" rounded-lg bg-red-500 hover:bg-red-600 duration-200 py-2 px-5 font-bold">Close</button>
                    </div>
                </form>
            </div>
        </div>,
        document.getElementById("portal")
    );
};

export default CreateStudentAccountModal;
