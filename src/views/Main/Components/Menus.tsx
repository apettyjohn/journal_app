import {Button, Card, CardContent, MenuItem, Popper, TextField, Typography} from "@material-ui/core";
import * as React from "react";
import {CSSProperties, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Store} from "../../../reducers/reduxStore";
import {arrayMaker, monthDays, monthNames, parseDate, weekDaysShort} from "../../../objects/dateTime";
import {ExitToApp, Person, Tune} from "@material-ui/icons";
import {select} from "../../../reducers/dateSlice";

export function NewPostPopper() {
    const today = useSelector((state: Store) => state.date.today);
    const [month, setMonth] = useState<string>(today.monthName);
    const [day, setDay] = useState<number>(today.day);
    const [year, setYear] = useState<number>(today.year);

    return (
        <Card>
            <CardContent style={{minWidth: "260px"}}>
                <div style={{display: "flex", flexGrow: "1", justifyContent: "space-between"}}>
                    <TextField value={month} onChange={(e) => setMonth(e.target.value)} select label="Month" fullWidth
                               SelectProps={{MenuProps: {PaperProps: {style: {maxHeight: "70%", minHeight: "100px"}}}}}>
                        {monthNames.map((name, i) => <MenuItem key={i} value={name}>{name}</MenuItem>)}
                    </TextField>
                    <TextField value={day} onChange={(e) => setDay(Number(e.target.value))} select label="Day" fullWidth
                               type="number" style={{marginRight: "1em", marginLeft: "1em"}}
                               SelectProps={{MenuProps: {PaperProps: {style: {maxHeight: "70%", minHeight: "100px"}}}}}>
                        {arrayMaker(1, monthDays[monthNames.indexOf(month)], true).map((day, i) =>
                            <MenuItem key={i} value={day}>{day}</MenuItem>)}
                    </TextField>
                    <TextField value={year} onChange={(e) => setYear(Number(e.target.value))} select label="Year"
                               SelectProps={{MenuProps: {PaperProps: {style: {maxHeight: "70%", minHeight: "100px"}}}}}
                               fullWidth type="number">
                        {arrayMaker(1950, today.year, true).map((year, i) =>
                            <MenuItem key={i} value={year}>{year}</MenuItem>)}
                    </TextField>
                </div>
                <div style={{display: "flex", flexGrow: "1", justifyContent: "center"}}>
                    <Button variant="contained" fullWidth
                            style={{marginRight: "2em", marginLeft: "2em", marginTop: "1em"}}>Create</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function SelectDayPopper() {
    const dispatch = useDispatch();
    const [popup, setPopup] = useState<number>(0);
    const togglePopup = (e: React.MouseEvent<HTMLElement>) => {
        const day = Number(e.currentTarget.dataset.day);
        setPopup((popup > 0) ? 0 : day);
    }
    const currentDay = useSelector((state: Store) => state.date.selected);
    const monthStart = parseDate(1, currentDay.month, currentDay.year);
    const daysInMonth = monthDays[currentDay.month - 1];

    const gridStyle: CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gridTemplateRows: "repeat(5,1fr)",
        gap: "10px 10px",
        placeItems: "center",
        marginTop: "1em",
        marginBottom: "1em"
    }
    const dayBoxStyle: CSSProperties = {
        height: "20px",
        width: "20px",
        border: "1px solid",
        borderRadius: "0.5em"
    }

    return (
        <Card>
            <CardContent>
                <div style={{
                    display: "flex",
                    flexGrow: "1",
                    justifyContent: "space-between",
                    marginRight: "6px",
                    marginLeft: "4px"
                }}>
                    {weekDaysShort.map((day, i) => <Typography key={i}>{day}</Typography>)}
                </div>
                <div style={{width: "100%", height: "2px", backgroundColor: "var(--text)", marginTop: "0.5em"}}/>
                <div style={gridStyle} id="date-grid">
                    {arrayMaker(0, monthStart.weekdayNumber).map((day, i) => <div key={i}/>)}
                    {arrayMaker(1, daysInMonth, true).map((day, i) =>
                        <div style={dayBoxStyle} key={i} data-day={i + 1} onMouseOver={togglePopup}
                             onMouseOut={togglePopup}
                             onClick={() => dispatch(select(parseDate(i + 1, currentDay.month, currentDay.year)))}/>
                    )}
                </div>
                <div style={{display: "flex", flexGrow: "1", justifyContent: "space-around"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{...dayBoxStyle, marginRight: "0.5em"}}/>
                        <Typography style={{fontSize: "0.8em"}}>Less Posts</Typography>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{...dayBoxStyle, marginRight: "0.5em"}}/>
                        <Typography style={{fontSize: "0.8em"}}>More Posts</Typography>
                    </div>
                </div>
            </CardContent>
            <Popper open={Boolean(popup)} anchorEl={document.getElementById("date-grid")} placement={"right-start"}
                    style={{transition: "none"}} modifiers={{offset: {enabled: true, offset: '0, 20'}}}>
                <DateInfoPopper date={{day: popup, month: currentDay.month, year: currentDay.year}}/>
            </Popper>
        </Card>
    );
}

export function SelectYearPopper() {
    const dispatch = useDispatch();
    const date = useSelector((state: Store) => state.date.selected);
    const [inputYear, setInputYear] = useState<number>(date.year);

    return (
        <Card>
            <CardContent>
                <TextField value={inputYear} select label="Year" fullWidth type="number"
                           SelectProps={{MenuProps: {PaperProps: {style: {maxHeight: "70%", minHeight: "100px"}}}}}
                           onChange={(e) => {
                               dispatch(select({...date, year: Number(e.target.value)}));
                               setInputYear(Number(e.target.value));
                           }}>
                    {arrayMaker(1950, date.year, true).map((year, i) =>
                        <MenuItem key={i} value={year}>{year}</MenuItem>)}
                </TextField>
            </CardContent>
        </Card>
    );
}

export function ProfilePopper() {
    return (
        <Card>
            <CardContent style={{maxWidth: "200px"}}>
                <Button startIcon={<Person/>} fullWidth>Profile</Button>
                <Button startIcon={<Tune/>} fullWidth>Preferences</Button>
                <Button startIcon={<ExitToApp/>} fullWidth>Switch User</Button>
            </CardContent>
        </Card>
    );
}

export function DateInfoPopper(props: { date: { day: number, month: number, year: number } }) {
    const date = parseDate(props.date.day, props.date.month, props.date.year);
    return (
        <Card>
            <CardContent style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography>{date.weekdayName} {date.monthName}, {date.day}</Typography>
                <Typography># of Posts</Typography>
            </CardContent>
        </Card>
    );
}