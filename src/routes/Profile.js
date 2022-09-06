import React from "react";
import {authService} from "fbase";
import {useHistory} from "react-router-dom";


export default ()=> {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }
    return (
        <>
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
