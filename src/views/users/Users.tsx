import React, {useEffect, useState} from "react";
import Col from "../../components/layouts/Col";
import Row from "../../components/layouts/Row";
import {Button} from "@mui/material";
import Grid from "../../components/table/Grid";
import {GridColDef} from "@mui/x-data-grid";
import {User} from "./models/UserModel";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import css from "./Users.module.css";
import {LoadingButton} from "@mui/lab";
import Window from "../../components/window/Window";
import RegisterUser from "./components/RegisterUser";
import UserDAO from "./dao/UserDAO";

export default function Users() {
    const [rows, setRows] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<{ open: boolean, user: User | undefined }>({
        open: false,
        user: undefined
    });
    const userDAO = new UserDAO();

    const columns: GridColDef<User>[] = [
        {field: "lastname", headerName: "Овог", flex: 1},
        {field: "firstname", headerName: "Нэр", flex: 1},
        {field: "username", headerName: "Нэвтрэх нэр", flex: 1},
        {field: "role", headerName: "Эрх", flex: 1},
        {
            field: "created", headerName: "Бүртгүүлсэн огноо", flex: 1,
            valueFormatter: (params) => new Date(params.value as number).toLocaleString(),
        }
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

    return <Col className={css.wrapper}>
        <Row gap={"5"}>
            <LoadingButton onClick={fetchUsers} loading={loading} variant="outlined" startIcon={<RefreshOutlinedIcon/>}>
                Шинэчлэх
            </LoadingButton>
            <Button onClick={() => setState({open: true, user: undefined})} variant={"contained"}>Шинээр
                бүртгэх</Button>
        </Row>
        <Grid
            columns={columns}
            rows={rows}
            onRowClick={(row) => setState({open: true, user: row})}
        />
        <Window open={state.open} onClose={() => setState({open: false, user: undefined})}>
            <RegisterUser user={state.user} onSave={() => setState({open: false, user: undefined})}/>
        </Window>
    </Col>
}
