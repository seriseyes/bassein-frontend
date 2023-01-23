import {Day, Schedule, TimeTable} from "../models/ScheduleModels";
import css from "./ScheduleComponent.module.css";
import Col from "../../../components/layouts/Col";
import {Button, Chip, TextField, Tooltip} from "@mui/material";
import React, {useState} from "react";
import Row from "../../../components/layouts/Row";
import SearchIcon from '@mui/icons-material/Search';
import {LoadingButton} from "@mui/lab";
import ScheduleDAO from "../dao/ScheduleDAO";
import AddIcon from '@mui/icons-material/Add';
import RegisterSchedule from "./RegisterSchedule";
import CloseIcon from '@mui/icons-material/Close';
import {toast} from "react-toastify";
import {State} from "../../../models/Response";
import Window from "../../../components/window/Window";

interface Props {
    timeTable?: TimeTable;
    onSave?: () => void;
    day?: Day;
}

export default function RegisterTimeTable(props: Props) {
    const [regNo, setRegNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<Schedule[]>();
    const [show, setShow] = useState(false);
    const [locker, setLocker] = useState<{ open: boolean, schedule: null | Schedule, number: string }>({
        open: false,
        schedule: null,
        number: ""
    });

    const dao = new ScheduleDAO();

    const fetchSchedule = async () => {
        setLoading(true);
        const response = await dao.findAllByCustomerRegNo(regNo);
        setState(response.data);
        setLoading(false);
    }

    const save = async () => {
        if (!locker.schedule) {
            console.error("Schedule is null");
            return;
        }

        if (!locker.schedule.id) {
            console.error("Schedule id is null");
            return;
        }
        if (locker.schedule.day === locker.schedule.enter) {
            toast.error("Уг хуваарийн эрх дууссан байна");
            return;
        }
        if (!props.day) {
            toast.error("Цаг сонгоогүй байна");
            return;
        }

        const response = await dao.markAsCame(locker.schedule.id, locker.number, props.day.start, props.day.end);
        if (response.state === State.SUCCESS) {
            toast.success(response.message);
            props.onSave && props.onSave();
            setLocker({open: false, schedule: null, number: ""});
        }
    }

    return <Col className={css.wrapper}>
        {
            !state
                ? <Row>
                    <Tooltip title={"Монгол үсэг ашиглан бичнэ үү."}>
                        <TextField label={"Регистер эсвэл утас"}
                                   value={regNo}
                                   onChange={(e: any) => setRegNo(e.target.value)}
                                   onKeyDown={(e) => (e.key === 'Enter') && fetchSchedule()}
                                   placeholder={"AA00112233"}/>
                    </Tooltip>
                    <LoadingButton
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SearchIcon/>}
                        variant="outlined"
                        onClick={fetchSchedule}
                    >
                        Хайх
                    </LoadingButton>
                </Row>
                : <Col gap={"10"}>
                    <Chip
                        label={state[0].customer?.lastname.charAt(0) + ". " + state[0].customer?.firstname + ", " + state[0].customer?.regNo + ", " + state[0].customer?.phone}
                    />

                    {
                        state[0].id !== null ?
                            <>
                                <strong>Бүртгэлтэй эрхүүд</strong>
                                {state?.map((el, index) => <Tooltip title={"Үлдсэн эрх, эрх үүсгэсэн огноо"}>
                                    <Chip
                                        key={index}
                                        label={el.enter + "/" + el.day + (el.created ? ", " + new Date(el.created).toLocaleTimeString() : "")}
                                        onClick={() => {
                                            if (el.day === el.enter) {
                                                toast.error("Уг хуваарийн эрх дууссан байна");
                                            } else setLocker({open: true, schedule: el, number: ""});
                                        }}
                                        color={el.day === el.enter ? 'error' : 'default'}
                                    />
                                </Tooltip>)}
                            </>
                            : <strong>Бүртгэлтэй эрх олдсонгүй</strong>
                    }

                    <Button
                        startIcon={show ? <CloseIcon/> : <AddIcon/>}
                        variant={"outlined"}
                        color={show ? "error" : "primary"}
                        onClick={() => setShow(!show)}
                    >
                        {show ? "Болих" : "Шинээр эрх үүсгэх"}
                    </Button>

                    {show && <RegisterSchedule schedule={{customer: state[0].customer, day: 0, enter: 0}} onSave={() => {
                        setShow(false);
                        fetchSchedule();
                    }}/>}
                </Col>
        }
        <Window open={locker.open} onClose={() => setLocker({open: false, schedule: null, number: ""})}>
            <Col className={css.wrapper} gap={"10"}>
                <TextField
                    label={"Локерийн дугаар"}
                    value={locker.number}
                    onChange={(e: any) => setLocker({...locker, number: e.target.value})}
                />
                <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    variant="outlined"
                    onClick={save}
                    onKeyDown={(e) => (e.key === 'Enter') && save()}
                    sx={{width: "100%"}}
                >
                    Хадгалах
                </LoadingButton>
            </Col>
        </Window>
    </Col>
}
