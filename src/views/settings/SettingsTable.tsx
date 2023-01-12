import {GridColDef} from "@mui/x-data-grid";
import {User} from "../users/models/UserModel";
import {Settings} from "../../models/Settings";
import React, {useEffect, useState} from "react";
import SettingsDAO from "../../dao/SettingsDAO";
import Col from "../../components/layouts/Col";
import css from "../users/Users.module.css";
import Row from "../../components/layouts/Row";
import {LoadingButton} from "@mui/lab";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {Button} from "@mui/material";
import Grid from "../../components/table/Grid";
import Window from "../../components/window/Window";
import RegisterSettings from "./components/RegisterSettings";

export default function SettingsTable() {
    const [rows, setRows] = useState<Settings[]>([]);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<{ open: boolean, settings: Settings | undefined }>({
        open: false,
        settings: undefined
    });
    const [name, setName] = useState("discount");
    const dao = new SettingsDAO();

    useEffect(() => {
        fetchSettings(name);
    }, [name]);

    const fetchSettings = async (name: string) => {
        setLoading(true);
        const response = await dao.findAllByName(name);
        setRows(response.data);
        setLoading(false);
    }

    const columns: GridColDef<Settings>[] = [
        {field: "label", headerName: "Нэр", flex: 1},
        {field: "value", headerName: name === 'discount' ? "Хөнгөлөлт" : 'Үнэ', flex: 1},
        {field: "note", headerName: "Дэлгэрэнгүй тайлбар", flex: 1},
        {
            field: "user", headerName: "Бүртгэсэн хэрэглэгч", flex: 1,
            valueFormatter: (params) => {
                const user = params.value as User;
                if (!user) return "";
                return user.lastname.charAt(0) + ". " + user.firstname
            },
        },
        {
            field: "created", headerName: "Бүртгэсэн огноо", flex: 1,
            valueFormatter: (params) => new Date(params.value as number).toLocaleString(),
        }
    ];

    return <Col className={css.wrapper} gap={"10"}>
        <Row gap={"5"}>
            <LoadingButton onClick={() => fetchSettings(name)} loading={loading} variant="outlined"
                           startIcon={<RefreshOutlinedIcon/>}>
                Шинэчлэх
            </LoadingButton>
            <Button onClick={() => setState({open: true, settings: undefined})} variant={"contained"}>
                Шинээр бүртгэх
            </Button>
        </Row>

        <Row gap={"5"}>
            <Button
                variant={name === 'swimType' ? 'outlined' : 'text'}
                color={name === 'swimType' ? 'success' : 'inherit'}
                onClick={() => setName("swimType")}>
                Төрөл
            </Button>
            <Button
                variant={name === 'discount' ? 'outlined' : 'text'}
                color={name === 'discount' ? 'success' : 'inherit'}
                onClick={() => setName("discount")}>
                Хөнгөлөлт
            </Button>
        </Row>

        <Grid
            columns={columns}
            rows={rows}
            onRowClick={(row) => setState({open: true, settings: row})}
        />
        <Window open={state.open} onClose={() => setState({open: false, settings: undefined})}>
            <RegisterSettings name={name} settings={state.settings}
                              title={name === 'swimType' ? (`Төрөл ${state.settings ? 'засах' : 'шинээр бүртгэх'}`) : name === 'discount' ? (`Хөнгөлөлт ${state.settings ? 'засах' : 'шинээр бүртгэх'}`) : ''}
                              onSave={() => setState({open: false, settings: undefined})}/>
        </Window>
    </Col>
}
