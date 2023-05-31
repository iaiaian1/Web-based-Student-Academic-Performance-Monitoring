import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import { db } from "../util/firebase-config";
import logo from "../pictures/logo.png"

const SettingsModal = ({ open, onClose }) => {

    // const [newName, setNewName] = useState('')
    // const [newId, setNewId] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [status, setStatus] = useState('')
    const [account, setAccount] = useState([])
    const accountRef = doc(db, "accounts", localStorage.getItem("account_id"))
    const accountsRef = collection(db, "accounts")

    const getAccounts = async() => {
        const snapshot = await getDocs(accountsRef)
        snapshot.docs.map((data) => {
            if(data.id === localStorage.getItem("account_id")){
                setAccount(data.data())
            }
        })
    }

    function clear(){
        // setNewId('')
        // setNewName('')
        setOldPassword('')
        setNewPassword('')
    }

    const updateInfo = async() => {
        if(oldPassword === "" || newPassword === ""){
            setStatus('No new passwords provided.')
            clear()
        }else if(oldPassword === newPassword){
            setStatus('Old and new password matches!')
        }else if(oldPassword === account.password){
            await updateDoc(accountRef, {
                password : newPassword
            })
            setStatus('Password updated!')
            clear()
        }else{
            setStatus('Old password dont match')
        }

        // //If name is blank, update only the id and password.
        // if(newName === ""){
        //     //Check if newid state has a value
        //     if(newId === ""){
        //         if(oldPassword === "" || newPassword === ""){
        //             setStatus('No new ID, name or passwords provided.')
        //             clear()
        //         }else if(oldPassword === newPassword){
        //             setStatus('Old and new password matches!')
        //         }else if(oldPassword === account.password){
        //             //Update password only
        //             await updateDoc(accountRef, {
        //                 password : newPassword
        //             })
        //             setStatus('Password updated!')
        //             clear()
        //         }else{
        //             setStatus('Old password dont match')
        //             clear()
        //         }
        //     }else{
        //         //If newId state has content, include it with password update.
        //         if(oldPassword === "" || newPassword === ""){
        //             //Update ID only!
        //             await updateDoc(accountRef, {
        //                 username : newId.toLowerCase()
        //             })
        //             setStatus('ID updated')
        //             clear()
        //         }else if(oldPassword === newPassword){
        //             setStatus('Old and new password matches!')
        //             clear()
        //         }else if(oldPassword === account.password){
        //             //Update ID and password.
        //             await updateDoc(accountRef, {
        //                 username : newId.toLowerCase(),
        //                 password : newPassword
        //             })
        //             setStatus('ID and password updated!')
        //             clear()
        //         }else{
        //             setStatus('Old password dont match')
        //             clear()
        //         }
        //     }
        // }else{
        //     //Else, if newname state has a value.
        //     //Check if id state has a value
        //     if(newId === ""){
        //         if(oldPassword === "" || newPassword === ""){
        //             await updateDoc(accountRef, {
        //                 name : newName,
        //             })
        //             localStorage.setItem("user_name", newName)
        //             setStatus('Name updated')
        //             clear()
        //         }else if(oldPassword === newPassword){
        //             setStatus('Old and new password matches!')
        //             clear()
        //         }else if(oldPassword === account.password){
        //             //Update password and name only
        //             await updateDoc(accountRef, {
        //                 name : newName,
        //                 password : newPassword
        //             })
        //             localStorage.setItem("user_name", newName)
        //             setStatus('Name and password updated!')
        //             clear()
        //         }else{
        //             setStatus('Old password dont match')
        //             clear()
        //         }
        //     }else{
        //         //If newId state has content, include it with password update.
        //         if(oldPassword === "" || newPassword === ""){
        //             //Update ID and name only!
        //             await updateDoc(accountRef, {
        //                 name : newName,
        //                 username : newId.toLowerCase()
        //             })
        //             localStorage.setItem("user_name", newName)
        //             setStatus('ID and name updated')
        //             clear()
        //         }else if(oldPassword === newPassword){
        //             setStatus('Old and new password matches!')
        //             clear()
        //         }else if(oldPassword === account.password){
        //             //Update ID, name and password.
        //             await updateDoc(accountRef, {
        //                 name : newName,
        //                 username : newId.toLowerCase(),
        //                 password : newPassword
        //             })
        //             localStorage.setItem("user_name", newName)
        //             setStatus('ID, username and password updated!')
        //             clear()
        //         }else{
        //             setStatus('Old password dont match')
        //             clear()
        //         }
        //     }
        // }
    }

    useEffect(() => {
        getAccounts();
    }, [])

    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-start justify-center rounded-lg bg-blue-400 p-3">
                <div className="flex items-center gap-2 mb-2">
                    <img src={logo} className="object-cover w-10 h-10 sm:w-14 sm:h-14"/>
                    <p className="text-xl sm:text-2xl font-bold underline">Edit account</p>
                </div>
                <p>{ status }</p>
                <form onSubmit={(e) => e.preventDefault()} className="w-full">
                    {/* <p className="font-bold">ID</p>
                    <input 
                        type="text"
                        value={newId}
                        onChange={(e) => setNewId(e.target.value)}
                        className="w-full"
                    />
                    <p className="font-bold">Name</p>
                    <input 
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full"
                    /> */}
                    <p className="font-bold">Old password</p>
                    <input 
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full"
                    />
                    <p className="font-bold">New password</p>
                    <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <input
                            type="submit"
                            value="Update"
                            className="rounded-lg bg-green-500 hover:bg-green-600 duration-200 py-2 font-bold"
                            onClick={() => updateInfo()}
                        />
                        <button onClick={() => {onClose();clear();setStatus('');}} className="rounded-lg bg-red-500 hover:bg-red-600 duration-200 py-2 font-bold">Close</button>
                    </div>
                </form>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default SettingsModal;