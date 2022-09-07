import React, {useState, useRef} from "react";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {dbService, storageService} from "../fbase";
import {v4 as uuidv4} from "uuid";
import {addDoc, collection} from "firebase/firestore";

const NweetFactory = ({ userObj })=> {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

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
    );
};
export default NweetFactory;