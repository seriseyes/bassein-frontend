import React, {useEffect, useState} from "react";
import UserDAO from "./dao/UserDAO";
import {GridColDef} from "@mui/x-data-grid";
import Col from "../../components/layouts/Col";
import css from "./Users.module.css";
import Row from "../../components/layouts/Row";
import {LoadingButton} from "@mui/lab";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {Button, InputAdornment, TextField} from "@mui/material";
import Grid from "../../components/table/Grid";
import Window from "../../components/window/Window";
import {Customer} from "./models/UserModel";
import RegisterCustomer from "./components/RegisterCustomer";
import SearchIcon from '@mui/icons-material/Search';

export default function Customers() {
    const [rows, setRows] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<{ open: boolean, customer: Customer | undefined }>({
        open: false,
        customer: undefined
    });
    const [regNo, setRegNo] = useState<string>("");
    const userDAO = new UserDAO();

    const columns: GridColDef<Customer>[] = [
        {field: "lastname", headerName: "Овог", flex: 1},
        {field: "firstname", headerName: "Нэр", flex: 1},
        {field: "regNo", headerName: "Регистрийн дугаар", flex: 1},
        {
            field: "created", headerName: "Бүртгүүлсэн огноо", flex: 1,
            valueFormatter: (params) => new Date(params.value as number).toLocaleString(),
        }
    ];

    useEffect(() => {
        if (regNo.length === 0) fetchCustomers()
    }, [regNo]);

    const fetchCustomers = async () => {
        setLoading(true);
        const customers = await userDAO.findAllCustomerByRegNo(regNo);
        setRows(customers.data);
        setLoading(false);
    }

    return <Col className={css.wrapper}>
        <Row gap={"5"}>
            <LoadingButton onClick={fetchCustomers} loading={loading} variant="outlined"
                           startIcon={<RefreshOutlinedIcon/>}>
                Шинэчлэх
            </LoadingButton>
            <Button onClick={() => setState({open: true, customer: undefined})} variant={"contained"}>
                Шинээр бүртгэх
            </Button>
            <TextField
                size={"small"}
                placeholder={"Регистр..."}
                onChange={(e) => setRegNo(e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter') && fetchCustomers()}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize={"small"} />
                        </InputAdornment>
                    ),
                }}
            />
        </Row>
        <Grid
            columns={columns}
            rows={rows}
            onRowClick={(row) => setState({open: true, customer: row})}
        />
        <Window open={state.open} onClose={() => setState({open: false, customer: undefined})}>
            <RegisterCustomer customer={state.customer} onSave={() => setState({open: false, customer: undefined})}/>
        </Window>
    </Col>
}
