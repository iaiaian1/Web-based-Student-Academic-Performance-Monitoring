import ReactDOM from "react-dom";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../util/firebase-config";
import { useNavigate } from "react-router";

const ResetAccount = ({ open, children, onClose }) => {

    const [id, setId] = useState('')
    const [status, setStatus] = useState('')
    const [accounts, setAccounts] = useState()
    const accountsRef = collection(db, "accounts")

    const getAccounts = async() => {
        let snapshot = await getDocs(accountsRef)
        setAccounts(snapshot.docs.map((account) => ({
            ...account.data(), id: account.id
        })))
    }

    const resetAccount = async() => {
        accounts.some((account) => {
            if(account.username === id){
                //console.log(account.id)
                let accountRef = doc(db, "accounts", account.id)
                updateDoc(accountRef, {
                    password: "123"
                })
                setStatus('Reset done')
                setId('')
                return true
            }else{
                setStatus('Account does not exist')
            }
        })
    }

    useEffect(() => {
        getAccounts()
    },[])

    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <p className="text-2xl font-bold mb-3">Reset Account</p>
                <p>Password is reset to 123</p>
                <p>{ status }</p>
                <form onSubmit={(e) => e.preventDefault()} className="w-full h-full flex flex-col justify-center">
                    <p className="font-bold">Account ID</p>
                    <input 
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className="w-full"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-1">
                        <input
                            type="submit"
                            value="RESET"
                            className="rounded-lg bg-green-500 font-bold"
                            onClick={() => resetAccount()}
                        />
                        <button className="bg-red-500 rounded-lg font-bold" onClick={() => {onClose(); setId(''); setStatus('')}}>CLOSE</button>
                    </div>
                </form>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default ResetAccount;