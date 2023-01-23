import {Settings} from "../../../models/Settings";
import css from "./SettingsComponent.module.css";
import Col from "../../../components/layouts/Col";
import {Switch, TextField} from "@mui/material";
import React, {useState} from "react";
import {LoadingButton} from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {State} from "../../../models/Response";
import {Status} from "../../../enums/Status";
import SettingsDAO from "../../../dao/SettingsDAO";
import Row from "../../../components/layouts/Row";

interface Props {
    name: string;
    settings?: Settings;
    onSave?: () => void;
    title: string;
}

export default function RegisterSettings(props: Props) {
    const [state, setState] = useState<Settings>(props.settings || {
        name: props.name,
        label: "",
        note: "",
        value: 0,
        has: false,
        status: Status.ACTIVE
    });
    const [loading, setLoading] = useState(false);
    const dao = new SettingsDAO();

    const save = async (status: Status = Status.ACTIVE) => {
        setLoading(true);
        const response = await dao.save({...state, status});
        if (response.state === State.SUCCESS) props.onSave && props.onSave();
        setLoading(false);
    }

    const onChange = (e: any) => setState({...state, [e.target.name]: e.target.value});

    return <Col className={css.wrapper} gap={"10"} style={{maxHeight: props.settings ? "550px" : "495px"}}>
        <strong>{props.title}</strong>
        <TextField label={"Нэр"} value={state.label} onChange={onChange} name={"label"}/>

        <TextField type={"number"} label={props.name === 'discount' ? "Хөнгөлөх мөнгөн дүн" : "Үнэ"} value={state.value} onChange={onChange}
                   name={"value"}/>
        {props.name === 'swimType'
            ? <Row style={{alignItems: "center"}}>
                <Switch
                    checked={state.has}
                    onChange={(e: any) => setState({...state, has: e.target.checked})}
                    inputProps={{'aria-label': 'controlled'}}
                />
                <div>Багштай эсэх</div>
            </Row>
            : null}
        <TextField
            label={"Дэлгэрэнгүй тайлбар"}
            value={state.note}
            onChange={onChange}
            name={"note"}
            multiline
            rows={8}
        />

        {props.settings && <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<DeleteIcon/>}
            variant="outlined"
            color={"error"}
            onClick={() => save(Status.INACTIVE)}
        >
            Устгах
        </LoadingButton>}

        <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon/>}
            variant="outlined"
            onClick={() => save()}
        >
            Хадгалах
        </LoadingButton>
    </Col>
}
