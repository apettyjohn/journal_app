import React, {useState} from "react";
import {EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";

function TextEditor() {

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const handleEditorChange = (state: React.SetStateAction<EditorState>) => {
        setEditorState(state);
        // convertContentToHTML();
    }
    // const convertContentToHTML = () => {
    //     document.getElementById("editor-output")!.textContent = document.getElementsByClassName("DraftEditor-root")[0]!.innerHTML.toString();
    // }
    // <div id={"editor-output"} />
    return (
        <div className="Editor">
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
            />
        </div>);
}
export default TextEditor;