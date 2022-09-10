import React, {CSSProperties, useCallback, useEffect, useState} from "react";
import {
    convertFromRaw,
    convertToRaw,
    EditorState
} from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    Box,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    Modal,
    Typography
} from "@material-ui/core";
import {Settings} from "@material-ui/icons";
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {useNavigate} from "react-router-dom";
import {User} from "../../../objects/user";
import {EditorProps} from "../../../objects/editorProps";

const debug = false;

export default function TextEditor(props: { editorProps: EditorProps }) {
    const SettingsButton = () => {
        const navigate = useNavigate();
        function clickFunc () {
            setSettingsMenu(!settingsMenu);
        }
        function onDragChange(result: DropResult) {
            if (!result.destination) return;
            let destination = result.destination.index;
            let source = result.source.index;
            if (destination !== source) {
                let tempOptions = [...toolbarOptions];
                let [reorderedItem] = tempOptions.splice(source, 1);
                tempOptions.splice(destination, 0, reorderedItem);
                navigate('/blank',{state:{route:"/edit",editorProps: {...props.editorProps,
                            ...{editorState: convertToRaw(editorState.getCurrentContent()), toolbarOptions: tempOptions}}}});
            }
        }

        return(<div id="settings-wrapper">
            <div onClick={clickFunc} className={`rdw-option-wrapper ${settingsMenu? "rdw-option-active":""}`} title="Settings">
                <Settings/>
            </div>
            {settingsMenu ?
                <div id={'settings-menu'} style={{maxHeight: "250px", overflow: "auto", position: "absolute", zIndex: "10",
                    border: "1px solid", boxShadow: "0 2px 1px 0", color: "var(--shadow)", borderRadius: "15px"}}>
                    <DragDropContext onDragEnd={onDragChange}>
                        <Droppable droppableId="menu-items">
                            {(provided) => (
                                <List {...provided.droppableProps} ref={provided.innerRef}>
                                    {toolbarOptions.map((button, i) =>
                                        <Draggable key={button} draggableId={button} index={i}>
                                            {(provided) => (
                                                <ListItem style={{paddingTop: "1px", paddingBottom: "1px"}}
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <Typography>{button}</Typography>
                                                </ListItem>)}
                                        </Draggable>)}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div> : <div/>}
        </div>);
    }

    const defaultOptions = ['Inline', 'Font Size','BlockType', 'Font Family', 'List', 'Text Align', 'Color Picker', 'Link', 'Embedded', 'Emoji', 'Image', 'Remove', 'History'];
    const initialState = (props.editorProps && props.editorProps.editorState) ?
        EditorState.createWithContent(convertFromRaw(props.editorProps.editorState)) : EditorState.createEmpty();
    const user = (props.editorProps && props.editorProps.user) ? props.editorProps.user : undefined;
    const [toolbarOptions] = useState<Array<string>>(props.editorProps.toolbarOptions? props.editorProps.toolbarOptions: defaultOptions);
    const [changed, setChanged] = useState(!!props.editorProps.changed);
    const [settingsMenu, setSettingsMenu] = useState(!!props.editorProps.toolbarOptions);
    const [editorState, setEditorState] = useState<EditorState>(initialState);
    const convertContentToHTML = useCallback(() => {
        try {
            document.getElementById("editor-output")!.textContent =
                JSON.stringify(convertToRaw(editorState.getCurrentContent())) + "\r\n\r\n"
                + document.getElementsByClassName("DraftEditor-root")[0].innerHTML.toString()
                + "\r\n\r\n" + props.editorProps.html!.join('"')
                + "\r\n\r\n" + String(props.editorProps.html!.join('"') === document.getElementsByClassName("DraftEditor-root")[0].innerHTML.toString());
        } catch (e: any) {
            console.error(e.name, e.message);
            setTimeout(() => convertContentToHTML(), 1000);
        }
    },[editorState, props.editorProps.html]);

    useEffect(() => {
        if (debug) convertContentToHTML();
        if (!changed) {
            const currentState = convertToRaw(editorState.getCurrentContent());
            if (!props.editorProps.html) {
                if (!(currentState.blocks.length === 1 && currentState.blocks[0].text === "")) setChanged(true);
            } else {
                const html = document.getElementsByClassName("DraftEditor-root")[0].innerHTML.toString();
                if (removeEditorKeyFromHtml(props.editorProps.html.join('"')) !== removeEditorKeyFromHtml(html)) setChanged(true);
            }
        }
    }, [convertContentToHTML, changed, editorState, props.editorProps.html]);

    async function cacheState() {
        if (!user) return;
        const cacheName = "journal-app-files";
        const cache = await caches.open(cacheName);
        const url = "http://localhost:3000/editorState";
        const file = document.getElementById("editor")!.dataset.file;
        let output = new Response(JSON.stringify({
                ...props.editorProps,
                ...{editorState: convertToRaw(editorState.getCurrentContent()),
                    html: document.getElementsByClassName("DraftEditor-root")[0].innerHTML.split('"'),
                    fileName: file? file: undefined}}),
            {status: 200, statusText: "ok"});
        await cache.put(url, output);
        setChanged(false);
    }

    function cleanToolbarOptions() {
        const out: Array<string> = [];
        toolbarOptions.forEach((option) => {
            option = option.replace(" ","");
            option = option.slice(0,1).toLowerCase() + option.slice(1,option.length);
            out.push(option)
        });
        return out;
    }

    function removeEditorKeyFromHtml(html: string): string {
        let output = "";
        let i = 0;
        while (i < html.length) {
            let j = html.slice(i,html.length).indexOf('data-editor="');
            if (j > 0) {
                output += html.slice(i,j);
                i = j + 19;
            } else {
                output += html.slice(i,html.length);
                i = html.length;
            }
        }
        return output;
    }

    return (
        <div style={{display: "flex", width: "100%", justifyContent: "center"}} onClick={(e: any) => {
            if (settingsMenu) {
                const settings = document.getElementById("settings-wrapper")!.getElementsByTagName("*");
                for (let i=0;i<settings.length;i++){
                    if (settings[i] === e.target) return;
                }
                setSettingsMenu(false);
            }
        }} id="editor" data-file={props.editorProps.fileName? props.editorProps.fileName: ""}>
            <div id="editorContainer" style={{display: "flex", flexDirection: "column", maxWidth: "min(800px,70%)"}}>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    spellCheck={true}
                    toolbarClassName={"edit-toolbar"}
                    editorClassName={"edit-editor"}
                    toolbarCustomButtons={[<SettingsButton />]}
                    toolbar={{options:cleanToolbarOptions()}}
                />

                {debug ? <Card style={{marginTop: "1em"}}>
                    <CardContent>
                        <div id={'editor-output'} style={{whiteSpace: "pre-line"}}/>
                    </CardContent>
                </Card> : <div/>}

                <div style={{display: "flex", margin: "2em"}}>
                    <Delete fileName={props.editorProps.fileName} user={props.editorProps.user}/>
                    <span style={{flexGrow: "1"}}/>
                    <Close/>
                    <Button variant="contained" size="large" className="file-save" id="save-post" onClick={cacheState}
                            disabled={!changed && !props.editorProps.user} style={{marginLeft: "2em"}}>Save
                    </Button>
                </div>
            </div>
        </div>
    );
}

const Close = () => {
    const navigate = useNavigate();
    return (<Button variant="contained" size="large" onClick={() => navigate('/main')}>Close</Button>);
}
const Delete = (props: { fileName?: string, user?: User }) => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const boxStyle: CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid',
        outline: '0',
        borderRadius: '2em',
        padding: '1em'
    };

    function handleClose() {
        setOpen(false);
    }

    async function cachePostToDelete() {
        const cacheName = "journal-app-files";
        const cache = await caches.open(cacheName);
        const url = "http://localhost:3000/deletePost";
        let output = new Response(JSON.stringify(
                {
                    filename: props.fileName!,
                    directory: `${props.user!.name}-${props.user!.id}`,
                    user: props.user!
                }),
            {status: 200, statusText: "ok"});
        await cache.put(url, output);
    }

    return (
        <div>
            <Button variant="contained" size="large" onClick={() => setOpen(true)}
                    disabled={!props.fileName || !props.user}>Delete</Button>
            <Modal open={open} onClose={handleClose}>
                <Box style={boxStyle}>
                    <Typography variant="h5" style={{textAlign: "center"}}>Are you sure you want to delete?</Typography>
                    <div style={{display: 'flex'}}>
                        <Button onClick={handleClose} variant="contained" style={{width: "50%"}}>Close</Button>

                        <Button variant="contained" className="file-save" id="delete-post" color="secondary"
                                onClick={async () => {
                                    if (!Boolean(props.user)) return;
                                    await cachePostToDelete();
                                    navigate('/main');
                                }} style={{width: "50%"}}>Delete
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>);
}