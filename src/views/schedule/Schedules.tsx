import Col from "../../components/layouts/Col";
import {Autocomplete, Button, TextField} from "@mui/material";
import Row from "../../components/layouts/Row";
import Window from "../../components/window/Window";
import React, {useEffect, useState} from "react";
import css from "./Schedule.module.css";
import ScheduleDAO from "./dao/ScheduleDAO";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {LoadingButton} from "@mui/lab";
import Grid from "../../components/table/Grid";
import {Day, TimeTable, TimeTableDto} from "./models/ScheduleModels";
import {GridColDef} from "@mui/x-data-grid";
import RegisterTimeTable from "./components/RegisterTimeTable";
import ScheduleAction from "./components/ScheduleAction";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function Schedules() {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<{ open: boolean, timeTable: TimeTable | undefined }>({
        open: false,
        timeTable: undefined
    });
    const [rows, setRows] = useState<TimeTableDto[]>([]);
    const [days, setDays] = useState<{ day: Day, days: Day[] }>();

    const columns: GridColDef<TimeTableDto>[] = [
        {field: "fullname", headerName: "Нэр", flex: 1},
        {field: "age", headerName: "Нас", flex: 1},
        {field: "gender", headerName: "Хүйс", flex: 1},
        {field: "type", headerName: "Төрөл", flex: 1},
        {field: "schedule", headerName: "Оролт", flex: 1},
        {field: "teacher", headerName: "Багш", flex: 1},
        {field: "targetTime", headerName: "Орсон цаг", flex: 1},
        {field: "locker", headerName: "Локер", flex: 1},
        {
            field: "", headerName: "Үйлдэл", flex: 1,
            renderCell: (params) => <Row gap={"5"}>
                <Button
                    onClick={() => setState({open: false, timeTable: params.row.timeTable})}
                    variant={"outlined"}
                    color={"error"}
                    size={"small"}
                >
                    Цуцлах
                </Button>
            </Row>
        }
    ];
    const dao = new ScheduleDAO();

    useEffect(() => {
        fetchTimes();
    }, []);

    useEffect(() => {
        if (days && days.day) fetchTimeTables();
    }, [days]);

    const fetchTimeTables = async () => {
        setLoading(true);
        if (days) {
            const customers = await dao.findAllTodayTimeTable(days.day.start, days.day.end);
            setRows(customers.data);
        }
        setLoading(false);
    }

    const fetchTimes = async () => {
        const response = await dao.findAllNowTime();
        const tData = response.data as Day[];
        const closes = tData.filter(f => f.close);
        setDays({
            day: closes[1] || closes[0],
            days: tData.filter((value, index, array) => array.indexOf(value) === index)
        });
    }

    return <Col className={css.wrapper}>
        <Row gap={"5"}>
            <LoadingButton onClick={fetchTimeTables} loading={loading} variant="outlined"
                           startIcon={<RefreshOutlinedIcon/>}>
                Шинэчлэх
            </LoadingButton>
            <Button onClick={() => setState({open: true, timeTable: undefined})} variant={"contained"}>
                Бүртгэх
            </Button>
            {
                days
                    ? <Autocomplete
                        value={days.day}
                        options={days.days}
                        renderInput={(params) => <TextField {...params} label="Цаг сонгох"/>}
                        disableClearable={true}
                        style={{width: "155px"}}
                        onChange={(e, value) => setDays({...days, day: value})}
                    />
                    : <div>Ажлын цаг дууссан байна</div>
            }
        </Row>
        <Grid
            columns={columns}
            rows={rows}
        />
        <Window open={state.open} onClose={() => setState({open: false, timeTable: undefined})}>
            <RegisterTimeTable timeTable={state.timeTable}
                               day={days?.day}
                               onSave={() => {
                                   setState({open: false, timeTable: undefined});
                                   fetchTimeTables();
                               }}/>
        </Window>
        {state.timeTable &&
            <Window open={true} onClose={() => setState({open: false, timeTable: undefined})}>
                <ScheduleAction timeTable={state.timeTable}
                                onSave={() => {
                                    setState({open: false, timeTable: undefined});
                                    fetchTimeTables();
                                }}
                                onClose={() => setState({open: false, timeTable: undefined})}
                />
            </Window>
        }
    </Col>
}
