import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {RawDraftContentState} from "draft-js";
import {Typography} from "@material-ui/core";
import TextEditor from './Components/DraftJSEditor';
import {DateTime, stringifyDateTime} from "../../objects/dateTime";
import {useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";
import {User} from "../../objects/user";

interface location {
    editorState?: RawDraftContentState,
    html?: Array<string>,
    date?: DateTime,
    user?: User,
    fileName?: string
}

export default function Edit() {
    const navigate = useNavigate();
    const store = useSelector((state: Store) => state);
    const today = store.date.today;
    const user = store.users.user;
    useEffect(() => {if (!user) navigate('/login');});
    const location = useLocation();
    let editorBlob = location.state as location;
    if (!editorBlob || !editorBlob.date) editorBlob = {date: today} as location;

    return (
        <div className="view">
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1em"}}>
                <Typography variant={"h3"} style={{marginBottom: "0.2em"}} id={'post-date'}>
                    {stringifyDateTime(editorBlob.date!, false, true)}
                </Typography>
                <TextEditor editorProps={editorBlob}/>
            </div>
        </div>);
}