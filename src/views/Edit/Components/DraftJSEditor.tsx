import React, {CSSProperties, useState} from "react";
import {
    convertFromRaw,
    convertToRaw, DraftStyleMap,
    EditorState,
    getDefaultKeyBinding,
    KeyBindingUtil,
    RawDraftContentState,
    RichUtils
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    IconButton,
    List,
    ListItem, Modal,
    Typography
} from "@material-ui/core";
import {
    BorderColor,
    Code,
    FormatBold, FormatClear,
    FormatItalic, FormatListBulleted, FormatListNumbered, FormatQuote,
    FormatStrikethrough,
    FormatUnderlined,
    Settings
} from "@material-ui/icons";
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {useNavigate} from "react-router-dom";
import {DateTime} from "../../../objects/dateTime";
import {User} from "../../../objects/user";

const {hasCommandModifier} = KeyBindingUtil;
const debug = false;
interface stateType {
    changed: boolean,
    editorState: EditorState,
    buttons: Array<{ clickFunc: any; component: any; alt: string; componentType: string; }>,
    buttonNames: Array<string>,
    showSettingsMenu: boolean,
    settingsMenuButtons: Array<{ clickFunc: any; component: any; alt: string; componentType: string; }>,
    settingsMenuButtonNames: Array<string>
}
interface propsType {
    editorProps: {
        editorState?: RawDraftContentState,
        html?: Array<string>,
        date?: DateTime,
        user?: User,
        fileName?: string
    }
}


