import React, {CSSProperties} from 'react';
import {User} from "../../objects/user";

function ProfilePic(props: {size?: string, user: User}) {
    function parseName(name: string){
        const list = name.split(' ');
        return (list.length > 1)? list.at(0)!.at(0)!.toUpperCase() + list.at(-1)!.at(0)!.toUpperCase() : list.at(0)!.at(0)!.toUpperCase();
    }

    const imgStyle: CSSProperties = {height:"inherit",width:"inherit", borderRadius:"inherit"};
    let divStyle: CSSProperties = {
        height: '60px',
        width: '60px',
        borderRadius: '50%',
        backgroundColor: '#D9D9D9',
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        fontSize: '25px'
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
