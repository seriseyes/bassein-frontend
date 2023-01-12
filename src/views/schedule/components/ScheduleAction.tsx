import Row from "../../../components/layouts/Row";
import {TimeTable} from "../models/ScheduleModels";
import css from "./ScheduleComponent.module.css";
import {LoadingButton} from "@mui/lab";
import React, {useState} from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleDAO from "../dao/ScheduleDAO";
import {State} from "../../../models/Response";
import {toast} from "react-toastify";

interface Props {
    timeTable: TimeTable;
    onSave?: () => void;
}

export default function ScheduleAction(props: Props) {
    const [loading, setLoading] = useState(false);
    const dao = new ScheduleDAO();

    const cancel = async () => {
        setLoading(true);
        if (!props.timeTable.id) {
            console.error("TimeTable id is null");
            return;
        }
        const response = await dao.cancelCame(props.timeTable.id);
        if (response.state === State.SUCCESS) {
            toast.success(response.message);
            props.onSave && props.onSave();
        }
        setLoading(false);
    }

    return <Row className={css.wrapper}>
        <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<CancelIcon/>}
            variant="outlined"
            color={"error"}
            onClick={cancel}
        >
            Цуцлах
        </LoadingButton>
    </Row>
}
