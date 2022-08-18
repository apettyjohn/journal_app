import {Button, Card, CardContent, IconButton, Typography} from "@material-ui/core";
import {Add, KeyboardArrowLeft, KeyboardArrowRight, SkipNext, SkipPrevious} from "@material-ui/icons";
import ProfilePic from "./components/ProfilePic";
import {User} from "../objects/user";
import {CSSProperties} from "react";
import Post from "./components/Post";

function Main() {
    const user = {id: 1, name: "Adam Pettyjohn"} as User;
    const files = ["test.json"];
    const topCardStyle: CSSProperties = {
        display: "flex",
        flexGrow: '1',
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    }
    const svgStyle: CSSProperties = {transform: 'scale(1.6)'}

    return (
        <div className="view">
            <div style={{display: "flex", justifyContent: "center", flexGrow: '1'}}>
                <Card style={{maxWidth: '800px', flexGrow: '1'}}>
                    <CardContent style={topCardStyle}>
                        <IconButton aria-label="new-entry" style={svgStyle}><Add/></IconButton>
                        <IconButton aria-label="last-month" style={svgStyle}><SkipPrevious/></IconButton>
                        <IconButton aria-label="yesterday" style={svgStyle}><KeyboardArrowLeft/></IconButton>
                        <Button aria-label="select-date">
                            <Typography variant="h4" style={{textTransform: "none", fontSize: '3em'}}>Jan 1</Typography>
                        </Button>
                        <IconButton aria-label="tomorrow" style={svgStyle}><KeyboardArrowRight/></IconButton>
                        <IconButton aria-label="next-month" style={svgStyle}><SkipNext/></IconButton>
                        <Button aria-label="select-date">
                            <Typography variant="h4" style={{
                                maxWidth: '50px',
                                wordWrap: "break-word",
                                textTransform: "none"
                            }}>2020</Typography>
                        </Button>
                        <IconButton aria-label="next-month"><ProfilePic user={user}/></IconButton>
                    </CardContent>
                </Card>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {files.map((fileName, i) => <Post fileName={fileName} index={i} key={i}></Post>)}
            </div>
        </div>);
}

export default Main;