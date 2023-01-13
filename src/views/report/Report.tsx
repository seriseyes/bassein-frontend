import Col from "../../components/layouts/Col";
import Row from "../../components/layouts/Row";
import React, {useState} from "react";
import css from "./Report.module.css";
import Person3Icon from '@mui/icons-material/Person3';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {TextField, Tooltip} from "@mui/material";
import {Dayjs} from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LoadingButton} from "@mui/lab";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import {PrintDAO} from "./dao/PrintDAO";
import {toast} from "react-toastify";
import UserDAO from "../users/dao/UserDAO";
import {State} from "../../models/Response";

export default function Report() {
    const [state, setState] = useState<"bassein" | "person">("bassein");
    const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
    const [dateTo, setDateTo] = useState<Dayjs | null>(null);
    const [regNo, setRegNo] = useState("");
    const [loading, setLoading] = useState(false);
    const dao = new PrintDAO();
    const userDAO = new UserDAO();

    const onClick = (type: "bassein" | "person") => {
        setState(type);
    }

    const print = async () => {
        setLoading(true);
        if (state === "bassein") {
            if (!dateFrom || !dateTo) {
                toast.error("Огноо сонгоогүй байна");
                setLoading(false);
                return;
            }
            window.open(dao.getBasseinUrl(dateFrom?.year() + "-" + (dateFrom?.month() + 1) + "-" + dateFrom?.date(), dateTo?.year() + "-" + (dateTo?.month() + 1) + "-" + dateTo?.date()), '_blank', 'noreferrer');
        } else {
            if (!regNo) {
                toast.error("Регистерийн дугаар бичнэ үү");
                setLoading(false);
                return;
            }
            const response = await userDAO.existByRegNo(regNo);
            if (response.state === State.SUCCESS) window.open(dao.getPersonUrl(regNo), '_blank', 'noreferrer');
        }


        setLoading(false);
    }

    return <Col style={{padding: "20px"}} gap={"20"}>
        <strong>Тайлангаа сонгоно уу</strong>
        <Row gap={"20"}>
            <HugeButton
                active={state === 'bassein'}
                caption={"Бассейны хэмжээнд"}
                icon={<PeopleAltIcon sx={{fontSize: "40px"}}/>}
                onClick={onClick}
                name={"bassein"}
            />
            <HugeButton
                active={state === 'person'}
                caption={"Хүн тус бүрээр"}
                icon={<Person3Icon sx={{fontSize: "40px"}}/>}
                onClick={onClick}
                name={"person"}
            />
        </Row>

        {
            <>
                {state === 'bassein'
                    ? <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Row style={{alignItems: "center"}} gap={"10"}>
                            <DatePicker
                                label="Эхлэх"
                                value={dateFrom}
                                inputFormat={"YYYY-MM-DD"}
                                onChange={(newValue) => {
                                    setDateFrom(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <div>-</div>
                            <DatePicker
                                label="Дуусах"
                                value={dateTo}
                                inputFormat={"YYYY-MM-DD"}
                                onChange={(newValue) => {
                                    setDateTo(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Row>
                    </LocalizationProvider>
                    : state === 'person' ?
                        <Tooltip title={"Монгол үсэг ашиглан бичнэ үү."}>
                            <TextField label={"Регистрийн дугаар"} value={regNo} name={"regNo"}
                                       onChange={(e: any) => setRegNo(e.target.value)}
                                       placeholder={"AA00112233"}/>
                        </Tooltip>
                        : null}

                <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<LocalPrintshopIcon/>}
                    variant="outlined"
                    onClick={print}
                >
                    Хэвлэх
                </LoadingButton>
            </>
        }

    </Col>
}

function HugeButton(props: { caption: string, icon: React.ReactNode, active: boolean, onClick: (type: "bassein" | "person") => void, name: "bassein" | "person" }) {
    return <button onClick={() => props.onClick(props.name)}
                   className={`${css.button} ${props.active ? css.active : ""}`}>
        <div className={css.icon}>{props.icon}</div>
        <div className={css.caption}>{props.caption}</div>
    </button>
}
