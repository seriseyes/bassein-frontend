import {Outlet, useLocation, useNavigate} from "react-router-dom";
import Row from "../../components/layouts/Row";
import Col from "../../components/layouts/Col";
import css from "./Menu.module.css";
import {Button} from "@mui/material";
import useCookie from "../../hooks/useCookie";
import {ReactNode, useEffect} from "react";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import PoolOutlinedIcon from '@mui/icons-material/PoolOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {Location} from "@remix-run/router/history";
import {Role} from "../../enums/Role";

export default function Menu() {
    const role: string = useCookie("role") || "none";
    const navigate = useNavigate();

    useEffect(() => {
        if (role) navigate("users");
    }, [role]);

    if (!role) return <div>re-login</div>

    return <Row className={css.wrapper} gap={"15"}>
        <Col className={css.side} gap={"5"}>
            {(role === Role.RECEPTION || role === Role.ADMIN) &&
                <>
                    <MenuButton to={"users"} label={"Хэрэглэгчид"} icon={<GroupAddOutlinedIcon/>}/>
                    <MenuButton to={"customers"} label={"Үйлчлүүлэгчид"} icon={<PoolOutlinedIcon/>}/>
                    <MenuButton to={"schedule"} label={"Хуваарь"} icon={<CalendarMonthOutlinedIcon/>}/>
                    <MenuButton to={"report"} label={"Тайлан"} icon={<FormatListNumberedOutlinedIcon/>}/>
                    <MenuButton to={"billing"} label={"Үнэ, багц"} icon={<RequestQuoteOutlinedIcon/>}/>
                    <MenuButton to={"login"} label={"Гарах"} icon={<LogoutOutlinedIcon/>}/>
                </>
            }
        </Col>
        <Outlet/>
    </Row>
}

function MenuButton(props: { label: string, icon: ReactNode, to: string }) {
    const navigate = useNavigate();
    const location: Location = useLocation();

    return <Button
        size={"small"}
        style={{justifyContent: "flex-start", width: "160px"}}
        variant={location.pathname.substring(1, location.pathname.length) === props.to ? "outlined" :"text"}
        startIcon={props.icon}
        onClick={() => navigate(props.to)}
        color={props.label === "Гарах" ? "error" :undefined}
    >
        {props.label}
    </Button>
}
