import * as React from 'react';
import {Box, Button, Modal, Typography} from "@material-ui/core";
import {CSSProperties} from "react";

const style: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid',
    outline: '0',
    borderRadius: '2em',
    padding: '1em'
};

export default function FileModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen} variant="contained">Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style}>
                    <Typography variant="h5">Text in a modal</Typography>
                    <Typography>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                    <div style={{display:'flex',flexDirection:"row-reverse"}}>
                        <Button onClick={handleClose} variant="contained" color="default">Close modal</Button>
                        <Button className="file-open" data-options={'{}'} variant="contained">Open Folder</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}