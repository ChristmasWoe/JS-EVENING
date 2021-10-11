import React,{useState,useEffect,useCallback} from "react";
import useIsMountedRef from '../../hooks/useIsMountedRef'
import {db,auth} from "../../lib/firebase";
import { collection,getDocs } from "@firebase/firestore";
import {CircularProgress,Container} from "@material-ui/core"
import CreateForm from "./CreateForm"
import { useAuthState } from "react-firebase-hooks/auth";

const CreateView = () => {
    const isMountedRef = useIsMountedRef();
    const [users,setUsers] = useState([]);
    const [user, loading, error] = useAuthState(auth);

    const getUsers = useCallback(
        async () => {
            try {
                if (isMountedRef.current) {
                    const usersRef = await getDocs(collection(db,"users"))
                    let docs = usersRef.docs.map(doc=>({id:doc.id,...doc.data()}))
                    console.log("users",docs)                    
                    setUsers(docs);
                    
                }
            } catch (err) {
                console.error(err)
            }
        },
        [isMountedRef]
    )

    console.log(user)

    useEffect(() => {
        getUsers()
    }, [getUsers])

    if(users.length==0 || loading){
        return <CircularProgress size={48} color="primary" />
    }

    return (
        <Container  maxWidth="lg">
            <CreateForm currentUser={user} users={users}/>
        </Container>
    )

}   

export default CreateView;