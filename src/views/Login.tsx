import {Button, Card, CardActionArea, CardContent, Typography} from "@material-ui/core";
import {CSSProperties} from "react";
import ProfilePic from "./components/ProfilePic";
import {User} from "../objects/user";
import {useSelector} from "react-redux";
import {Store} from "../reduxStore";

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
    const users: Array<User> = useSelector((state: Store) => state.user.users);

    return(<div className="view">
        <Card>
            <CardContent style={headCardStyle}>
                    <Button size="large" className="delete">Delete User</Button>
                    <span style={{width: '1rem'}} />
                    <Button size="large" className="create">Create User</Button>
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