import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import { auth, db, logout } from "../../lib/firebase";
import { collection, doc, getDocs,getFirestore,query,where } from "firebase/firestore"; 
import Header from "../Header/Header"
import ListView from "../List/List"

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const history = useHistory();
  const [tasks,setTasks] = useState([]);
  const [users,setUsers] = useState([]);

  useEffect(() => {
    const fetchUserName = async () => {
        try {
          const q = await getDocs(query(collection(db,"users"),where("uid", "==", user?.uid)))
          const data = await q.docs[0].data();
          setName(data.name);
        } catch (err) {
          console.error(err);
          alert("An error occured while fetching user data");
        }
      };
    const getTasks = async () => {
      const ref = await getDocs(collection(db,"tasks"));
      const docs = ref.docs.map(d=>({id:d.id,...d.data()}));
      setTasks(docs)
    }

    const getUsers = async () => {
      const usersRef = await getDocs(collection(db,"users"))
      let docs = usersRef.docs.map(doc=>({id:doc.id,...doc.data()}))
      setUsers(docs)
    }

    if (loading) return;
    if (!user) return history.replace("/");
    fetchUserName();
    getUsers();
    getTasks();
    
  }, [user, loading,history]);

  return (
    <div className="dashboard">
      <Header user={user&&user.email?({...user,displayName:name}):{}} />
      {tasks.length>0&& users.length>0 &&
      <ListView tasks={tasks} users={users} />}
      {/* <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div> */}
    </div>
  );
}
export default Dashboard;