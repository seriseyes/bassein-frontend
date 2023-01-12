import {Customer} from "../models/UserModel";
import React, {useState} from "react";
import UserDAO from "../dao/UserDAO";
import {State} from "../../../models/Response";
import Col from "../../../components/layouts/Col";
import css from "./UserComponent.module.css";
import {TextField, Tooltip} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    customer?: Customer;
    onSave?: () => void;
}

export default function RegisterCustomer(props: Props) {
    const [model, setModel] = useState<Customer>(props.customer || {
        firstname: "",
        lastname: "",
        regNo: "",
        phone: "",
        status: "ACTIVE"
    });
    const [loading, setLoading] = useState(false);
    const userDAO = new UserDAO();

    const onChange = (e: any) => setModel({...model, [e.target.name]: e.target.value});

    const save = async (status: string = "ACTIVE") => {
        setLoading(true);
        const response = await userDAO.saveCustomer({...model, status});
        if (response.state === State.SUCCESS) props.onSave && props.onSave();
        setLoading(false);
    }

    return <Col className={css.wrapper} gap={"20"} style={{maxHeight: props.customer ? "445px" : "390px"}}>
        <h3>Үйлчлүүлэгч {props.customer ? " засварлах" : " бүртгэх"}</h3>
        <Col gap={"15"}>
            <TextField label={"Овог"} value={model.lastname} onChange={onChange} name={"lastname"}/>
            <TextField label={"Нэр"} value={model.firstname} onChange={onChange} name={"firstname"}/>
            <Tooltip title={"Монгол үсэг ашиглан бичнэ үү."}>
                <TextField label={"Регистрийн дугаар"} value={model.regNo} onChange={onChange} name={"regNo"}
                           placeholder={"AA00112233"}/>
            </Tooltip>
            <TextField label={"Утас"} value={model.phone} onChange={onChange} name={"phone"} type={"number"}/>

            {props.customer && <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<DeleteIcon/>}
                variant="outlined"
                color={"error"}
                onClick={() => save("INACTIVE")}
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
    </Col>
}
