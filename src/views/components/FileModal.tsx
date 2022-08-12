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
            <Button onClick={handleOpen} variant="contained">File modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style}>
                    <Typography variant="h5">Text in a modal</Typography>
                    <Typography>Duis mollis, est non commodo luctus, nisi erat porttitor ligula</Typography>
                    <div style={{display:'flex',flexDirection:"row-reverse"}}>
                        <Button onClick={handleClose} variant="contained" color="default">Close modal</Button>
                        <Button onClick={handleClose} className="file-open"
                                data-options={'{"dialog":"false","fullPaths":"[`C:/Users\\apett\\Downloads\\test.json`]"}'}
                                variant="contained">Open File</Button>
                        <Button onClick={handleClose} className="file-save"
                                data-options={'{"elementId":"file-input","dialog":"false","fullPath":"C:\\Users\\apett\\Downloads\\test.json"}'}
                                variant="contained">Save text</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}