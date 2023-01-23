import Row from "../../../components/layouts/Row";
import {TimeTable} from "../models/ScheduleModels";
import css from "./ScheduleComponent.module.css";
import {LoadingButton} from "@mui/lab";
import React, {useState} from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleDAO from "../dao/ScheduleDAO";
import {State} from "../../../models/Response";
import {toast} from "react-toastify";
import Col from "../../../components/layouts/Col";

interface Props {
    timeTable: TimeTable;
    onSave?: () => void;
    onClose: () => void;
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

    return <Col className={css.wrapper}>
        <div style={{fontWeight: "bold"}}>
            {props.timeTable.schedule.customer?.lastname.charAt(0) + ". " + props.timeTable.schedule.customer?.firstname} -
            Үйлчлүүлэгчийн цагийг цуцлах?
        </div>
        <div style={{color: "rgba(0,0,0,0.5)", fontSize: "0.8rem"}}>
            Цагийг цуцлавал тухайн үйлчлүүлэгчийн эрхийг буцааж нэмнэ
        </div>
        <Row gap={"10"}
             style={{borderTop: "1px solid rgba(0,0,0,0.2)", marginTop: "15px", padding: "10px 15px 0 15px"}}>
            <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<CancelIcon/>}
                variant="contained"
                color={"error"}
                onClick={props.onClose}
            >
                Үгүй
            </LoadingButton>
            <LoadingButton
                loading={loading}
                loadingPosition="start"
                variant="text"
                onClick={cancel}
            >
                Тийм
            </LoadingButton>
        </Row>
    </Col>
}
