import {Button, Card, CardActionArea, CardContent, Typography} from "@material-ui/core";
import {CSSProperties} from "react";
import ProfilePic from "./Components/ProfilePic";
import {User} from "../../objects/user";
import {useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";

function Login () {
    const headCardStyle: CSSProperties = {display: 'flex', flexDirection: "row-reverse"};
    const bodyCardStyle: CSSProperties = {maxWidth: '20%', textAlign: "center"}
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
    const users: Array<User> = [{id: 1, name: "Adam Pettyjohn"} as User];

    return(<div className="view">
        <div style={{display: "flex", justifyContent: "center", flexGrow: '1'}}>
            <Card style={{maxWidth: '800px', flexGrow: '1'}}>
                <CardContent style={headCardStyle}>
                        <Button size="large" className="delete">Delete User</Button>
                        <span style={{width: '1rem'}} />
                        <Button size="large" className="create">Create User</Button>
                </CardContent>
            </Card>
        </div>
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