import {Button, Card, CardActionArea, CardContent, createTheme, ThemeProvider, Typography} from "@material-ui/core";
import {lightGreen, red} from "@material-ui/core/colors";
import {CSSProperties} from "react";
import ProfilePic from "./components/ProfilePic";
import {User} from "../objects/user";

function Login () {
    const theme = createTheme({
        palette: {
            primary: lightGreen,
            secondary: red
        }
    });
    const headCardStyle: CSSProperties = {display: 'flex', flexDirection: "row-reverse"};
    const bodyCardStyle: CSSProperties = {margin: "2rem"}
    const btnStyles: CSSProperties = {textDecoration: 'underline', textUnderlineOffset: '1em'};
    const divStyles: CSSProperties = {
        width: '100%',
        height: '75%',
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "flex-start",
        justifyContent: "center",
        paddingTop: '10%'
    };
    const users: Array<User> = [{id:1}];

    return(<div className="view">
        <ThemeProvider theme={theme}>
            <Card>
                <CardContent style={headCardStyle}>
                    <Button size="large" color="secondary" style={btnStyles}>Delete User</Button>
                    <span style={{width: '1rem'}} />
                    <Button size="large" color="primary" style={btnStyles}>Create User</Button>
                </CardContent>
            </Card>
        </ThemeProvider>
        <div style={divStyles}>{users.map((user) =>
            <Card style={bodyCardStyle}>
                <CardActionArea>
                    <CardContent>
                        <div style={{display: "flex", justifyContent:"center"}}>
                            <ProfilePic user={user} />
                        </div>
                        <span style={{display: "inline-block", height: "1em"}}/>
                        <Typography>{user.name}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        )}
        </div>
    </div>);
}
export default Login;