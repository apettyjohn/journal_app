import React from "react";
import {useLocation} from "react-router-dom";
import {RawDraftContentState} from "draft-js";
import {Button, Card, CardContent, Typography} from "@material-ui/core";
import TextEditor from './Components/DraftJSEditor';

interface location {
    editorState?: RawDraftContentState
}

function Edit () {
    const location = useLocation();
    const editorBlob = location.state as location;

    return(<div className="view">
        <Card style={{margin: "1em"}}>
            <CardContent>
                <Typography variant={"h3"} style={{marginBottom: "0.2em", marginLeft: "0.5em"}}>Date</Typography>
                <TextEditor />
            </CardContent>
        </Card>
        <div style={{display: "flex", flexDirection: "row-reverse", margin: "2em"}}>
            <Button variant="contained" size="large">Save</Button>
            <span style={{width: "2em"}} />
            <Button variant="contained" size="large">Close</Button>
        </div>
    </div>);
}
export default Edit;