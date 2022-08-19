import {Card, CardContent, CardMedia} from "@material-ui/core";
import {CSSProperties, useState} from "react";
import {Link} from "react-router-dom";

interface state {
    editorState: {},
    html: Array<string>
}

export default function Post(props: { fileName: string, index: number }) {
    // Styles
    const cardStyle: CSSProperties = {display: "flex", flexDirection: "row", width: "94%"};
    const contentStyle: CSSProperties = {display: "flex", flexGrow: "1", overflow: "hidden"};
    const contentDivStyle: CSSProperties = {display: "flex", flexDirection: "column", width: "100%"};
    const skeletonStyle = (props?: CSSProperties): CSSProperties => {
        const defaults = {
            borderRadius: '1em',
            flexGrow: "1",
            height: "1em",
            margin: "1em",
            backgroundColor: "#9f9f9f"
        };
        return {...defaults, ...props};
    }
    // State
    const initialState: state = {editorState: {}, html: []};
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
            setCurrentState(newState);
        }
        // console.log(`state: ${currentState.html.length}`, `initial state: ${initialState.html.length}`);
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

    return (
        <div className="post" data-filename={props.fileName} data-loaded=""
             style={{width: "50%", maxWidth: '800px', maxHeight: '200px'}} onClick={checkCache} key={props.index}>
            <Card style={cardStyle}>
                <CardContent style={contentStyle}>
                    {(currentState.html.length < 1) ?
                        <div style={contentDivStyle}>
                            <div style={skeletonStyle({height: "2em", marginRight: "40%"})}></div>
                            <div style={skeletonStyle()}></div>
                            <div style={skeletonStyle({marginRight: "20%"})}></div>
                        </div> :
                        <Link to="/edit" state={{editorState: currentState.editorState}} style={contentStyle}>
                            <div dangerouslySetInnerHTML={{__html: currentState.html.join("'")}}></div>
                        </Link>}
                </CardContent>
                {imageCounter(currentState.html)}
            </Card>
        </div>);
}