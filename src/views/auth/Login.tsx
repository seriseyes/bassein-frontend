import {Button, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import css from "./Auth.module.css";
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import {login} from "./dao/AuthDAO";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {LoadingButton} from "@mui/lab";

export default function Login() {
    const [state, setState] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        localStorage.clear();
        toast.dismiss();
    }, []);

    const onLogin = async () => {
        setLoading(true);
        const token = await login(state.username, state.password);
        if (token) {
            toast(state.username + " амжилттай нэвтэрлээ.");
            localStorage.setItem("token", token.token);
            localStorage.setItem("role", token.role);
            localStorage.setItem("username", token.username);
            navigate("/program/users");
        }
        setLoading(false);
    };

    const onChange = (e: any) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    return <div className={css.wrap}>
        <TextField
            autoFocus={true}
            label={"Нэвтрэх нэр"}
            value={state.username}
            onChange={onChange}
            name={"username"}
            onKeyDown={(e) => (e.key === 'Enter') && onLogin()}
        />
        <TextField
            label={"Нууц үг"}
            value={state.password}
            onChange={onChange}
            name={"password"}
            type={"password"}
            onKeyDown={(e) => (e.key === 'Enter') && onLogin()}
        />
        <LoadingButton
            variant={"outlined"}
            endIcon={<NavigateNextOutlinedIcon/>}
            onClick={onLogin}
            loading={loading}
        >
            Нэвтрэх
        </LoadingButton>
    </div>
}
