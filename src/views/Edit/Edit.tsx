import React from "react";
import {useLocation} from "react-router-dom";
import {Typography} from "@material-ui/core";
import TextEditor from './Components/DraftJSEditor';
import {useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";
import {EditorProps} from "../../objects/editorProps";
import {stringifyDateTime} from "../../objects/dateTime";

export default function Edit() {
    const store = useSelector((state: Store) => state);
    const location = useLocation();
    let editorBlob = location.state as EditorProps;
    if (!editorBlob) editorBlob = {date: store.date.today} as EditorProps;
    if (!editorBlob.date) editorBlob = {...editorBlob,...{date: store.date.today}};

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