import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { db } from "../util/firebase-config";
import { useNavigate } from "react-router";

const Login = () => {
  //Forms state
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  //Auth
  const colRef = collection(db, "accounts");
  const navigate = useNavigate();

  async function Auth() { 
    //TODO navigate to correct screen when logged in.

    if (id === "" || password === "") {
      setStatus("Please fill up required fields");
    } else {
      const data = await getDocs(colRef);
      data.docs.map((doc) => {
        if (doc.data().username.toUpperCase() === id.toUpperCase() && doc.data().password === password) {
          localStorage.setItem("account_id", doc.id)
          localStorage.setItem("user_id", doc.data().username);
          localStorage.setItem("user_name", doc.data().name)
          localStorage.setItem("type", doc.data().type);

          if(doc.data().type === 'teacher'){
            navigate("/teacher");
          }else if(doc.data().type === 'student'){
            navigate("/student");
            localStorage.setItem("student_id", doc.data().username);
            localStorage.setItem("student_name", doc.data().name);
          }else if(doc.data().type === 'admin'){
            navigate("/trackeradmin");
          }
          
        } else {
          //Reset fields
          setId("");
          setPassword("");
          setStatus("Incorrect credentials");
        }
      });
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-tl from-blue-100 via-blue-300 to-blue-500">
      <div className="w-2/3 rounded-lg bg-blue-300 p-3 xl:w-2/4">
        <p>{status}</p>
        <form
          id="loginForm"
          className="flex flex-col"
          onSubmit={(e) => e.preventDefault()}
        >
          <p className="font-bold">ID</p>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="w-full"
          />
          <p className="mt-2 font-bold">Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
          <input
            type="submit"
            value="Login"
            className="mt-7 w-3/4 sm:w-1/4 self-center justify-self-center rounded-lg bg-green-500 hover:bg-green-600 duration-200 p-5 font-bold"
            onClick={() => Auth()}
          />
          {/* <button type="submit" className="mt-7 w-1/4 self-center bg-green-300 py-2 px-5 font-bold" onSubmit={console.log('foo')}>
            Login
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
