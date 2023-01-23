import React, {useEffect, useState} from "react";
import Col from "../../components/layouts/Col";
import Row from "../../components/layouts/Row";
import {Button, TextField, Tooltip} from "@mui/material";
import Grid from "../../components/table/Grid";
import {GridColDef} from "@mui/x-data-grid";
import {User} from "./models/UserModel";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import css from "./Users.module.css";
import {LoadingButton} from "@mui/lab";
import Window from "../../components/window/Window";
import RegisterUser from "./components/RegisterUser";
import UserDAO from "./dao/UserDAO";
import LockResetIcon from '@mui/icons-material/LockReset';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {State} from "../../models/Response";
import {toast} from "react-toastify";

export default function Users() {
    const [rows, setRows] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<{ open: boolean, user: User | undefined }>({
        open: false,
        user: undefined
    });
    const [reset, setReset] = useState({open: false, username: "", newPassword: ""});
    const userDAO = new UserDAO();

    const columns: GridColDef<User>[] = [
        {field: "lastname", headerName: "Овог", flex: 1},
        {field: "firstname", headerName: "Нэр", flex: 1},
        {field: "username", headerName: "Нэвтрэх нэр", flex: 1},
        {field: "role", headerName: "Эрх", flex: 1},
        {
            field: "created", headerName: "Бүртгүүлсэн огноо", flex: 1,
            valueFormatter: (params) => new Date(params.value as number).toLocaleString(),
        },
        {
            field: "", headerName: "Үйлдэл", flex: 1,
            renderCell: (params) => <Row gap={"5"}>
                <Tooltip title={"Нууц үг солих"}>
                    <Button
                        onClick={() => setReset({open: true, username: params.row.username, newPassword: ""})}
                        variant={"outlined"}
                        color={"primary"}
                        size={"small"}
                    >
                        <LockResetIcon/>
                    </Button>
                </Tooltip>
                <Tooltip title={"Бүртгэл засварлах"}>
                    <Button
                        onClick={() => setState({open: true, user: params.row})}
                        variant={"outlined"}
                        color={"primary"}
                        size={"small"}
                    >
                        <ModeEditIcon/>
                    </Button>
                </Tooltip>
            </Row>,
        },
    ];

    useEffect(() => {
        fetchUsers()
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const users = await userDAO.findAllUser();
        setRows(users.data);
        setLoading(false);
    }

    const resetPassword = async () => {
        setLoading(true);
        const response = await userDAO.resetPassword(reset.username, reset.newPassword);
        if (response.state === State.SUCCESS) {
            setReset({open: false, username: "", newPassword: ""});
            toast.success("Нууц үг амжилттай солигдлоо.");
        }
        setLoading(false);
    }

    return <Col className={css.wrapper}>
        <Row gap={"5"}>
            <LoadingButton onClick={fetchUsers} loading={loading} variant="outlined" startIcon={<RefreshOutlinedIcon/>}>
                Шинэчлэх
            </LoadingButton>
            <Button onClick={() => setState({open: true, user: undefined})} variant={"contained"}>Шинээр
                бүртгэх
            </Button>
        </Row>
        <Grid
            columns={columns}
            rows={rows}
        />
        <Window open={state.open} onClose={() => setState({open: false, user: undefined})}>
            <RegisterUser user={state.user} onSave={() => setState({open: false, user: undefined})}/>
        </Window>
        <Window open={reset.open} onClose={() => setReset({open: false, username: "", newPassword: ""})}>
            <Col gap={"10"} style={{background: "white", padding: "10px", borderRadius: "10px"}}>
                <TextField label={"Шинэ нууц үг"} value={reset.newPassword} onChange={(e:any) => setReset({...reset, newPassword: e.target.value})}/>
                <LoadingButton onClick={resetPassword} loading={loading} variant="outlined">
                    Хадгалах
                </LoadingButton>
            </Col>
        </Window>
    </Col>
}
