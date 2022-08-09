import {Card, CardActionArea, CardContent, Typography} from "@material-ui/core";
import ProfilePic from "./components/ProfilePic";
import {useSelector} from "react-redux";
import {Store} from "../reduxStore";

function Account () {
    const user = useSelector((state: Store) => state.user.user)!;

    return(
        <div className="view">
            <div>
                <Card>
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
            </div>
        </div>
    );
}
export default Account;