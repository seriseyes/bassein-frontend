import css from "./ScheduleComponent.module.css";
import Col from "../../../components/layouts/Col";
import React, {useEffect, useState} from "react";
import {Schedule, ScheduleDto, TimePer} from "../models/ScheduleModels";
import {Customer} from "../../users/models/UserModel";
import ScheduleDAO from "../dao/ScheduleDAO";
import {Badge, Chip, Divider, TextField, Tooltip} from "@mui/material";
import {State} from "../../../models/Response";
import UserDAO from "../../users/dao/UserDAO";
import {toast} from "react-toastify";
import Row from "../../../components/layouts/Row";
import {Days, Weeks} from "../../../models/Weeks";
import SaveIcon from "@mui/icons-material/Save";
import {LoadingButton} from "@mui/lab";

interface Props {
    schedule?: Schedule;
    onSave?: () => void;
}

export default function RegisterSchedule(props: Props) {
    const [state, setState] = useState<ScheduleDto>(props.schedule ?
        {
            customers: props.schedule.customer ? [props.schedule.customer] : [],
            schedule: props.schedule
        } : {
            customers: [],
            schedule: {
                day: 0,
                enter: 0,
                enterDates: [],
                plans: []
            }
        });
    const [loading, setLoading] = useState(false);
    const [regNo, setRegNo] = useState("");
    const dao = new ScheduleDAO();
    const userDAO = new UserDAO();

    const save = async () => {
        setLoading(true);
        await dao.save(state);
        setLoading(false);
    }

    const onDelete = (customer: Customer) => {
        setState({
            ...state,
            customers: state.customers.filter(c => c.id !== customer.id)
        });
    }

    const onAdd = async () => {
        const response = await userDAO.findCustomerByRegNo(regNo);
        if (response.state === State.SUCCESS) {
            toast.success(response.message);
            setState({
                ...state,
                customers: [...state.customers, response.data]
            });
            setRegNo("");
        }
    }

    const onChange = (e: any) => {
        setState({
            ...state,
            schedule: {
                ...state.schedule,
                [e.target.name]: e.target.value
            }
        });
    }

    const onPlanChange = (plans: TimePer[]) => {
        setState({
            ...state,
            schedule: {
                ...state.schedule,
                plans
            }
        });
    }

    return <Col className={css.wrapper} gap={"20"}>
        <Row gap={"15"}>
            <Col gap={"10"}>
                <Tooltip title={"Монголоор регистрийн дугаар бичиж \"Enter\" товчлуур дарж хайна уу"}>
                    <TextField label={"Регистрийн дугаар"} value={regNo} onChange={(e) => setRegNo(e.target.value)}
                               name={"regNo"}
                               placeholder={"AA00112233"}
                               onKeyDown={(e) => (e.key === 'Enter') && onAdd()}
                    />
                </Tooltip>

                {state.customers.length > 0 &&
                    <>
                        <div style={{fontWeight: "bold", marginTop: "8px"}}>Төлөвлөгөөнд хамаарах
                            үйлчлүүлэгч{state.customers.length > 1 ? "ид" : ""}</div>
                        <Col gap={"5"}>
                            {state.customers.map(customer => <CustomerProfile customer={customer}
                                                                              onDelete={onDelete}/>)}
                        </Col>
                    </>
                }
            </Col>
            <Divider orientation="vertical" variant="middle" flexItem/>

            {state.customers.length > 0 &&
                <Col gap={"18"}>
                    <TextField sx={{width: 200}}
                               label={"Нийт хэдэн удаа явах"}
                               value={state.schedule.day}
                               onChange={onChange}
                               type={"number"}
                               name={"day"}/>
                    <div style={{fontWeight: "bold"}}>
                        7 хоногийн аль аль өдөр, хэдэн цагаас явах вэ?
                    </div>
                    <Plan plans={state.schedule.plans} onChange={onPlanChange}/>
                </Col>
            }
        </Row>

        {state.customers.length > 0 &&
            <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon/>}
                variant="outlined"
                onClick={save}
                sx={{width: "200px"}}
            >
                Хадгалах
            </LoadingButton>
        }
    </Col>
}

function CustomerProfile(props: { customer: Customer, onDelete: (customer: Customer) => void }) {
    return <Chip
        label={props.customer.regNo + " " + props.customer.lastname.charAt(0) + ". " + props.customer.firstname}
        onDelete={() => props.onDelete(props.customer)}
    />
}

function Plan(props: { plans: TimePer[], onChange: (plans: TimePer[]) => void }) {

    const mapper = (weekNum: number) => props.plans.filter(f => f.week === weekNum).map(m => m.time)[0] || "";

    const [state, setState] = useState<Weeks>({
        monday: {day: Days.monday, number: 1, value: mapper(1)},
        tuesday: {day: Days.tuesday, number: 2, value: mapper(2)},
        wednesday: {day: Days.wednesday, number: 3, value: mapper(3)},
        thursday: {day: Days.thursday, number: 4, value: mapper(4)},
        friday: {day: Days.friday, number: 5, value: mapper(5)},
        saturday: {day: Days.saturday, number: 6, value: mapper(6)},
        sunday: {day: Days.sunday, number: 7, value: mapper(7)}
    });
    const [first, setFirst] = useState(true);

    useEffect(() => {
        if (first) {
            setFirst(false);
        } else {
            const timePerArray: TimePer[] = [];

            if (state.monday.value !== "") timePerArray.push({time: state.monday.value, week: 1});
            if (state.tuesday.value !== "") timePerArray.push({time: state.tuesday.value, week: 2});
            if (state.wednesday.value !== "") timePerArray.push({time: state.wednesday.value, week: 3});
            if (state.thursday.value !== "") timePerArray.push({time: state.thursday.value, week: 4});
            if (state.friday.value !== "") timePerArray.push({time: state.friday.value, week: 5});
            if (state.saturday.value !== "") timePerArray.push({time: state.saturday.value, week: 6});
            if (state.sunday.value !== "") timePerArray.push({time: state.sunday.value, week: 7});

            props.onChange(timePerArray);
        }
    }, [state]);

    const Time = (timeProps: { title: string, day: Days }) => {

        return <Badge badgeContent={timeProps.title} color="primary">
            <TextField
                type="time"
                // @ts-ignore
                value={state[timeProps.day].value}
                InputLabelProps={{shrink: true}}
                inputProps={{step: 300, /*5 min*/}}
                sx={{width: 135}}
                onChange={(e) => setState({
                    ...state,
                    [timeProps.day]: {...state[timeProps.day], value: e.target.value}
                })}
            />
        </Badge>
    }

    return <Row gap={"30"}>
        <Col gap={"18"}>
            <Time title={"Даваа"} day={Days.monday}/>
            <Time title={"Мягмар"} day={Days.tuesday}/>
            <Time title={"Лхагва"} day={Days.wednesday}/>
        </Col>
        <Col gap={"18"}>
            <Time title={"Пүрэв"} day={Days.thursday}/>
            <Time title={"Баасан"} day={Days.friday}/>
        </Col>
        <Col gap={"18"}>
            <Time title={"Бямба"} day={Days.saturday}/>
            <Time title={"Ням"} day={Days.sunday}/>
        </Col>
    </Row>
}
