import Col from "../../../components/layouts/Col";
import css from "./UserComponent.module.css";
import {User} from "../models/UserModel";
import React, {useState} from "react";
import {Autocomplete, FormControlLabel, Switch, TextField, Tooltip} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import UserDAO from "../dao/UserDAO";
import {State} from "../../../models/Response";

interface Props {
    user?: User;
    onSave?: () => void;
}

export default function RegisterUser(props: Props) {
    const [model, setModel] = useState<User>(props.user || {
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        status: "ACTIVE",
        role: "RECEPTION"
    });
    const [loading, setLoading] = useState(false);
    const userDAO = new UserDAO();

    const onChange = (e: any) => setModel({...model, [e.target.name]: e.target.value});
    const onSwitch = (e: any, value: boolean) => setModel({...model, status: value ? "ACTIVE" : "INACTIVE"});

    const save = async () => {
        setLoading(true);
        const response = await userDAO.saveUser(model);
        if (response.state === State.SUCCESS) props.onSave && props.onSave();
            setLoading(false);
    }

    return <Col className={css.wrapper} gap={"20"}>
        <h3>Хэрэглэгч {props.user ? " засварлах" : " бүртгэх"}</h3>
        <Col gap={"15"}>
            <TextField label={"Овог"} value={model.lastname} onChange={onChange} name={"lastname"}/>
            <TextField label={"Нэр"} value={model.firstname} onChange={onChange} name={"firstname"}/>
            <TextField label={"Нэвтрэх нэр"} value={model.username} onChange={onChange} name={"username"}/>
            <TextField label={"Нууц үг"} value={model.password} onChange={onChange} name={"password"}/>

            <Autocomplete
                value={model.role}
                options={["RECEPTION", "ADMIN", "ACCOUNTANT"]}
                renderInput={(params) => <TextField {...params} label="Эрх"/>}
                disableClearable={true}
                onChange={(e, value) => setModel({...model, role: value})}
            />

            <Tooltip title={"Идэвхгүй бол уг хэрэглэгч програмд нэвтрэх боломжгүй болно"}>
                <FormControlLabel
                    control={<Switch checked={model.status === "ACTIVE"} color="primary"/>}
                    label="Идэвхтэй эсэх"
                    labelPlacement="start"
                    onChange={onSwitch}
                />
            </Tooltip>
            <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon/>}
                variant="outlined"
                onClick={save}
            >
                Хадгалах
            </LoadingButton>
        </Col>
    </Col>
}
