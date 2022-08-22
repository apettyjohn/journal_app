import {Button, Card, CardContent, IconButton, Popper, Typography} from "@material-ui/core";
import {Add, Clear, KeyboardArrowLeft, KeyboardArrowRight, SkipNext, SkipPrevious} from "@material-ui/icons";
import ProfilePic from "../Login/Components/ProfilePic";
import * as React from "react";
import Post from "./Components/Post";
import {useDispatch, useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";
import {NewPostPopper, ProfilePopper, SelectDayPopper, SelectYearPopper} from "./Components/Menus";
import {User} from "../../objects/user";
import {backDay, backMonth, forwardDay, forwardMonth, select} from "../../reducers/dateSlice";

function Main() {
    const user = {id: 1, name: "Adam Pettyjohn"} as User;
    //const user = useSelector((state: Store) => state.users.user);
    // const files = useSelector((state: Store) => state.files.files);
    const files = ["test.json"];
    const dispatch = useDispatch();
    const today = useSelector((state: Store) => state.date.today);
    const selectedDate = useSelector((state: Store) => state.date.selected);
    const topCardStyle: React.CSSProperties = {
        display: "flex",
        flexGrow: '1',
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    }
    const svgStyle: React.CSSProperties = {transform: 'scale(1.6)'}
    const [newPost, setNewPost] = React.useState<HTMLElement | null>(null);
    const [selectDay, setSelectDay] = React.useState<HTMLElement | null>(null);
    const [selectYear, setSelectYear] = React.useState<HTMLElement | null>(null);
    const [profile, setProfile] = React.useState<HTMLElement | null>(null);
    const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
        const element = event.currentTarget;
        const menuName = element.dataset.menuname;
        if (menuName) {
            let setter = setNewPost;
            let oldElement = newPost;
            setNewPost(null);
            setSelectDay(null);
            setSelectYear(null);
            setProfile(null);
            switch (menuName) {
                case "NewPost":
                    setter = setNewPost;
                    oldElement = newPost;
                    break;
                case "SelectDay":
                    setter = setSelectDay;
                    oldElement = selectDay;
                    break;
                case "SelectYear":
                    setter = setSelectYear;
                    oldElement = selectYear;
                    break;
                case "Profile":
                    setter = setProfile;
                    oldElement = profile;
                    break;
            }
            if (oldElement) {
                setter(null)
            } else {
                setter(element);
            }
        }
    }

    return (
        <div className="view">
            <div style={{display: "flex", justifyContent: "center", flexGrow: '1'}}>
                <Card style={{maxWidth: '800px', flexGrow: '1', margin: "1em"}}>
                    <CardContent style={topCardStyle}>
                        <IconButton aria-label="new-entry" style={svgStyle} onClick={toggleMenu}
                                    data-menuname="NewPost">{(newPost) ? <Clear/> : <Add/>}</IconButton>
                        <IconButton aria-label="last-month" style={svgStyle}
                                    onClick={() => dispatch(backMonth())}><SkipPrevious/></IconButton>
                        <IconButton aria-label="yesterday" style={svgStyle}
                                    onClick={() => dispatch(backDay())}><KeyboardArrowLeft/></IconButton>
                        <Button aria-label="select-date" onMouseEnter={toggleMenu} data-menuname="SelectDay"
                                onDoubleClick={() => dispatch(select(today))}>
                            <Typography variant="h4" style={{textTransform: "none", fontSize: '3em'}}>
                                {`${selectedDate.monthName} ${selectedDate.day}`}</Typography>
                        </Button>
                        <IconButton aria-label="tomorrow" style={svgStyle}
                                    onClick={() => dispatch(forwardDay())}><KeyboardArrowRight/></IconButton>
                        <IconButton aria-label="next-month" style={svgStyle}
                                    onClick={() => dispatch(forwardMonth())}><SkipNext/></IconButton>
                        <Button aria-label="select-date" onMouseEnter={toggleMenu} data-menuname="SelectYear">
                            <Typography variant="h4" style={{
                                maxWidth: '50px',
                                wordWrap: "break-word",
                                textTransform: "none"
                            }}>{selectedDate.year}</Typography>
                        </Button>
                        {user ? <IconButton aria-label="next-month" onMouseEnter={toggleMenu} data-menuname="Profile">
                            <ProfilePic user={user}/>
                        </IconButton> : <div/>}
                    </CardContent>
                </Card>
            </div>

            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {files.map((fileName, i) => <Post fileName={fileName} index={i} key={i}></Post>)}
            </div>

            <Popper open={Boolean(newPost)} anchorEl={newPost} placement={"bottom"} style={{transition: "none"}}
                    modifiers={{offset: {enabled: true, offset: '75, 0'}}}>
                <NewPostPopper/>
            </Popper>
            <Popper open={Boolean(selectDay)} anchorEl={selectDay} placement={"bottom"} style={{transition: "none"}}
                    modifiers={{offset: {enabled: true, offset: '0, 10'}}} onMouseLeave={toggleMenu}
                    data-menuname="SelectDay">
                <SelectDayPopper/>
            </Popper>
            <Popper open={Boolean(selectYear)} anchorEl={selectYear} placement={"bottom"}
                    style={{transition: "none"}} onMouseLeave={toggleMenu} data-menuname="SelectYear">
                <SelectYearPopper/>
            </Popper>
            <Popper open={Boolean(profile)} anchorEl={profile} placement={"bottom-end"} style={{transition: "none"}}
                    modifiers={{offset: {enabled: true, offset: '40, 10'}}} onMouseLeave={toggleMenu}
                    data-menuname="Profile">
                <ProfilePopper/>
            </Popper>
        </div>);
}

export default Main;