import React, {useEffect, useState} from "react";
import {authService, dbService} from "fbase";
import {useHistory} from "react-router-dom";
import { collection, getDocs, query, where, orderBy  } from "firebase/firestore";
import { updateProfile } from "firebase/auth";


export default ({refreshUser, userObj})=> {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }
    const onChange = (event)=> {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }
    const getMyNweets = async ()=>{
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });

        /*const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .get();
        console.log(nweets.docs.map(doc =>doc.data()));*/
    }
    useEffect(()=>{
        getMyNweets();
    })
    const onSubmit = async (event) =>{
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, {
                displayName: newDisplayName
            });
            refreshUser();
            /*await userObj.updateProfile({
                displayName: newDisplayName,
            });*/
        }
    }
    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName}/>
                <input type="submit" value="Update Profile" />
            </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};
/*import { getAuth, signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom";


const Profile = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const onLogOutClick = () => {
        signOut(auth);
        navigate("/", { replace: true });
    };
    return (
        <>
            Log Out
        </>
    );
};

export default Profile;*/
