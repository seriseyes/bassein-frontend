import css from "./Layout.module.css";
import React from "react";
import {LayoutProps} from "./Row";

export default function Col(props: LayoutProps) {
    return <div className={`${css.col} ${props.className}`} style={{...props.style, ...{gap: (props.gap || "0") + "px"}}}>
        {props.children}
    </div>
}