export default function TextEditor (props: propsType) {
    const convertContentToHTML = () => {
        try {
            document.getElementById("editor-output")!.textContent =
                JSON.stringify(convertToRaw(state.editorState.getCurrentContent())) + "\r\n\r\n"
                + document.getElementsByClassName("DraftEditor-root")[0].innerHTML.toString()
                + "\r\n\r\n" + document.getElementById("post-date")!.textContent;
        } catch (e: any) {
            console.error(e.name, e.message);
            setTimeout(() => convertContentToHTML(), 1000);
        }
    };
    const mapHeaderNumber = (header: string) => {
        if (!header.includes('-')) return header;
        const numbers = ["one","two","three","four","five","six"];
        const number = header.split('-')[1];
        return "h"+(numbers.indexOf(number)+1).toString();
    };
    const cacheState = async () => {
        if (!user) return;
        const cacheName = "journal-app-files";
        const cache = await caches.open(cacheName);
        const url = "http://localhost:3000/editorState";
        let output = new Response(JSON.stringify({...props.editorProps,
            editorState: convertToRaw(state.editorState.getCurrentContent()),
            html: document.getElementsByClassName("DraftEditor-root")[0].innerHTML.split('"')}),
            {status: 200, statusText: "ok"});
        await cache.put(url, output);
        state.changed = false;
    };

    const keyBindingFn = (e: React.KeyboardEvent<{}>) => {
        if (e.key === 'h' && hasCommandModifier(e)) {
            return 'highlight';
        }
        return getDefaultKeyBinding(e);
    };
    const handleKeyCommand = (command: string) => {
        const newState = RichUtils.handleKeyCommand(state.editorState, command);
        if (command === 'highlight') {
            onChange(RichUtils.toggleInlineStyle(state.editorState, 'HIGHLIGHT'));
            return 'handled';
        }
        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const onChange = (editorState:EditorState) => {
        if (editorState.getLastChangeType()) {
            setState({...state,...{editorState: editorState, changed: true}});
            if (debug) convertContentToHTML();
        }
    };
    const onCheckBoxChange = (e: { currentTarget: any; }) => {
        const target = e.currentTarget;
        const label = target.dataset.label;
        const index = state.settingsMenuButtonNames.indexOf(label)
        let checkedList: Array<boolean> = [];
        state.settingsMenuButtonNames.forEach((name) => checkedList.push(state.buttonNames.includes(name)));
        const checked = checkedList[index];
        let subArray = checkedList.slice(0, index);
        let deleted = 0;
        checkedList.slice(0, index).forEach((item, i) => {
            if (!item) subArray.splice(i - deleted, 1);
            deleted += 1;
        });
        const actualIndex = subArray.length;
        let tempButtons = [...state.buttons];
        let tempButtonNames = [...state.buttonNames];
        if (checked) {
            tempButtons.splice(actualIndex, 1);
            tempButtonNames.splice(actualIndex, 1);
            setState({...state,...{buttons: tempButtons, buttonNames: tempButtonNames}});
        } else {
            tempButtons.splice(actualIndex, 0, state.settingsMenuButtons[index]);
            tempButtonNames.splice(actualIndex, 0, label);
            setState({...state,...{buttons: tempButtons, buttonNames: tempButtonNames}});
        }
    };
    const onDragChange = (result: DropResult) => {
        if (!result.destination) return;
        let destination = result.destination.index;
        let source = result.source.index;
        if (destination !== source) {
            let tempButtons = [...state.buttons];
            let tempButtonNames = [...state.buttonNames];
            let tempMenuButtons = [...state.settingsMenuButtons];
            let tempMenuButtonNames = [...state.settingsMenuButtonNames];
            let [reorderedItem]:any = tempMenuButtons.splice(source, 1);
            tempMenuButtons.splice(destination, 0, reorderedItem);
            [reorderedItem] = tempMenuButtonNames.splice(source, 1);
            tempMenuButtonNames.splice(destination, 0, reorderedItem);
            if (tempButtonNames.includes(tempMenuButtonNames[destination])) {
                source = tempButtonNames.indexOf(tempMenuButtonNames[destination]);
                let checked: Array<boolean> = [];
                const menuSlice = tempMenuButtonNames.slice(0, destination);
                menuSlice.forEach((item) => checked.push(tempButtonNames.includes(item)));
                let deleted = 0;
                checked.forEach((item, i) => {
                    if (!item) {
                        menuSlice.splice(i - deleted, 1);
                        deleted += 1;
                    }
                });
                destination = menuSlice.length;
                [reorderedItem] = tempButtons.splice(source, 1);
                tempButtons.splice(destination, 0, reorderedItem);
                [reorderedItem] = tempButtonNames.splice(source, 1);
                tempButtonNames.splice(destination, 0, reorderedItem);
            }
            setState({...state,...{buttons: tempButtons, buttonNames: tempButtonNames, settingsMenuButtons: tempMenuButtons,
                settingsMenuButtonNames: tempMenuButtonNames}});
        }
    };

    const onUnderlineClick = () => {
        onChange(
            RichUtils.toggleInlineStyle(state.editorState, "UNDERLINE")
        );
    };
    const onBoldClick = () => {
        onChange(RichUtils.toggleInlineStyle(state.editorState, "BOLD"));
    };
    const onItalicClick = () => {
        onChange(
            RichUtils.toggleInlineStyle(state.editorState, "ITALIC")
        );
    };
    const onStrikeThroughClick = () => {
        onChange(
            RichUtils.toggleInlineStyle(state.editorState, "STRIKETHROUGH")
        );
    };
    const onHighlight = () => {
        onChange(
            RichUtils.toggleInlineStyle(state.editorState, "HIGHLIGHT")
        );
    };
    const onToggleCode = () => {
        onChange(RichUtils.toggleCode(state.editorState));
    };
    const onSettingsClick = () => {
        setState({...state,...{showSettingsMenu: !state.showSettingsMenu}});
    };
    const onHeaderTypeClick = (e: { currentTarget: any; }) => {
        const elem = e.currentTarget;
        onChange(RichUtils.toggleBlockType(state.editorState, elem.dataset.label));
    };
    const onClearFormatting = () => {
        onChange(RichUtils.toggleBlockType(state.editorState, 'unstyled'));
    };
    const onToggleQuote = () => {
        onChange(RichUtils.toggleBlockType(state.editorState, 'blockquote'));
    };
    const onUnorderedListClick = () => {
        onChange(RichUtils.toggleBlockType(state.editorState, 'unordered-list-item'));
    };
    const onOrderedListClick = () => {
        onChange(RichUtils.toggleBlockType(state.editorState, 'ordered-list-item'));
    };

    const buttonGridStyle: CSSProperties = {
        display: "flex",
        justifyContent: "space-evenly",
        flexWrap: "wrap"
    };
    const styleMap: DraftStyleMap = {
        'HIGHLIGHT': { background: 'yellow' },
        'ALIGN-RIGHT': { textAlign: "right" },
        'ALIGN-LEFT': { textAlign: "left" },
        'ALIGN-CENTER': { textAlign: "center" },
        'ALIGN-JUSTIFY': { textAlign: "justify" },
    };
    const headings = ['header-one','header-two','header-three','header-four','header-five','header-six'];
    const defaultButtons = [{clickFunc: onBoldClick, component: <FormatBold/>, alt: "Bold", componentType: "button"},
        {clickFunc: onUnderlineClick, component: <FormatUnderlined/>, alt: "Underline", componentType: "button"},
        {clickFunc: onItalicClick, component: <FormatItalic/>, alt: "Italic", componentType: "button"},
        {
            clickFunc: onStrikeThroughClick,
            component: <FormatStrikethrough/>,
            alt: "Strike through",
            componentType: "button"
        },
        {clickFunc: onToggleCode, component: <Code/>, alt: "Code block", componentType: "button"},
        {clickFunc: onHighlight, component: <BorderColor/>, alt: "Highlight", componentType: "button"},
        {clickFunc: onClearFormatting, component: <FormatClear/>, alt: "Clear Format", componentType: "button"},
        {clickFunc: onToggleQuote, component: <FormatQuote/>, alt: "Quote", componentType: "button"},
        {clickFunc: onUnorderedListClick, component: <FormatListBulleted/>, alt: "Unordered List", componentType: "button"},
        {clickFunc: onOrderedListClick, component: <FormatListNumbered/>, alt: "Ordered List", componentType: "button"},
        // {
        //     clickFunc: ()=>{},
        //     component: <div style={{display: "inline-flex", borderRadius: "1em", alignItems: "center", margin: "5px"}}>
        //         <IconButton className={'edit-submenu-icon'} onClick={() => {onChange(
        //                 RichUtils.toggleInlineStyle(state.editorState, "ALIGN-LEFT"))}}><FormatAlignLeft />
        //         </IconButton>
        //         <IconButton className={'edit-submenu-icon'} onClick={() => {onChange(
        //             RichUtils.toggleInlineStyle(state.editorState, "ALIGN-CENTER"))}}><FormatAlignCenter />
        //         </IconButton>
        //         <IconButton className={'edit-submenu-icon'} onClick={() => {onChange(
        //             RichUtils.toggleInlineStyle(state.editorState, "ALIGN-RIGHT"))}}><FormatAlignRight />
        //         </IconButton>
        //         <IconButton className={'edit-submenu-icon'} onClick={() => {onChange(
        //             RichUtils.toggleInlineStyle(state.editorState, "ALIGN-JUSTIFY"))}}><FormatAlignJustify />
        //         </IconButton>
        //     </div>,
        //     alt: "Alignment",
        //     componentType: "select"
        // },
        {
            clickFunc: null,
            component: (index:number) => <div key={index} style={{display: "inline-flex", borderRadius: "1em", alignItems: "center", margin: "5px"}}>
                {headings.map(
                    (name, i) => <IconButton key={i} className={'edit-submenu-btn'}
                                             onClick={onHeaderTypeClick} data-label={name}>
                        {mapHeaderNumber(name)}
                    </IconButton>)}
            </div>,
            alt: "Header Type",
            componentType: "select"
        },
        {clickFunc: onSettingsClick, component: <Settings/>, alt: "Settings", componentType: "button"}
    ];
    const defaultSettingsMenu = ["Bold", "Underline", "Italic", "Strike through", "Code block", "Highlight",
        "Clear Format", "Quote", "Unordered List", "Ordered List", "Header Type"];
    const initialState = (props.editorProps && props.editorProps.editorState) ?
        EditorState.createWithContent(convertFromRaw(props.editorProps.editorState)) :
        EditorState.createEmpty();
    const user = (props.editorProps && props.editorProps.user)? props.editorProps.user:undefined;

    const [state,setState] = useState<stateType>({
        changed: false,
        editorState: initialState,
        buttons: defaultButtons,
        buttonNames: defaultSettingsMenu,
        showSettingsMenu: false,
        settingsMenuButtons: defaultButtons,
        settingsMenuButtonNames: defaultSettingsMenu
    });

    return (
        <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
            <div id="editorContainer"
                 style={{display: "flex", flexDirection: "column", maxWidth: "min(800px,70%)"}}>

                <Card style={{marginBottom: "1em"}}>
                    <CardContent style={buttonGridStyle}>
                        {state.buttons.map((button, i) => {
                            if (button.componentType === "button") {
                                return <IconButton onClick={button.clickFunc} key={i} className={'edit-icon-btn'}
                                                   style={{transform: "scale(0.9)"}}>{button.component}</IconButton>;
                            } else {
                                return button.component(i);
                            }
                        })}
                    </CardContent>
                </Card>
                <Card style={{maxWidth: "100%"}}>
                    <CardContent style={{height: "100%"}}>
                        <Editor
                            editorState={state.editorState}
                            onChange={onChange}
                            customStyleMap={styleMap}
                            keyBindingFn={keyBindingFn}
                            handleKeyCommand={handleKeyCommand}
                        />
                    </CardContent>
                </Card>
                {debug ? <Card style={{marginTop: "1em"}}>
                    <CardContent>
                        <div id={'editor-output'} style={{whiteSpace: "pre-line"}}/>
                    </CardContent>
                </Card> : <div/>}
                <div style={{display: "flex", margin: "2em"}}>
                    <Delete filename={props.editorProps.fileName} user={props.editorProps.user}/>
                    <span style={{flexGrow: "1"}} />
                    <Close />
                    <span style={{width: "2em"}}/>
                    <Button variant="contained" size="large" className="file-save" id="save-post" onClick={cacheState}
                            disabled={!state.changed && Boolean(props.editorProps.user)}>Save
                    </Button>
                </div>
            </div>
            {state.showSettingsMenu ?
                <Card id={'settings-menu'} style={{marginLeft: "1em", maxWidth: "150px", maxHeight: "400px", overflow: "auto"}}>
                    <DragDropContext onDragEnd={onDragChange}>
                        <Droppable droppableId="menu-items">
                            {(provided) => (
                                <List {...provided.droppableProps} ref={provided.innerRef}>
                                    {state.settingsMenuButtonNames.map((button, i) =>
                                        <Draggable key={button} draggableId={button} index={i}>
                                            {(provided) => (
                                                <ListItem style={{paddingTop: "1px", paddingBottom: "1px"}}
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <IconButton data-label={button}
                                                                onClick={onCheckBoxChange}>
                                                        <Checkbox
                                                            checked={state.buttonNames.includes(button)}/>
                                                    </IconButton>
                                                    <Typography>{button}</Typography>
                                                </ListItem>)}
                                        </Draggable>)}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Card> : <div/>}
        </div>
    );
}

const Close = () => {
    const navigate = useNavigate();
    return (<Button variant="contained" size="large" onClick={() => navigate('/main')}>Close</Button>);
}
const Delete = (props: {filename?: string, user?: User}) => {
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
            {filename: props.filename,
                directory: `${props.user!.name}-${props.user!.id}`,
                user: props.user}),
            {status: 200, statusText: "ok"});
        await cache.put(url, output);
    }

    return (
        <div>
            <Button variant="contained" size="large" onClick={() => setOpen(true)} disabled={!props.filename}>Delete</Button>
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