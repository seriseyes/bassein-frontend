import {Chip, Divider, TextField, Tooltip} from "@mui/material";
import React, {useState} from "react";
import css from "./ScheduleComponent.module.css";
import Row from "../../../components/layouts/Row";
import ScheduleDAO from "../dao/ScheduleDAO";
import {Schedule} from "../models/ScheduleModels";
import {State} from "../../../models/Response";
import {toast} from "react-toastify";
import Col from "../../../components/layouts/Col";
import Loading from "../../../components/loading/Loading";

interface Props {
    onSave?: () => void;
}

export default function UnPlanned(props: Props) {
    const [state, setState] = useState<Schedule[]>();
    const [regNo, setRegNo] = useState("");
    const [loading, setLoading] = useState(false);
    const dao = new ScheduleDAO();

    const search = async () => {
        setLoading(true);
        const response = await dao.findAllByCustomerRegNo(regNo);
        if (response.state === State.SUCCESS) {
            setState(response.data);
        }
        setLoading(false);
    }

    const onClick = async (schedule: Schedule) => {
        const response = await dao.markAsCame(schedule.id!);
        if (response.state === State.SUCCESS) {
            toast.success(response.message);
            if (props.onSave) props.onSave();
        } else {
            toast.error(response.message);
        }
    }

    return <Row className={css.wrapper} gap={"10"}>
        {
            state
                ? <Chip label={state[0].customer?.lastname.charAt(0) + ". " + state[0].customer?.firstname}/>
                : <Tooltip title={"Монголоор регистрийн дугаар бичиж \"Enter\" товчлуур дарж хайна уу"}>
                    <TextField label={"Регистрийн дугаар"} value={regNo} onChange={(e) => setRegNo(e.target.value)}
                               name={"regNo"}
                               placeholder={"AA00112233"}
                               onKeyDown={(e) => (e.key === 'Enter') && search()}
                    />
                </Tooltip>
        }

        <Divider orientation="vertical" variant="middle" flexItem/>

        {
            state && <Col gap={"10"}>
                <div style={{fontWeight: "bold"}}>Хасалт хийх хуваарь сонгоно уу</div>
                {state.map(schedule => (
                    <Tooltip title={"Нийт орох/одоогоор орсон | хуваарь үүсгэсэн"}>
                        <Chip
                            onClick={() => onClick(schedule)}
                            label={<Row gap={"5"}>
                                <strong>{schedule.enter + "/" + schedule.day}</strong>
                                {" | "+schedule.created?.toLocaleString().split("T")[0]}
                            </Row>}
                        />
                    </Tooltip>
                ))}
            </Col>
        }
    <Loading isLoading={loading}/>
    </Row>
}
