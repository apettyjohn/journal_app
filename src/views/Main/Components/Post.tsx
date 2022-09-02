import {Card, CardActionArea, CardContent, CardMedia} from "@material-ui/core";
import {CSSProperties, useState} from "react";
import {useNavigate} from "react-router-dom";
import {DateTime} from "../../../objects/dateTime";
import {User} from "../../../objects/user";

interface state {
    editorState: {},
    html: Array<string>,
    date?: DateTime,
    user?: User,
    fileName: string
}

export default function Post(props: { fileName: string, index: number, dirName: string }) {
    // Styles
    const cardStyle: CSSProperties = {display: "flex", flexDirection: "row", flexGrow: "1"};
    const contentStyle: CSSProperties = {display: "flex", flexGrow: "1", overflow: "hidden"};
    const contentDivStyle: CSSProperties = {display: "flex", flexDirection: "column", width: "100%"};
    const dateCircleStyle: CSSProperties = {
        height: "50px",
        width: "50px",
        borderRadius: "50%",
        backgroundColor: "#D9D9D9",
        color: "black",
        fontWeight: "bold",
        boxShadow: '0px 2px 3px 0px rgb(0 0 0 / 50%)',
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        marginRight: "2em"
    };
    const skeletonStyle = (props?: CSSProperties): CSSProperties => {
        const defaults = {
            borderRadius: '1em',
            flexGrow: "1",
            height: "1em",
            margin: "1em",
            backgroundColor: "#9f9f9f"
        };
        return {...defaults, ...props};
    };

    // State
    const navigate = useNavigate();
    const initialState: state = {editorState: {}, html: [], fileName: props.fileName};
    const [currentState, setCurrentState] = useState(initialState);
    const cacheName = "journal-app-files";

    // Functions
    async function checkCache() {
        const url = `http://localhost:3000/files/${props.fileName}`;
        const cache = await caches.open(cacheName);
        const response = await cache.match(url);
        if (response === undefined) return;
        const data = await response.text();
        const newState = JSON.parse(data) as state;
        if (newState.editorState !== currentState.editorState && newState.html !== currentState.html) {
            setCurrentState({...currentState,...newState});
        }
    }
    function imageCounter(html: Array<string>) {
        const htmlString = html.join("'");
        const count = (htmlString.match(/<img/g) || []).length;
        const divStyle: CSSProperties = {
            display: "absolute",
            width: "100%",
            height: "100%",
            textAlign: "center",
            verticalAlign: "middle",
            lineHeight: "100%"
        };

        if (count > 0) {
            const start = htmlString.search("<img");
            const end = htmlString.slice(start).search("/>");
            const firstImage = htmlString.slice(start, end).split(' ');
            let imgSrc, imgAlt = "";
            firstImage.forEach((prop) => {
                if (prop.includes('=')) {
                    const temp = prop.split('=');
                    if (temp[0] === "src") imgSrc = temp[1];
                    if (temp[0] === "alt") imgAlt = temp[1];
                }
            });
            return <CardMedia
                component="img"
                image={imgSrc}
                alt={imgAlt}
                style={{width: "100px", objectFit: "scale-down"}}>
                {(count > 1) ? <div style={divStyle}>{"+" + (count - 1).toString()}</div> : <div/>}
            </CardMedia>;
        } else {
            return <div/>
        }
    }

    // File info
    const day = props.fileName.split('_')[1].split('-')[1];
    const postNum = Number(props.fileName.split('_')[2]);

    return (
        <div className="post" data-filepath={`["${props.dirName}","${props.fileName}"]`} data-loaded=""
             id={`post-${props.fileName.split('.')[0]}`} onClick={checkCache} key={props.index}
             style={{width: "100%", maxWidth: '800px', maxHeight: '200px', display: "flex"}}>
            <a href={`#post-${props.fileName.split('.')[0]}`} className="post-link">
            {(postNum === 1)?
                <div style={dateCircleStyle}>{day}</div>:
                <div style={{width: "50px", marginRight: "2em"}} />}
            </a>
            <Card style={cardStyle} onClick={() => console.log()}>
                <CardContent style={contentStyle}>
                    {(currentState.html.length < 1) ?
                        <div style={contentDivStyle}>
                            <div style={skeletonStyle({height: "2em", marginRight: "40%"})}></div>
                            <div style={skeletonStyle()}></div>
                            <div style={skeletonStyle({marginRight: "20%"})}></div>
                        </div> :
                        <CardActionArea onClick={() => navigate("/edit",{state: currentState})}>
                            <div dangerouslySetInnerHTML={{__html: currentState.html.join("'")}} style={contentStyle}></div>
                        </CardActionArea>}
                </CardContent>
                {imageCounter(currentState.html)}
            </Card>
        </div>);
}