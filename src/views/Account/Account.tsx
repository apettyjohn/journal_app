import {Button, Card, CardActionArea, CardContent, IconButton, TextField, Typography} from "@material-ui/core";
import ColorCircle from "./Components/ColorCircle";
import ProfilePic from "../Login/Components/ProfilePic";
import {ArrowBack, Check, Edit, ExitToApp, Palette, Person, Tune} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";
import {toggleTheme} from "../../reducers/themeSlice";
import {useState} from "react";
import {updateUser} from "../../reducers/userSlice";
import {User} from "../../objects/user";
import {stringifyDateTime} from "../../objects/dateTime";

function Account() {
    const dispatch = useDispatch();
    const store = useSelector((state: Store) => state);
    const [nameEdit, setNameEdit] = useState(false);
    const defaultColors = ["red", "orange", "yellow", "green", "lightBlue"];
    const labels = ["Back", "Profile", "Preferences", "Logout"];
    const user = store.users.user;
    const scrollToProfile = () => {
        const elem = document.getElementById('account-cards');
        if (elem) elem.scrollIntoView();
    }
    const scrollToPreferences = () => {
        const elem = document.getElementById('account-preferences');
        if (elem) elem.scrollIntoView();
    }

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
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: '2em'}}>
                            <Link to="/main"><Button startIcon={<ArrowBack/>} fullWidth></Button></Link>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: '2em'}}>
                            <Button startIcon={<Person/>} fullWidth onClick={scrollToProfile}></Button>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: '2em'}}>
                            <Button startIcon={<Tune/>} fullWidth onClick={scrollToPreferences}></Button>
                        </div>
                        <div style={{display: "state={\"profile\"}flex", flexDirection: "row", alignItems: "center"}}>
                            <Link to="/login"><Button startIcon={<ExitToApp/>} fullWidth></Button></Link>
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
                                <Button className="systemText"
                                        style={{marginTop: '1em', marginBottom: '1em'}}>Edit</Button>
                                <Button className="systemText" onClick={() => {
                                    const temp = {...user, imgSrc: undefined} as User;
                                    dispatch(updateUser(temp));
                                }}>Delete</Button>
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
                                        <IconButton onClick={() => setNameEdit(!nameEdit)} style={{marginLeft: "1em"}}>
                                            {nameEdit? <Check />:<Edit/>}
                                        </IconButton>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingTop: '1em',
                                        paddingBottom: '1em'
                                    }}>
                                        <Typography>{`Total Posts:  ${user? user.totalEntries: 0}`}</Typography>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingTop: '1em',
                                        paddingBottom: '1em'
                                    }}>
                                        <Typography>{user? `Joined:  ${stringifyDateTime(user.joinDate)}`: ""}</Typography>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{overflow: 'visible', margin: "1em"}} id={'account-preferences'}>
                        <CardContent style={{marginRight: '2em', marginLeft: '2em'}}>
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
                                <Typography className="systemText" style={{whiteSpace: 'nowrap'}}>Accent Color
                                    :</Typography>
                                {defaultColors.map((color, i) =>
                                    <IconButton key={i}><ColorCircle color={color}></ColorCircle></IconButton>
                                )}
                                <IconButton aria-label="edit">
                                    <Palette />
                                </IconButton>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingRight: '3em'
                            }}>
                                <Typography className="systemText" style={{whiteSpace: 'nowrap'}}>Stay Logged In
                                    :</Typography>
                                <Card>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography> Yes </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                <Card>
                                    <CardActionArea>
                                        <CardContent>
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