import {Button, Card, CardContent, IconButton, Popper, Tooltip, Typography} from "@material-ui/core";
import {Add, Clear, KeyboardArrowLeft, KeyboardArrowRight, SkipNext, SkipPrevious} from "@material-ui/icons";
import ProfilePic from "../Login/Components/ProfilePic";
import * as React from "react";
import Post from "./Components/Post";
import {useDispatch, useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";
import {NewPostPopper, ProfilePopper, SelectDayPopper, SelectYearPopper} from "./Components/Menus";
import {backDay, backMonth, forwardDay, forwardMonth, selectDate} from "../../reducers/dateSlice";
import {useNavigate} from "react-router-dom";
import {useEffect, useMemo} from "react";
import {Preference} from "../../objects/preference";
import {toggleTheme} from "../../reducers/themeSlice";

function Main() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const store = useSelector((state: Store) => state);
    const user = store.users.user;
    const files = useMemo(() => [...store.files.userFiles].sort((a,b) => {
        const newA = Number(a.split('_')[1].replace(/-/g,'')) - Number(a.split('_')[2]);
        const newB = Number(b.split('_')[1].replace(/-/g,'')) - Number(b.split('_')[2]);
        return newB - newA;
    }),[store.files.userFiles]);
    const today = store.date.today;
    const selectedDate = store.date.selected;
    let preferences: Preference = {id: user!.id, theme: "light", accentColor: "#fff", stayLoggedIn: false};
    store.preferences.users.forEach((item) => {
        if (item.id === user!.id) preferences = item;
    });

    const svgStyle: React.CSSProperties = {transform: 'scale(1.6)'};
    const topCardStyle: React.CSSProperties = {
        display: "flex",
        flexGrow: '1',
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    };
    const navBarStyle: React.CSSProperties = {
        position: 'fixed',
        top: "0",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "rgba(255,255,255,0)",
        paddingRight: "1em"
    };

    const [scroll, setScroll] = React.useState<any>(null);
    const [timer, setTimer] = React.useState<any | null>(null);
    const [newPost, setNewPost] = React.useState<HTMLElement | null>(null);
    const [selectDay, setSelectDay] = React.useState<HTMLElement | null>(null);
    const [selectYear, setSelectYear] = React.useState<HTMLElement | null>(null);
    const [profile, setProfile] = React.useState<HTMLElement | null>(null);
    
    function toggleMenu (event: React.MouseEvent<HTMLElement>) {
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
    function newPostHandler (e: React.MouseEvent<HTMLElement>) {
        switch (e.detail) {
            case 1:
                setTimer(setTimeout(() => {
                    newPost? setNewPost(null):
                        setNewPost(document.querySelector("button[data-menuname=NewPost]") as HTMLElement);
                },300));
                break;
            case 2:
                clearTimeout(timer);
                navigate("/edit",{state: {date:today,user:user!}});
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (files.length > 0 && scroll !== selectedDate) {
            let closestDay = files[0];
            let difference = 50000;
            const day1 = new Date(selectedDate.year,selectedDate.month-1,selectedDate.day);
            files.forEach((file: string) => {
                const dateStr = file.split('_')[1].split('-');
                let day2 = new Date(Number(dateStr[2]),Number(dateStr[0])-1,Number(dateStr[1]));
                let diff = Math.abs(day1.getTime() - day2.getTime())/86400000;
                if (diff < difference) {
                    difference = diff;
                    closestDay = file;
                }
            });
            const filepath = closestDay.split('_')[1];
            const posts = document.querySelectorAll("a.post-link") as NodeListOf<HTMLAnchorElement>;
            for (let i=0;i<posts.length;i++) {
                let date = posts[i].href.split('#')[1].split('_')[1];
                if (filepath === date) {
                    setScroll(selectedDate);
                    posts[i].click();
                    return;
                }
            }
        } else if (store.theme.value !== preferences.theme) {
            dispatch(toggleTheme(preferences.theme));
        }
    }, [user, files, scroll, selectedDate, navigate, store.theme.value, preferences.theme, dispatch]);

    return (
        <div className="view">
            <div style={navBarStyle}>
                <Card style={{maxWidth: '800px', flexGrow: '1', margin: "1em"}}>
                    <CardContent style={topCardStyle}>
                        <Tooltip title="New Post"><IconButton style={svgStyle} onClick={newPostHandler} data-menuname="NewPost">
                            {(newPost) ? <Clear/> : <Add/>}
                        </IconButton></Tooltip>
                        <Tooltip title="Previous Month"><IconButton style={svgStyle}
                                       onClick={() => dispatch(backMonth())}><SkipPrevious/></IconButton></Tooltip>
                        <Tooltip title="Previous Day"><IconButton style={svgStyle}
                                       onClick={() => dispatch(backDay())}><KeyboardArrowLeft/></IconButton></Tooltip>
                        <Button onMouseEnter={toggleMenu} data-menuname="SelectDay"
                                onDoubleClick={() => dispatch(selectDate(today))}>
                            <Typography variant="h4" style={{textTransform: "none", fontSize: '3em'}}>
                                {`${selectedDate.monthName} ${selectedDate.day}`}</Typography>
                        </Button>
                        <Tooltip title="Next Day"><IconButton style={svgStyle}
                                       onClick={() => dispatch(forwardDay())}><KeyboardArrowRight/></IconButton></Tooltip>
                        <Tooltip title="Next Month"><IconButton style={svgStyle}
                                       onClick={() => dispatch(forwardMonth())}><SkipNext/></IconButton></Tooltip>
                        <Button onMouseEnter={toggleMenu} data-menuname="SelectYear">
                            <Typography variant="h4" style={{
                                maxWidth: '50px',
                                wordWrap: "break-word",
                                textTransform: "none"
                            }}>{selectedDate.year}</Typography>
                        </Button>
                        {user ? <IconButton onMouseEnter={toggleMenu} data-menuname="Profile">
                            <ProfilePic user={user}/>
                        </IconButton> : <div/>}
                    </CardContent>
                </Card>
            </div>

            <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "180px"}}>
                {(files.length > 0)?
                <div style={{display: "flex", flexDirection: "column", width: "70%"}}>
                    {files.map((fileName, i) =>
                        <div key={i}>
                            <Post fileName={fileName} index={i} dirName={`${user!.name}-${user!.id}`}/>
                            <div style={{height: "1em"}}/>
                        </div>)}
                </div>:
                <div style={{marginTop: "2em"}}>
                    <Typography style={{color: "var(--systemText)"}}>No posts yet...</Typography>
                </div>}
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