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
import {toast} from "react-toastify";
import {State} from "../../models/Response";
import AddIcon from '@mui/icons-material/Add';
import UnPlanned from "./components/UnPlanned";

interface CustomerWrapper {
    id: number;
    customer: Customer;
    time: string;
    came: boolean;
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
    const [modal, setModal] = useState({
        open: false,
        which: "RegisterSchedule"
    });
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

    const onClick = async (wrapper: CustomerWrapper) => {
        if (wrapper.came) return;

        const response = await dao.markAsCame(wrapper.id);
        if (response.state === State.SUCCESS) {
            toast.success(response.message);
            fetchSchedules();
        } else {
            toast.error(response.message);
        }
    }

    return <Col className={css.wrapper} gap={"20"}>
        <Row gap={"5"}>
            <LoadingButton onClick={fetchSchedules} loading={loading} variant="outlined"
                           startIcon={<RefreshOutlinedIcon/>}>
                Шинэчлэх
            </LoadingButton>
            <Button onClick={() => setModal({open: true, which: "RegisterSchedule"})} variant={"contained"}>
                Шинэ төлөвлөгөө үүсгэх
            </Button>
        </Row>

        <div style={{fontWeight: "bold"}}>{state.dayName + " гарагт орох хуваарьтай үйлчлүүлэгч нар"}</div>

        <Button
            onClick={() => setModal({open: true, which: "UnPlanned"})}
            variant={"outlined"} size={"small"}
            startIcon={<AddIcon/>}
            sx={{width: "300px"}}
        >
            Өнөөдөр хуваарьгүй үйлчлүүлэгч бүртгэх
        </Button>

        {
            state.exist ?
                <Col gap={"10"}>
                    {state.day === 1 && <DayRow customerWrapper={state.monday} onClick={onClick}/>}
                    {state.day === 2 && <DayRow customerWrapper={state.tuesday} onClick={onClick}/>}
                    {state.day === 3 && <DayRow customerWrapper={state.wednesday} onClick={onClick}/>}
                    {state.day === 4 && <DayRow customerWrapper={state.thursday} onClick={onClick}/>}
                    {state.day === 5 && <DayRow customerWrapper={state.friday} onClick={onClick}/>}
                    {state.day === 6 && <DayRow customerWrapper={state.saturday} onClick={onClick}/>}
                    {state.day === 7 && <DayRow customerWrapper={state.sunday} onClick={onClick}/>}
                </Col>
                :
                <div>Хуваарь олдсонгүй</div>
        }

        <Window open={modal.open} onClose={() => setModal({open: false, which: ""})}>
            {modal.which === "RegisterSchedule"
                ? <RegisterSchedule onSave={() => setModal({open: false, which: ""})}/>
                : <UnPlanned onSave={() => setModal({open: false, which: ""})}/>
            }
        </Window>
    </Col>
}

function DayRow(props: { customerWrapper: CustomerWrapper[], onClick: (wrapper: CustomerWrapper) => void }) {
    return <Paper className={css.dayWrapper} elevation={4}>
        <Row className={css.customers} gap={"10"}>
            {props.customerWrapper.map(wrapper =>
                <Tooltip title={wrapper.came ? "Ирсэн" : "Энд дарж ирсэн гэж тэмдэглэх"}>
                    <Chip
                        className={`${css.chip} ${wrapper.came ? css.came : ""}`}
                        onClick={() => props.onClick(wrapper)}
                        label={wrapper.time + ", " + wrapper.customer.regNo + ", " + wrapper.customer.lastname.charAt(0) + ". " + wrapper.customer.firstname}
                    />
                </Tooltip>
            )}
        </Row>
    </Paper>
}
