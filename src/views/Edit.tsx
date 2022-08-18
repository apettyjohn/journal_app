import TextEditor from "./components/TextEditor";
import {Button, Card, CardContent} from "@material-ui/core";
import {useLocation} from "react-router-dom";
import React from "react";
import {RawDraftContentState} from "draft-js";

interface location {
    editorState?: RawDraftContentState
}

function Edit () {
    const location = useLocation();
    const state = location.state as location;

    return(<div className="view">
        <Card>
            <CardContent>
                <TextEditor editorState={(state === null)? undefined: state.editorState}/>
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