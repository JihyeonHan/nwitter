import React, {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";


function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null)
    useEffect(()=>{
        onAuthStateChanged(authService, (user) => {
           if(user){
              // setIsLoggedIn(true);
               // setUserObj(user);
               setUserObj({
                   displayName : user.displayName,
                   uid:user.uid,
                   updateProfile:(args) => updateProfile(user,{displayName:user.displayName}),
               });
           }else{
               setUserObj(null);
           }
           setInit(true);
        } )
    }, []);

    const refreshUser = ()=>{
        const user = authService.currentUser;
        setUserObj({
            displayName : user.displayName,
            uid:user.uid,
            updateProfile:(args) => updateProfile(user,{displayName:user.displayName}),
        });
    }
    return (
        <>
            {/*{init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />: "Initializing.."}*/}
            {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />: "Initializing.."}
            {/*<footer>@copy {new Date().getFullYear()} Nwitter</footer>*/}
        </>
    )
}

export default App;
