import React, {useState} from "react";
import {convertFromRaw, convertToRaw, EditorState, RawDraftContentState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";

function TextEditor(props: {editorState?: RawDraftContentState}) {
    const initialState = (props.editorState === undefined)? EditorState.createEmpty():
        EditorState.createWithContent(convertFromRaw(props.editorState!));
    const [editorState, setEditorState] = useState(initialState)
    const handleEditorChange = (state: React.SetStateAction<EditorState>) => {
        setEditorState(state);
        convertContentToHTML();
    }
    const convertContentToHTML = () => {
        document.getElementById("editor-output")!.textContent =
            JSON.stringify(convertToRaw(editorState.getCurrentContent())) +
            "\n\n" +
            document.getElementsByClassName("DraftEditor-root")[0]!.innerHTML.toString();
    }

    return (
        <div className="Editor">
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
            />
            <div id={"editor-output"} />
        </div>);
}
export default TextEditor;