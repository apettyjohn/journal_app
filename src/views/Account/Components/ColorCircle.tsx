import React, {CSSProperties} from 'react';

function ColorCircle(props: {color: string}) {
    let divStyle: CSSProperties = {
        height: '40px',
        width: '40px',
        borderRadius: '50%',
        backgroundColor: props.color,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        boxShadow: '0px 2px 3px 0px #00000033',
        border: '1px solid'
    }
    return (
        <div style={divStyle}></div>);
}

export default ColorCircle;
