import React, {useEffect, useState, useRef} from "react";
import {v4 as uuidv4} from 'uuid';
import {dbService, storageService} from "../fbase";
import {addDoc, collection, onSnapshot} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Nweet from "../components/Nweet";

const Home = ({userObj})=> {
    console.log(userObj);
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets]=useState([]);
    const [attachment, setAttachment] = useState("");
    /*const getNweets = async ()=>{
        const dbNweets = await getDocs(collection(dbService, "nweets"));
        dbNweets.forEach((document) => {
            const nweetObject = {
                ...document.data(),
                id: document.id,
            }
           setNweets((prev) => [nweetObject, ...prev]);
        });
    }*/
    useEffect(()=>{
       // getNweets();
        /*dbService.collection("nweeets").onSnapshot((snapshot) =>{*/
        onSnapshot(collection(dbService, "nweets"), (snapshot) => {
            const nweetArray = snapshot.docs.map(
                doc => (
                    {
                        id:doc.id,
                        ...doc.data(),
                    }
                    )
            );
            setNweets(nweetArray);
        })
    },[]);
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const nweetObj = {
            text: nweet,
            creatorId:userObj.uid,
            createdAt: Date.now(),
            attachmentUrl
        };
        await addDoc(collection(dbService, "nweets"), nweetObj);
        setNweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const {
            target : { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget : { result },
            } = finishedEvent;
            console.log(finishedEvent);
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const fileInput = useRef();
    const onClearAttachment =() => {
        setAttachment(null);
        fileInput.current.value = null;
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
                <input type="submit" value="Nweet" />
                { attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {nweets.map( (nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                    ))}
            </div>
        </div>
    );
};
export default Home;