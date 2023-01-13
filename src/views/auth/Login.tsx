import {Button, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import css from "./Auth.module.css";
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import {login} from "./dao/AuthDAO";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function Login() {
    const [state, setState] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        toast.dismiss();
    }, []);

    const onLogin = async () => {
        const token = await login(state.username, state.password);
        if (token) {
            toast(state.username + " амжилттай нэвтэрлээ.");
            navigate("/program/users");
        }
    };

    const onChange = (e: any) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    return <div className={css.wrap}>
        <TextField label={"Нэвтрэх нэр"} value={state.username} onChange={onChange} name={"username"}/>
        <TextField label={"Нууц үг"} value={state.password} onChange={onChange} name={"password"} type={"password"}/>
        <Button variant={"outlined"} endIcon={<NavigateNextOutlinedIcon/>} onClick={onLogin}>Нэвтрэх</Button>
    </div>
}
