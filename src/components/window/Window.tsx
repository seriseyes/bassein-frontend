import Modal from '@mui/material/Modal';
import React from "react";
import css from "./Window.module.css";

export interface WindowProps {
    open: boolean;
    title?: string;
    onClose?: () => void;
    children: React.ReactElement;
}

export default function Window(props: WindowProps) {

    return <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={css.wrapper}
    >
        {props.children}
    </Modal>
}
