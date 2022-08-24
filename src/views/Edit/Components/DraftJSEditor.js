import React, {Component} from "react";
import {convertFromRaw, convertToRaw, EditorState, getDefaultKeyBinding, KeyBindingUtil, RichUtils} from "draft-js";
import Editor from "draft-js-plugins-editor";
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    IconButton,
    List,
    ListItem,
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
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

const {hasCommandModifier} = KeyBindingUtil;
const debug = false;
const buttonGridStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap"
};

export default class TextEditor extends Component {
    convertContentToHTML = () => {
        try {
            document.getElementById("editor-output").textContent =
                JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())) + "\r\n\r\n"
                + document.getElementsByClassName("DraftEditor-root")[0].innerHTML.toString()
                + "\r\n\r\n" + document.getElementById("post-date").textContent;
        } catch (e) {
            console.error(e.name, e.message);
            setTimeout(() => this.convertContentToHTML(), 1000);
        }
    }
    mapHeaderNumber = (header) => {
        if (!header.includes('-')) return header;
        const numbers = ["one","two","three","four","five","six"];
        const number = header.split('-')[1];
        return "h"+(numbers.indexOf(number)+1).toString();
    };
    keyBindingFn = (e) => {
        // console.log(e.key);
        if (e.key === 'h' && hasCommandModifier(e)) {
            return 'highlight';
        }
        return getDefaultKeyBinding(e);
    }
    handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (command === 'highlight') {
            this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT'));
            return 'handled';
        }
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    onChange = editorState => {
        this.setState({editorState: editorState});
        if (debug) this.convertContentToHTML();
    };
    onCheckBoxChange = (e) => {
        const target = e.currentTarget;
        const label = target.dataset.label;
        const index = this.state.settingsMenuButtonNames.indexOf(label)
        let checkedList = [];
        this.state.settingsMenuButtonNames.forEach((name) => checkedList.push(this.state.buttonNames.includes(name)));
        const checked = checkedList[index];
        let subArray = checkedList.slice(0, index);
        let deleted = 0;
        checkedList.slice(0, index).forEach((item, i) => {
            if (!item) subArray.splice(i - deleted, 1);
            deleted += 1;
        });
        const actualIndex = subArray.length;
        let tempButtons = [...this.state.buttons];
        let tempButtonNames = [...this.state.buttonNames];
        // console.log(checkedList,index,checkedList.slice(0,index),subArray,actualIndex,tempButtonNames[actualIndex]);
        if (checked) {
            tempButtons.splice(actualIndex, 1);
            tempButtonNames.splice(actualIndex, 1);
            this.setState({buttons: tempButtons, buttonNames: tempButtonNames});
        } else {
            tempButtons.splice(actualIndex, 0, this.state.settingsMenuButtons[index]);
            tempButtonNames.splice(actualIndex, 0, label);
            this.setState({buttons: tempButtons, buttonNames: tempButtonNames});
        }
    }
    onDragChange = (result) => {
        if (!result.destination) return;
        let destination = result.destination.index;
        let source = result.source.index;
        if (destination !== source) {
            let tempButtons = [...this.state.buttons];
            let tempButtonNames = [...this.state.buttonNames];
            let tempMenuButtons = [...this.state.settingsMenuButtons];
            let tempMenuButtonNames = [...this.state.settingsMenuButtonNames];
            console.log(source, destination);
            [tempMenuButtons, tempMenuButtonNames].forEach((array) => {
                const [reorderedItem] = array.splice(source, 1);
                array.splice(destination, 0, reorderedItem);
            });
            if (tempButtonNames.includes(tempMenuButtonNames[destination])) {
                source = tempButtonNames.indexOf(tempMenuButtonNames[destination]);
                let checked = [];
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
                // console.log(source,destination,tempMenuButtonNames);
                [tempButtons, tempButtonNames].forEach((array) => {
                    const [reorderedItem] = array.splice(source, 1);
                    array.splice(destination, 0, reorderedItem);
                });
            }
            this.setState({
                buttons: tempButtons, buttonNames: tempButtonNames, settingsMenuButtons: tempMenuButtons,
                settingsMenuButtonNames: tempMenuButtonNames
            });
        }
    }

    onUnderlineClick = () => {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
        );
    };
    onBoldClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
    };
    onItalicClick = () => {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
        );
    };
    onStrikeThroughClick = () => {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, "STRIKETHROUGH")
        );
    };
    onHighlight = () => {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, "HIGHLIGHT")
        );
    };
    onToggleCode = () => {
        this.onChange(RichUtils.toggleCode(this.state.editorState));
    };
    onSettingsClick = () => {
        this.setState({showSettingsMenu: !this.state.showSettingsMenu});
    };
    onHeaderTypeClick = (e) => {
        const elem = e.currentTarget;
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, elem.dataset.label));
    };
    onClearFormatting = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unstyled'));
    };
    onToggleQuote = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'blockquote'));
    };
    onUnorderedListClick = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
    };
    onOrderedListClick = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
    };

    styleMap = {
        'HIGHLIGHT': { background: 'yellow' },
        'ALIGN-RIGHT': { textAlign: "right !important" },
        'ALIGN-LEFT': { textAlign: "left" },
        'ALIGN-CENTER': { textAlign: "center" },
        'ALIGN-JUSTIFY': { textAlign: "justify" },
    };
    headings = ['header-one','header-two','header-three','header-four','header-five','header-six'];
    defaultButtons = [{clickFunc: this.onBoldClick, component: <FormatBold/>, alt: "Bold", componentType: "button"},
        {clickFunc: this.onUnderlineClick, component: <FormatUnderlined/>, alt: "Underline", componentType: "button"},
        {clickFunc: this.onItalicClick, component: <FormatItalic/>, alt: "Italic", componentType: "button"},
        {
            clickFunc: this.onStrikeThroughClick,
            component: <FormatStrikethrough/>,
            alt: "Strike through",
            componentType: "button"
        },
        {clickFunc: this.onToggleCode, component: <Code/>, alt: "Code block", componentType: "button"},
        {clickFunc: this.onHighlight, component: <BorderColor/>, alt: "Highlight", componentType: "button"},
        {clickFunc: this.onClearFormatting, component: <FormatClear/>, alt: "Clear Format", componentType: "button"},
        {clickFunc: this.onToggleQuote, component: <FormatQuote/>, alt: "Quote", componentType: "button"},
        {clickFunc: this.onUnorderedListClick, component: <FormatListBulleted/>, alt: "Unordered List", componentType: "button"},
        {clickFunc: this.onOrderedListClick, component: <FormatListNumbered/>, alt: "Ordered List", componentType: "button"},
        // {
        //     clickFunc: ()=>{},
        //     component: <div style={{display: "inline-flex", borderRadius: "1em", alignItems: "center", margin: "5px"}}>
        //         <IconButton className={'edit-submenu-icon'} onClick={() => {this.onChange(
        //                 RichUtils.toggleInlineStyle(this.state.editorState, "ALIGN-LEFT"))}}><FormatAlignLeft />
        //         </IconButton>
        //         <IconButton className={'edit-submenu-icon'} onClick={() => {this.onChange(
        //             RichUtils.toggleInlineStyle(this.state.editorState, "ALIGN-CENTER"))}}><FormatAlignCenter />
        //         </IconButton>
        //         <IconButton className={'edit-submenu-icon'} onClick={() => {this.onChange(
        //             RichUtils.toggleInlineStyle(this.state.editorState, "ALIGN-RIGHT"))}}><FormatAlignRight />
        //         </IconButton>
        //         <IconButton className={'edit-submenu-icon'} onClick={() => {this.onChange(
        //             RichUtils.toggleInlineStyle(this.state.editorState, "ALIGN-JUSTIFY"))}}><FormatAlignJustify />
        //         </IconButton>
        //     </div>,
        //     alt: "Alignment",
        //     componentType: "select"
        // },
        {
            clickFunc: ()=>{},
            component: <div style={{display: "inline-flex", borderRadius: "1em", alignItems: "center", margin: "5px"}}>
                {this.headings.map(
                    (name, i) => <IconButton key={i} className={'edit-submenu-icon'}
                                             onClick={this.onHeaderTypeClick} data-label={name}>
                        {this.mapHeaderNumber(name)}
                    </IconButton>)}
            </div>,
            alt: "Header Type",
            componentType: "select"
        },
        {clickFunc: this.onSettingsClick, component: <Settings/>, alt: "Settings", componentType: "button"}
    ];
    defaultSettingsMenu = ["Bold", "Underline", "Italic", "Strike through", "Code block", "Highlight",
        "Clear Format", "Quote", "Unordered List", "Ordered List", "Header Type"];
    initialState = (this.props.editorBlob) ?
        EditorState.createWithContent(convertFromRaw(this.props.editorBlob.editorState)) :
        EditorState.createEmpty();

    constructor(props) {
        super(props);
        this.state = {
            editorState: this.initialState,
            buttons: this.defaultButtons,
            buttonNames: this.defaultSettingsMenu,
            showSettingsMenu: false,
            settingsMenuButtons: this.defaultButtons,
            settingsMenuButtonNames: this.defaultSettingsMenu
        };
    }

    render() {
        return (
            <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
                <div id="editorContainer"
                     style={{display: "flex", flexDirection: "column", maxWidth: "min(800px,70%)"}}>

                    <Card style={{marginBottom: "1em"}}>
                        <CardContent style={buttonGridStyle}>
                            {this.state.buttons.map((button, i) => {
                                if (button.componentType === "button") {
                                    return <IconButton onClick={button.clickFunc} key={i} className={'edit-icon-btn'}
                                                       style={{transform: "scale(0.9)"}}>{button.component}</IconButton>;
                                } else {
                                    return button.component;
                                }
                            })}
                        </CardContent>
                    </Card>
                    <Card style={{maxWidth: "100%"}}>
                        <CardContent>
                            <Editor
                                editorState={this.state.editorState}
                                onChange={this.onChange}
                                customStyleMap={this.styleMap}
                                keyBindingFn={this.keyBindingFn}
                                handleKeyCommand={this.handleKeyCommand}
                                style={{height: "100%"}}
                            />
                        </CardContent>
                    </Card>
                    {debug ? <Card style={{marginTop: "1em"}}>
                        <CardContent>
                            <div id={'editor-output'} style={{whiteSpace: "pre-line"}}/>
                        </CardContent>
                    </Card> : <div/>}
                    <div style={{display: "flex", justifyContent: "center", margin: "2em"}}>
                        <Button variant="contained" size="large">Close</Button>
                        <span style={{width: "2em"}}/>
                        <Button variant="contained" size="large"
                                disabled={this.state.editorState === this.initialState}>
                            Save</Button>
                    </div>
                </div>
                {this.state.showSettingsMenu ?
                    <Card id={'settings-menu'} style={{marginLeft: "1em", maxWidth: "150px", maxHeight: "400px", overflow: "auto"}}>
                        <DragDropContext onDragEnd={this.onDragChange}>
                            <Droppable droppableId="menu-items">
                                {(provided) => (
                                    <List {...provided.droppableProps} ref={provided.innerRef}>
                                        {this.state.settingsMenuButtonNames.map((button, i) =>
                                            <Draggable key={button} draggableId={button} index={i}>
                                                {(provided) => (
                                                    <ListItem style={{paddingTop: "1px", paddingBottom: "1px"}}
                                                              ref={provided.innerRef}
                                                              {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <IconButton data-label={button}
                                                                    onClick={this.onCheckBoxChange}>
                                                            <Checkbox
                                                                checked={this.state.buttonNames.includes(button)}/>
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
}