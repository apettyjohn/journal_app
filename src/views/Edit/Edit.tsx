import React from "react";
import {useLocation} from "react-router-dom";
import {RawDraftContentState} from "draft-js";
import {Typography} from "@material-ui/core";
import TextEditor from './Components/DraftJSEditor';
import {DateTime, stringifyDateTime} from "../../objects/dateTime";
import {useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";

interface location {
    editorState?: RawDraftContentState,
    html?: Array<string>,
    date?: DateTime
}

export default function Edit() {
    const currentDay = useSelector((state: Store) => state.date.selected);
    const location = useLocation();
    const editorBlob = location.state as location;

    return (
        <div className="view">
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1em"}}>
                <Typography variant={"h3"} style={{marginBottom: "0.2em"}} id={'post-date'}>
                    {(editorBlob && editorBlob.date) ? stringifyDateTime(editorBlob.date) : stringifyDateTime(currentDay, false,true)}
                </Typography>
                <TextEditor editorBlob={editorBlob}/>
            </div>
        </div>);
}