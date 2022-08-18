import {Card, CardContent, CardMedia} from "@material-ui/core";
import {CSSProperties, useState} from "react";

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
    const initialState = {editorState: {}, html: []};
    let state = {...initialState};
    const [seed, setSeed] = useState(1);
    const reset = () => {
        setSeed(Math.random());
    }
    // Functions
    function refreshState() {
        console.log(`state: ${state}`);
        const cookies = document.cookie.split(';');
        cookies.forEach((cookie) => {
            const temp = cookie.trim().split('=');
            if (temp[0] === props.fileName) state = JSON.parse(temp[1]);
        });
        reset();
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
        <div className="post" data-filename={props.fileName}
             style={{width: "50%", maxWidth: '800px', maxHeight: '200px'}} onClick={refreshState} key={props.index}>
            <Card style={cardStyle} key={seed}>
                <CardContent style={contentStyle}>
                    {(initialState.editorState === state.editorState && initialState.html === state.html) ?
                        <div style={contentDivStyle}>
                            <div style={skeletonStyle({height: "2em", marginRight: "40%"})}></div>
                            <div style={skeletonStyle()}></div>
                            <div style={skeletonStyle({marginRight: "20%"})}></div>
                        </div> :
                        <div>
                            {state.html}
                        </div>}
                </CardContent>
                {imageCounter(state.html)}
            </Card>
        </div>);
}