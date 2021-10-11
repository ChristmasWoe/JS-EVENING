import React,{useState,useEffect,useCallback} from "react";
import useIsMountedRef from '../../hooks/useIsMountedRef'
import {db,auth} from "../../lib/firebase";
import { collection,getDocs,getDoc,doc } from "@firebase/firestore";
import {CircularProgress,Container} from "@material-ui/core"
// import CreateForm from "./CreateForm"
import EditForm from "./EditForm";
import { useAuthState } from "react-firebase-hooks/auth";
import {useParams} from "react-router-dom"

const EditView = () => {
    const {taskId} = useParams()
    const [users,setUsers] = useState([]);
    const [user, loading, error] = useAuthState(auth);
    const [task,setTask] = useState(null);
    const isMountedRef = useIsMountedRef();

    const getUsers = useCallback(
        async () => {
            try {
                if (isMountedRef.current) {
                    const usersRef = await getDocs(collection(db,"users"))
                    let docs = usersRef.docs.map(doc=>({id:doc.id,...doc.data()}))
                    setUsers(docs);
                    const docRef = doc(db, "tasks", taskId);
                    const docSnap = await getDoc(docRef);
                    setTask({id:taskId,...docSnap.data()})
                }
            } catch (err) {
                console.error(err)
            }
        },
        [isMountedRef]
    )

    useEffect(() => {
        getUsers()
    }, [getUsers])

    if(users.length==0 || loading|| task==null){
        return <CircularProgress size={48} color="primary" />
    }

    return (
        <Container  maxWidth="lg">
            <EditForm currentUser={user} users={users} task={task} />
            {/* <CreateForm currentUser={user} users={users}/> */}
        </Container>
    )

}   

export default EditView;