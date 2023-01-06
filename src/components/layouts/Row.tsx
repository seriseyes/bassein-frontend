import css from "./Layout.module.css";
import React from "react";

/**
 * Horizontal Layout
 */

export interface LayoutProps {
    children?: React.ReactNode;
    gap?: string;
    style?: React.CSSProperties;
    className?: string;
}
export default function Row(props: LayoutProps) {
    return <div className={`${css.row} ${props.className}`} style={{...props.style, ...{gap: (props.gap || "0") + "px"}}}>
        {props.children}
    </div>
}
