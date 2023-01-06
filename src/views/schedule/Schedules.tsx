import Col from "../../components/layouts/Col";
import {Button, Chip, Paper, Tooltip} from "@mui/material";
import Row from "../../components/layouts/Row";
import Window from "../../components/window/Window";
import React, {useEffect, useState} from "react";
import RegisterSchedule from "./components/RegisterSchedule";
import {Customer} from "../users/models/UserModel";
import css from "./Schedule.module.css";
import ScheduleDAO from "./dao/ScheduleDAO";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {LoadingButton} from "@mui/lab";

interface CustomerWrapper {
    customer: Customer;
    time: string;
}

interface ScheduleWrapper {
    day: number;
    dayName: string;
    exist: boolean;
    monday: CustomerWrapper[];
    tuesday: CustomerWrapper[];
    wednesday: CustomerWrapper[];
    thursday: CustomerWrapper[];
    friday: CustomerWrapper[];
    saturday: CustomerWrapper[];
    sunday: CustomerWrapper[];
}

export default function Schedules() {
    const [state, setState] = useState<ScheduleWrapper>({
        day: 0,
        dayName: "",
        exist: false,
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dao = new ScheduleDAO();

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        const response = await dao.findWeekSchedule();
        setState(response.data);
        setLoading(false);
    }

    return <Col className={css.wrapper} gap={"20"}>
        <Row gap={"5"}>
            <LoadingButton onClick={fetchSchedules} loading={loading} variant="outlined"
                           startIcon={<RefreshOutlinedIcon/>}>
                Шинэчлэх
            </LoadingButton>
            <Button onClick={() => setOpen(true)} variant={"contained"}>
                Шинэ төлөвлөгөө үүсгэх
            </Button>
        </Row>

        <div style={{fontWeight: "bold"}}>{state.dayName + " гарагт орох хуваарьтай үйлчлүүлэгч нар"}</div>

        {
            state.exist ?
                <Col gap={"10"}>
                    {state.day === 1 && <DayRow customerWrapper={state.monday}/>}
                    {state.day === 2 && <DayRow customerWrapper={state.tuesday}/>}
                    {state.day === 3 && <DayRow customerWrapper={state.wednesday}/>}
                    {state.day === 4 && <DayRow customerWrapper={state.thursday}/>}
                    {state.day === 5 && <DayRow customerWrapper={state.friday}/>}
                    {state.day === 6 && <DayRow customerWrapper={state.saturday}/>}
                    {state.day === 7 && <DayRow customerWrapper={state.sunday}/>}
                </Col>
                :
                <div>Хуваарь олдсонгүй</div>
        }

        <Window open={open} onClose={() => setOpen(false)}>
            <RegisterSchedule onSave={() => setOpen(false)}/>
        </Window>
    </Col>
}

function DayRow(props: { customerWrapper: CustomerWrapper[] }) {
    return <Paper className={css.dayWrapper} elevation={4}>
        <Row className={css.customers} gap={"10"}>
            {props.customerWrapper.map(wrapper =>
                <Tooltip title={"Цаг, регистр, овог нэр"}>
                    <Chip
                        label={wrapper.time + ", " + wrapper.customer.regNo + ", " + wrapper.customer.lastname.charAt(0) + ". " + wrapper.customer.firstname}
                    />
                </Tooltip>
            )}
        </Row>
    </Paper>
}
