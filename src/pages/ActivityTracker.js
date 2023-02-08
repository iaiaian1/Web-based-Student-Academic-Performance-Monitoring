import { useState } from "react";
import { useReactToPrint } from 'react-to-print'
import ReactDOM from "react-dom";
import { useRef } from "react";

const ActivityTracker = ({ open, children, onClose, activities, students, accounts }) => {

    //TODO: SEPERATE QUARTERS OR SOMETHING. ALL ACTIVITIES ARE ON THE SAME PAGE REGARDLESS OF QUARTER. MIGHT POSE PROBLEM IF THERES A LOT OF ACTIVITIES.

    const [subject, setSubject] = useState('filipino')
    let componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    if (!open) return null;
    //console.log(activities)

    return ReactDOM.createPortal(
        <>    
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/[.54]">
            <div className="w-5/6 h-2/3 flex flex-col items-center justify-center rounded-lg bg-blue-400 p-5">
                <select className="text-sm w-full p-1" value={subject} onChange={(e) => {setSubject(e.target.value);}}>
                    <option value="filipino">Filipino</option>
                    <option value="english">English</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="ap">Araling Panlipunan</option>
                    <option value="mapeh">MAPEH</option>
                    <option value="science">Science</option>
                    <option value="mtb">MTB</option>
                </select>
                <p className="text-2xl font-bold">Activities</p>
                <div className="overflow-auto bg-white w-full h-full p-1" ref={componentRef}>
                    <p className="font-bold underline">Section: {localStorage.getItem("section")}({localStorage.getItem("section_id")})</p>
                    <p className="font-bold">{subject.toLocaleUpperCase()}</p>
                    <br />
                    
                    <p className="font-bold text-lg">Performance</p>
                    <table className=" border border-black w-full">
                        <thead>
                            <tr className="border border-black">
                                <th className="border border-black p-1 bg-gray-300" key="name">Name</th>
                                {activities.map((activity) => {
                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "performance"){
                                        return(                                        
                                                <th className="border border-black p-1 bg-gray-300" key={activity.id}>{ activity.name }</th>                                     
                                        )
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => {
                                if(students){
                                    if(students.includes(account.username)){
                                        return(
                                            <tr key={account.id}>
                                                <td key={account.id} className="border border-black">{account.name}</td>
                                                {activities.map((activity) => {
                                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "performance"){
                                                        return(                                                   
                                                                <td className="text-center border border-black" key={activity.id}>{activity.scores[account.username] ? activity.scores[account.username] : 0}</td>
                                                                
                                                        )
                                                    }                                      
                                                })}
                                            </tr>
                                        )
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                    <br />

                    <p className="font-bold text-lg pagebreak">Periodical test</p>
                    <table className=" border border-black w-full">
                        <thead>
                            <tr className="border border-black">
                                <th className="border border-black p-1 bg-gray-300" key="name">Name</th>
                                {activities.map((activity) => {
                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "periodical"){
                                        return(                                        
                                                <th className="border border-black p-1 bg-gray-300" key={activity.id}>{ activity.name }</th>                                     
                                        )
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => {
                                if(students){
                                    if(students.includes(account.username)){
                                        return(
                                            <tr key={account.id}>
                                                <td key={account.id} className="border border-black">{account.name}</td>
                                                {activities.map((activity) => {
                                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "periodical"){
                                                        return(                                                   
                                                                <td className="text-center border border-black" key={activity.id}>{activity.scores[account.username] ? activity.scores[account.username] : 0}</td>
                                                                
                                                        )
                                                    }                                      
                                                })}
                                            </tr>
                                        )
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                    <br />

                    <p className="font-bold text-lg pagebreak">Project</p>
                    <table className=" border border-black w-full">
                        <thead>
                            <tr className="border border-black">
                                <th className="border border-black p-1 bg-gray-300" key="name">Name</th>
                                {activities.map((activity) => {
                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "project"){
                                        return(                                        
                                                <th className="border border-black p-1 bg-gray-300" key={activity.id}>{ activity.name }</th>                                     
                                        )
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => {
                                if(students){
                                    if(students.includes(account.username)){
                                        return(
                                            <tr key={account.id}>
                                                <td key={account.id} className="border border-black">{account.name}</td>
                                                {activities.map((activity) => {
                                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "project"){
                                                        return(                                                   
                                                                <td className="text-center border border-black" key={activity.id}>{activity.scores[account.username] ? activity.scores[account.username] : 0}</td>
                                                                
                                                        )
                                                    }                                      
                                                })}
                                            </tr>
                                        )
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                    <br />

                    <p className="font-bold text-lg pagebreak">Recitation</p>
                    <table className=" border border-black w-full">
                        <thead>
                            <tr className="border border-black">
                                <th className="border border-black p-1 bg-gray-300" key="name">Name</th>
                                {activities.map((activity) => {
                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "recitation"){
                                        return(                                        
                                                <th className="border border-black p-1 bg-gray-300" key={activity.id}>{ activity.name }</th>                                     
                                        )
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => {
                                if(students){
                                    if(students.includes(account.username)){
                                        return(
                                            <tr key={account.id}>
                                                <td key={account.id} className="border border-black">{account.name}</td>
                                                {activities.map((activity) => {
                                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "recitation"){
                                                        return(                                                   
                                                                <td className="text-center border border-black" key={activity.id}>{activity.scores[account.username] ? activity.scores[account.username] : 0}</td>
                                                                
                                                        )
                                                    }                                      
                                                })}
                                            </tr>
                                        )
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                    <br />

                    <p className="font-bold text-lg pagebreak">Summative test</p>
                    <table className=" border border-black w-full">
                        <thead>
                            <tr className="border border-black">
                                <th className="border border-black p-1 bg-gray-300" key="name">Name</th>
                                {activities.map((activity) => {
                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "summative"){
                                        return(                                        
                                                <th className="border border-black p-1 bg-gray-300" key={activity.id}>{ activity.name }</th>                                     
                                        )
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => {
                                if(students){
                                    if(students.includes(account.username)){
                                        return(
                                            <tr key={account.id}>
                                                <td key={account.id} className="border border-black">{account.name}</td>
                                                {activities.map((activity) => {
                                                    if(activity.section === localStorage.getItem("section_id") && activity.subject === subject && activity.type === "summative"){
                                                        return(                                                   
                                                                <td className="text-center border border-black" key={activity.id}>{activity.scores[account.username] ? activity.scores[account.username] : 0}</td>
                                                                
                                                        )
                                                    }                                      
                                                })}
                                            </tr>
                                        )
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="grid gap-2 grid-cols-2 m-1">
                    <button className="bg-green-500 rounded-lg font-bold p-2" onClick={handlePrint}>PRINT</button>
                    <button className="bg-red-500 rounded-lg font-bold p-2" onClick={onClose}>CLOSE</button>
                </div>
            </div>
        </div>
        </>,
    document.getElementById("portal")
    );
}
 
export default ActivityTracker;