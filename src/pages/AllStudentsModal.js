import ReactDOM from "react-dom";
import { useReactToPrint } from 'react-to-print'
import { useState, useRef } from "react";
import logo from "../pictures/logo.png"

const AllStudentsModal = ({ open, children, onClose, students, accounts }) => {

    let componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    if (!open) return null;

    return ReactDOM.createPortal( 
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <div className="overflow-auto bg-white w-full h-full p-5 flex flex-col justify-center items-center" ref={componentRef}>
                    <img src={logo} className="object-cover w-10 h-10 sm:w-14 sm:h-14"/>
                    <p className="text-2xl font-bold underline">All Students</p>
                    <p className="text-xl font-bold underline px-2">Grade: {localStorage.getItem("section")} ({localStorage.getItem("school_year")})</p>
                    <p className="text-xl font-bold mb-5 underline">Teacher: {localStorage.getItem("user_name")}</p>

                    <div className="w-full h-full flex flex-col justify-center items-center">
                        {students && students.map((student, index) => {
                            return(
                                accounts.map((account) => {
                                    if(account.username == student){
                                        return(
                                            <div key={student}>
                                                <p>{index+1}. {account.name}</p>
                                            </div>
                                        )
                                    }
                                })
                            )
                        })}
                    </div>
                </div>

                <div className="grid gap-1 grid-cols-2 m-1">
                    <button className="bg-green-500 hover:bg-green-600 duration-200 rounded-lg  font-bold p-2" onClick={handlePrint}>Print</button>
                    <button className="bg-red-500 hover:bg-red-600 duration-200 rounded-lg font-bold p-2" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>,
    document.getElementById("portal")
    );
}
 
export default AllStudentsModal;