import TextEditor from "./components/TextEditor";
import {Button, Card, CardContent} from "@material-ui/core";

function Edit () {
    return(<div className="view">
        <Card>
            <CardContent>
                <TextEditor />
            </CardContent>
        </Card>
        <div style={{display: "flex", flexDirection: "row-reverse", margin: "2em"}}>
            <Button variant="contained" size="large">Save</Button>
            <span style={{width: "2em"}} />
            <Button variant="contained" size="large">Close</Button>
        </div>
    </div>);
}
export default Edit;