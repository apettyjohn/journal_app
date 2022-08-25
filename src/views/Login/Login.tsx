import {
    Button,
    Card,
    CardActionArea,
    CardContent, Fade,
    IconButton,
    Popover,
    Popper,
    TextField,
    Typography
} from "@material-ui/core";
import * as React from 'react';
import ProfilePic from "./Components/ProfilePic";
import {useDispatch, useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";
import {RemoveCircle} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {selectUser} from "../../reducers/userSlice";

function Login() {
    const findUserCards = () => {
        const list = document.querySelectorAll("div#login div.MuiCardContent-root>div") as NodeListOf<HTMLElement>
        return (list.length > 0)? list : null;
    }

    const dispatch = useDispatch();
    const users = useSelector((state: Store) => state.users.users);
    const [createModal, setCreateModal] = React.useState<HTMLElement | null>(null);
    const [deleteModal, setDeleteModal] = React.useState<NodeListOf<HTMLElement> | null>(findUserCards());
    const toggleCreateModal = (event: React.MouseEvent<HTMLElement>) => {
        if (createModal) setCreateModal(null);
        else setCreateModal(event.currentTarget);
    }
    const toggleDeleteModal = () => {
        if (deleteModal) setDeleteModal(null);
        else setDeleteModal(findUserCards());
    }
    const setUser = (e: React.MouseEvent<HTMLElement>) => {
        const elem = e.currentTarget.querySelector("*[data-key]")! as HTMLElement;
        const id = Number(elem.dataset.key);
        const name = elem.textContent;
        users.forEach((user,i) => {
            if (user.id === id && user.name === name) {
                dispatch(selectUser(i));
                const app = document.getElementById("app")!;
                app.dataset.loaded = "";
                app.click();
                return;
            }
        });
    }

    const headCardStyle: React.CSSProperties = {display: 'flex', flexDirection: "row-reverse"};
    const bodyCardStyle: React.CSSProperties = {maxWidth: '20%', textAlign: "center", margin: "1em"}
    const divStyles: React.CSSProperties = {
        width: '100%',
        height: '65%',
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "flex-start",
        justifyContent: "center",
        paddingTop: '10%',
    };

    return (<div className="view" id="login">
        <div style={{display: "flex", justifyContent: "center", flexGrow: '1'}}>
            <Card style={{maxWidth: '800px', flexGrow: '1', margin: "1em"}}>
                <CardContent style={headCardStyle}>
                    <Button size="large" className="delete"
                            onClick={toggleDeleteModal}>{(Boolean(deleteModal) && users.length > 0)? "Cancel" : "Delete User"}</Button>
                    <span style={{width: '1rem'}}/>
                    <Button size="large" className="create" onClick={!Boolean(deleteModal) ? toggleCreateModal : () => {
                    }}>Create User</Button>
                </CardContent>
            </Card>
        </div>
        <div style={divStyles}>
            {users.map((user, i) =>
                <Card style={bodyCardStyle} key={i}>
                    <Link to="/main">
                        <CardActionArea onClick={setUser}>
                            <CardContent key={i}>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <ProfilePic user={user}/>
                                </div>
                                <span style={{display: "inline-block", height: "1em"}}/>
                                <Typography id={`user${i}`} data-key={user.id}>{user.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                    <Popper key={i} open={Boolean(deleteModal)} anchorEl={(deleteModal === null)? null: deleteModal[i]}
                            placement={"top-end"} modifiers={{offset: {enabled: true, offset: '50, 0'}}}
                            style={{transition: "none"}} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <IconButton className="delete-user-btn file-save" style={{padding: "4px"}} data-elementid={`user${i}`}>
                                    <RemoveCircle/>
                                </IconButton>
                            </Fade>
                        )}
                    </Popper>
                </Card>
            )}
        </div>
        <Popover open={Boolean(createModal)}
                 anchorEl={createModal}
                 onClose={toggleCreateModal}
                 anchorOrigin={{vertical: 80, horizontal: 'right'}}
                 transformOrigin={{vertical: 'top', horizontal: 'right'}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    <TextField label="Name" variant="filled" style={{margin: "1em"}} fullWidth id={'create-user-field'}/>
                </div>
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    <Button variant="contained" style={{minWidth: "180px", margin: "1em 3em 1em 3em"}} className={"file-save"}
                            id={"create-user-btn"} data-elementid={"create-user-field"} fullWidth>Create</Button>
                </div>
            </div>
        </Popover>
    </div>);
}

export default Login;