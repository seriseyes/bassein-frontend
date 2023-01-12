import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import Login from "./views/auth/Login";
import {ToastContainer} from 'react-toastify';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Menu from "./views/menu/Menu";
import Users from "./views/users/Users";
import Customers from "./views/users/Customers";
import Schedules from "./views/schedule/Schedules";
import Report from "./views/report/Report";
import Billing from "./views/billing/Billing";
import SettingsTable from "./views/settings/SettingsTable";

const router = createBrowserRouter([
    {
        path: "login",
        element: <Login/>,
    },
    {
        path: "/",
        element: <Menu/>,
        children: [
            {
                path: "users",
                element: <Users/>
            },
            {
                path: "customers",
                element: <Customers/>
            },
            {
                path: "schedule",
                element: <Schedules/>
            },
            {
                path: "report",
                element: <Report/>
            },
            {
                path: "billing",
                element: <Billing/>
            },
            {
                path: "settings",
                element: <SettingsTable/>
            },
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <>
        <RouterProvider router={router}/>

        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"/>
    </>,
);
