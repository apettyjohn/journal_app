import React, {useState} from "react";
import {EditorState} from "draft-js";
import {convertToHTML} from "draft-convert";
import {Editor} from "react-draft-wysiwyg";

function TextEditor() {

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const  [, setConvertedContent] = useState(null);
    const handleEditorChange = (state: React.SetStateAction<EditorState>) => {
        setEditorState(state);
        convertContentToHTML();
    }
    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        // @ts-ignore
        setConvertedContent(currentContentAsHTML);
    }
    return (
        <div className="Editor">
            <header className="App-header">
                Rich Text Editor Example
            </header>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
            />
        </div>);
}
export default TextEditor;