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
import {useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";
import {RemoveCircle} from "@material-ui/icons";
import {User} from "../../objects/user";

function Login() {
    const findUserCards = () => {
        const list = document.querySelectorAll("div#login div.MuiCardContent-root>div") as NodeListOf<HTMLElement>
        return (list.length > 0)? list : null;
    }

    const users = [{id: 1, name: "Adam Pettyjohn"}] as Array<User>;
    // const users = useSelector((state: Store) => state.users.users);
    let [refs, setRefs] = React.useState(null);
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

    const headCardStyle: React.CSSProperties = {display: 'flex', flexDirection: "row-reverse"};
    const bodyCardStyle: React.CSSProperties = {maxWidth: '20%', textAlign: "center"}
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
                    <CardActionArea>
                        <CardContent key={i}>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <ProfilePic user={user}/>
                            </div>
                            <span style={{display: "inline-block", height: "1em"}}/>
                            <Typography>{user.name}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <Popper key={i} open={Boolean(deleteModal)} anchorEl={(deleteModal === null)? null: deleteModal[i]}
                            placement={"top-end"} modifiers={{offset: {enabled: true, offset: '50, 0'}}}
                            style={{transition: "none"}} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <IconButton aria-label="new-entry" style={{padding: "4px"}}><RemoveCircle/></IconButton>
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
                    <TextField label="Name" variant="filled" style={{margin: "1em"}} fullWidth/>
                </div>
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    <Button variant="contained" style={{minWidth: "180px", margin: "1em 3em 1em 3em"}}
                            fullWidth>Create</Button>
                </div>
            </div>
        </Popover>
    </div>);
}

export default Login;