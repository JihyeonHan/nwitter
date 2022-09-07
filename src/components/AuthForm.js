import React, {useState} from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {authService} from "../fbase";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onSubmit = async (event) =>{
        event.preventDefault();

        try {
            let data;
            if (newAccount) {
                data = await createUserWithEmailAndPassword(
                    authService, email, password
                );
            } else {
                data = await signInWithEmailAndPassword(
                    authService, email, password
                );
            }
            console.log(data);
        } catch(error){
            setError(error.message);
        }

    }

    const onChange = (event) => {
        const {target:{name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password" ){
            setPassword(value);
        }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="email" name="email" placeholder="Email" required value={email} onChange={onChange}/>
                <input type="password" name="password" placeholder="Password" required value={password}
                       onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account" : "Log In"}/>
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account"}</span>
        </>
    )
};
export default AuthForm;