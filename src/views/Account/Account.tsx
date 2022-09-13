import {Button, Card, CardActionArea, CardContent, IconButton, TextField, Tooltip, Typography} from "@material-ui/core";
import ColorCircle from "./Components/ColorCircle";
import ProfilePic from "../Login/Components/ProfilePic";
import {ArrowBack, Check, Edit, ExitToApp, Palette} from "@material-ui/icons";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";
import {toggleTheme} from "../../reducers/themeSlice";
import {CSSProperties, useEffect, useState} from "react";
import {updateUser} from "../../reducers/userSlice";
import {User} from "../../objects/user";
import {stringifyDateTime} from "../../objects/dateTime";
import { SliderPicker } from 'react-color';
import {Preference} from "../../objects/preference";

function Account() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const store = useSelector((state: Store) => state);
    const user = store.users.user;
    if (!user) navigate("/main");
    let preferences: Preference = {id: user!.id, theme: "light", accentColor: "#fff", stayLoggedIn: false};
    store.preferences.users.forEach((item) => {
        if (item.id === user!.id) preferences = item;
    });
    const [showSlider, setShowSlider] = useState(false);
    const [accentColor, setAccentColor] = useState<string>(preferences.accentColor);
    const [nameEdit, setNameEdit] = useState(false);
    const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(preferences.stayLoggedIn);
    const [colorCircles, setColorCircles] = useState(["#ff0000", "#ff8c00", "#1e90ff", "#ffd700"]);
    const labels = ["Back", "Logout"];
    const profileInfoStyle: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: '1em',
        paddingBottom: '1em'
    };

    useEffect(() => {if (!user) navigate('/login');});

    function showLabels() {
        const buttons = document.getElementById("account-side-menu")!.getElementsByClassName("MuiButton-label");
        for (let i = 0; i < buttons.length; i++) {
            const label = document.createElement("span");
            label.textContent = labels[i];
            label.style.color = "var(--text)";
            buttons[i].appendChild(label);
        }
    }
    function hideLabels() {
        const buttons = document.getElementById("account-side-menu")!.getElementsByClassName("MuiButton-label");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].lastChild!.remove()
        }
    }


    return (
        <div className="view" style={{display: 'flex', flexDirection: 'row'}}>

            <div style={{display: 'flex', flexDirection: 'column', justifyContent: "center"}}>
                <Card style={{margin: "1em"}}>
                    <CardContent id="account-side-menu" onMouseEnter={showLabels} onMouseLeave={hideLabels}>
                        <div style={{display: "flex", alignItems: "center", marginBottom: '2em'}}>
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate("/main")} fullWidth></Button>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Button startIcon={<ExitToApp/>} onClick={() => navigate("/login")} fullWidth></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', justifyContent: "center", flexGrow: '1'}}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: '1', maxWidth: "800px"}} id={'account-cards'}>
                    <Card style={{overflow: 'visible', margin: "1em"}} id={'account-profile'}>
                        <CardContent style={{
                            display: "flex",
                            flexDirection: "row",
                            flexGrow: '1',
                            marginRight: '2em',
                            marginLeft: '2em'
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                flexDirection: "column",
                                marginRight: '3em'
                            }}>
                                {user ? <ProfilePic size={"large"} user={user}/>: <div/>}
                                <Button style={{marginTop: '1em', marginBottom: '1em'}}>
                                    <span style={{color: "var(--text)"}}>Edit</span></Button>
                                <Button disabled={user && !user.imgSrc} onClick={() => {
                                    const temp = {...user, imgSrc: undefined} as User;
                                    dispatch(updateUser(temp));
                                }}><span style={(user && !user.imgSrc)? {}:{color: "var(--text)"}}>Delete</span></Button>
                            </div>

                            <div style={{display: "flex", justifyContent: "center", flexDirection: "row", flexGrow: '1'}}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    flexDirection: "column"
                                }}>
                                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                        <TextField defaultValue={user? user.name:""} variant="filled"
                                                   style={{textAlign: "center"}} label="Name" disabled={!nameEdit} />
                                        <Tooltip title={nameEdit ? "Confirm" : "Change Name"}><IconButton onClick={() => setNameEdit(!nameEdit)}
                                                       style={{marginLeft: "1em"}}>
                                            {nameEdit ? <Check/> : <Edit/>}
                                        </IconButton></Tooltip>
                                    </div>
                                    <div style={profileInfoStyle}>
                                        <Typography>{`Total Posts:  ${user? user.totalEntries: 0}`}</Typography>
                                    </div>
                                    <div style={profileInfoStyle}>
                                        <Typography>{user? `Joined:  ${stringifyDateTime(user.joinDate)}`: ""}</Typography>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{overflow: 'visible', margin: "1em"}} id={'account-preferences'}>
                        <CardContent style={{marginRight: '1em', marginLeft: '1em'}}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Typography className="systemText" style={{whiteSpace: 'nowrap'}}>System Theme
                                    :</Typography>
                                <Card className="light-mode">
                                    <CardActionArea onClick={() => dispatch(toggleTheme('light'))}>
                                        <CardContent>
                                            <Typography>Light Mode</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                <Card className="dark-mode">
                                    <CardActionArea onClick={() => dispatch(toggleTheme('dark'))}>
                                        <CardContent>
                                            <Typography>Dark Mode</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                marginTop: '2em', marginBottom: '2em'
                            }}>
                                <Typography className="systemText" style={{whiteSpace: 'nowrap'}}>Accent Color :</Typography>
                                <Tooltip title="New Color">
                                    <IconButton aria-label="edit" onClick={() => setShowSlider(!showSlider)}><Palette/></IconButton>
                                </Tooltip>
                                {[accentColor,...colorCircles].map((color, i) =>
                                    <IconButton key={i} data-color={color} onClick={(e) => setAccentColor(e.currentTarget.dataset.color!)}>
                                        <ColorCircle color={color} />
                                    </IconButton>)}
                            </div>
                            {showSlider? <div style={{marginBottom: "2.5em"}}>
                                <SliderPicker color={accentColor} onChangeComplete={(color) => {
                                    let temp = [...colorCircles];
                                    temp.pop();
                                    temp.splice(0,0,accentColor);
                                    setColorCircles(temp);
                                    setAccentColor(color.hex);
                                }}/>
                            </div>: <div />}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingRight: '3em'
                            }}>
                                <Typography className="systemText" style={{whiteSpace: 'nowrap'}}>Stay Logged In :</Typography>
                                <Card style={{width: "100px", textAlign: "center"}}>
                                    <CardActionArea onClick={() => setStayLoggedIn(true)}>
                                        <CardContent style={(stayLoggedIn)? {backgroundColor: "var(--systemText)"}: {}}>
                                            <Typography> Yes </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                <Card style={{width: "100px", textAlign: "center"}}>
                                    <CardActionArea onClick={() => setStayLoggedIn(false)}>
                                        <CardContent style={(!stayLoggedIn)? {backgroundColor: "var(--systemText)"}: {}}>
                                            <Typography> No </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                    <div style={{display: "flex", justifyContent: "flex-end", margin: "1em 4em 3em 0"}}>
                        <Button variant="contained" size="large">Save</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;