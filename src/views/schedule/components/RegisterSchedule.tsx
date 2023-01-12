import React, {useEffect, useState} from "react";
import {Schedule} from "../models/ScheduleModels";
import Col from "../../../components/layouts/Col";
import {Autocomplete, Badge, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Settings} from "../../../models/Settings";
import SettingsDAO from "../../../dao/SettingsDAO";
import Loading from "../../../components/loading/Loading";
import SaveIcon from "@mui/icons-material/Save";
import {LoadingButton} from "@mui/lab";
import ScheduleDAO from "../dao/ScheduleDAO";
import {State} from "../../../models/Response";
import UserDAO from "../../users/dao/UserDAO";
import {User} from "../../users/models/UserModel";

interface Props {
    schedule: Schedule;
    onSave?: () => void;
}

export default function RegisterSchedule(props: Props) {
    const [state, setState] = useState<Schedule>(props.schedule);
    const [discounts, setDiscounts] = useState<Settings[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [swimTypes, setSwimTypes] = useState<Settings[]>([]);
    const [loading, setLoading] = useState(false);
    const dao = new ScheduleDAO();
    const settingsDAO = new SettingsDAO();
    const userDAO = new UserDAO();

    useEffect(() => {
        fetchDiscounts();
        fetchTeachers();
        fetchSwimTypes();
    }, []);

    const fetchDiscounts = async () => {
        setLoading(true);
        const response = await settingsDAO.findAllByName("discount");
        setDiscounts(response.data);
        setLoading(false);
    }

    const fetchTeachers = async () => {
        setLoading(true);
        const response = await userDAO.findAllTeacher();
        setTeachers(response.data);
        setLoading(false);
    }

    const fetchSwimTypes = async () => {
        setLoading(true);
        const response = await settingsDAO.findAllByName("swimType");
        setSwimTypes(response.data);
        setLoading(false);
    }

    const save = async () => {
        setLoading(true);
        const response = await dao.save(state);
        if (response.state === State.SUCCESS) props.onSave && props.onSave();
        setLoading(false);
    }

    return <Col gap={"15"}>
        <Autocomplete
            value={state.swimType}
            options={swimTypes}
            renderInput={(params) => <TextField {...params} label="Төрөл"/>}
            disableClearable={false}
            onChange={(e, value) => setState({...state, swimType: value || undefined})}
        />
        <Autocomplete
            value={state.discount}
            options={discounts}
            renderInput={(params) => <TextField {...params} label="Хөнгөлөлт"/>}
            onChange={(e, value) => setState({...state, discount: value || undefined})}
        />

        {
            state.swimType && state.swimType.has
            && <FormControl>
                <InputLabel>Багш</InputLabel>
                <Select
                    value={state.teacher}
                    label={"Багш"}
                    onChange={(e) => setState({...state, teacher: e.target.value as User})}
                >
                    {teachers.map((teacher, index) => (
                        // @ts-ignore
                        <MenuItem key={index} value={teacher}>
                            {teacher.lastname.charAt(0) + ". " + teacher.firstname}
                        </MenuItem>))}
                </Select>
            </FormControl>
        }
        <TextField type={"number"}
                   label={"Хэдэн удаа явах"}
                   value={state.day}
                   onChange={(e: any) => setState({...state, day: e.target.value})}
                   name={"day"}
        />

        <Badge color={"info"} badgeContent={!state.swimType ? "": <div>Үнэ: {state.swimType.value - (state.discount ? state.discount.value : 0)}</div>}>
            <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon/>}
                variant="outlined"
                onClick={save}
                style={{width: "100%"}}
            >
                Хадгалах
            </LoadingButton>
        </Badge>

        <Loading isLoading={loading}/>
    </Col>
}
