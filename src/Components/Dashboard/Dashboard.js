import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import { auth, db, logout } from "../../lib/firebase";
import { collection, doc, getDocs,getFirestore,query,where } from "firebase/firestore"; 


function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const history = useHistory();
  
  
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

    if (loading) return;
    if (!user) return history.replace("/");
    fetchUserName();
  }, [user, loading,history]);
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
export default Dashboard;