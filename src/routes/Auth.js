import React, {useState} from "react";
import {authService} from "fbase";
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup,} from "firebase/auth";
import AuthForm from "../components/AuthForm";

const Auth = () => {




    const onSocialClick = async (event) =>{
        const {
            target:{name},
        } = event;
        let provider;
        try {
            console.log(name)
            if (name === 'google') {
                provider = new GoogleAuthProvider();
                const result = await signInWithPopup(authService, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
            } else if (name === 'github') {
                provider = new GithubAuthProvider();
                const result = await signInWithPopup(authService, provider);
                const credential = GithubAuthProvider.credentialFromResult(result);

            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
    <div>
        <AuthForm />
        <div>
            <button name="google" onClick={onSocialClick}>Continue with Google</button>
            <button name="github" onClick={onSocialClick}>Continue with Github</button>
        </div>
    </div>
    );
}
export default Auth;