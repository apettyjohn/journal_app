import React, {CSSProperties} from 'react';
import {User} from "../../../objects/user";

function parseName(name: string){
    const list: Array<string> = name.toUpperCase().split(' ');
    return list[0][0];
}

function ProfilePic(props: {size?: string, user: User}) {
    const imgStyle: CSSProperties = {height:"inherit",width:"inherit", borderRadius:"inherit"};
    let divStyle: CSSProperties = {
        height: '60px',
        width: '60px',
        borderRadius: '50%',
        backgroundColor: '#D9D9D9',
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        fontSize: '25px',
        color: "black",
        boxShadow: '0px 2px 3px 0px rgb(0 0 0 / 50%)'
    }
    if (props.size === "large") {
        divStyle.height = '100px';
        divStyle.width = '100px';
    }
    const body = (props.user.imgSrc !== undefined)? <img src={props.user.imgSrc} alt="" style={imgStyle}/> :
        ((props.user.name !== undefined && props.user.name.length > 0)?
            parseName(props.user.name) : props.user.id)

    return (
        <div style={divStyle}>{body}</div>);
}

export default ProfilePic;
