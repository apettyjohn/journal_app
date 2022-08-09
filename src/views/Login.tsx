import {Button, Card, CardActionArea, CardContent, createTheme, ThemeProvider, Typography} from "@material-ui/core";
import {lightGreen, red} from "@material-ui/core/colors";
import {CSSProperties} from "react";
import ProfilePic from "./components/ProfilePic";
import {User} from "../objects/user";
import {useSelector} from "react-redux";
import {Store} from "../reduxStore";

function Login () {
    const btnTheme = createTheme({
        palette: {
            primary: lightGreen,
            secondary: red
        }
    });
    const headCardStyle: CSSProperties = {display: 'flex', flexDirection: "row-reverse"};
    const bodyCardStyle: CSSProperties = {maxWidth: '20%', textAlign: "center"}
    const btnStyles: CSSProperties = {textDecoration: 'underline', textUnderlineOffset: '1em'};
    const divStyles: CSSProperties = {
        width: '100%',
        height: '65%',
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "flex-start",
        justifyContent: "center",
        paddingTop: '10%',
    };
    const users: Array<User> = useSelector((state: Store) => state.user.users);

    return(<div className="view">
        <Card>
            <CardContent style={headCardStyle}>
                <ThemeProvider theme={btnTheme}>
                    <Button size="large" color="secondary" style={btnStyles}>Delete User</Button>
                    <span style={{width: '1rem'}} />
                    <Button size="large" color="primary" style={btnStyles}>Create User</Button>
                </ThemeProvider>
            </CardContent>
        </Card>
        <div style={divStyles}>{users.map((user,i) =>
            <Card style={bodyCardStyle} key={i}>
                <CardActionArea>
                    <CardContent key={i}>
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