import {Button, Card, CardActionArea, CardContent, IconButton, Typography} from "@material-ui/core";
import ColorCircle from "./components/ColorCircle";
import ProfilePic from "./components/ProfilePic";
import {User} from "../objects/user";
import {ArrowBack, Edit, ExitToApp, Palette, Person, Tune} from "@material-ui/icons";

function Account() {
    const defaultColors = ["red", "orange", "yellow", "green", "lightBlue"];
    const labels = ["Back", "Profile", "Preferences", "Logout"];
    const user = {id: 1, name: "Adam Pettyjohn"} as User;

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
                <Card>
                    <CardContent id="account-side-menu" onMouseEnter={showLabels} onMouseLeave={hideLabels}>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: '2em'}}>
                            <Button startIcon={<ArrowBack/>} fullWidth></Button>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: '2em'}}>
                            <Button startIcon={<Person/>} fullWidth></Button>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: '2em'}}>
                            <Button startIcon={<Tune/>} fullWidth></Button>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <Button startIcon={<ExitToApp/>} fullWidth></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', justifyContent: "center", flexGrow: '1'}}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: '1', maxWidth: "800px"}}>
                    <Card style={{overflow: 'visible'}}>
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
                                <ProfilePic size={"large"} user={user}/>
                                <Button className="systemText"
                                        style={{marginTop: '1em', marginBottom: '1em'}}>Edit</Button>
                                <Button className="systemText">Delete</Button>
                            </div>

                            <div style={{display: "flex", justifyContent: "center", flexDirection: "row", flexGrow: '1'}}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    flexDirection: "column"
                                }}>
                                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                        <Typography style={{whiteSpace: 'nowrap'}}>Name :</Typography>
                                        <Typography
                                            style={{marginLeft: '2em', marginRight: '2em'}}>{user.name}</Typography>
                                        <IconButton aria-label="edit">
                                            <Edit/>
                                        </IconButton>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingTop: '1em',
                                        paddingBottom: '1em'
                                    }}>
                                        <Typography>234 Posts</Typography>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingTop: '1em',
                                        paddingBottom: '1em'
                                    }}>
                                        <Typography>Joined May 6, 1987</Typography>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{overflow: 'visible'}}>
                        <CardContent style={{marginRight: '2em', marginLeft: '2em'}}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Typography className="systemText" style={{whiteSpace: 'nowrap'}}>System Theme
                                    :</Typography>
                                <Card className="light-mode">
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography>Light Mode</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                <Card className="dark-mode">
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography>Dark Mode</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                marginTop: '1em', marginBottom: '1em'
                            }}>
                                <Typography className="systemText" style={{whiteSpace: 'nowrap'}}>Accent Color
                                    :</Typography>
                                {defaultColors.map((color, i) =>
                                    <ColorCircle color={color} key={i}></ColorCircle>
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
                </div>
            </div>
        </div>
    );
}

export default Account;