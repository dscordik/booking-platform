import {createBrowserRouter} from "react-router-dom";
import {HOME_PATH, LOGIN_PATH, REGISTER_PATH} from "../../Shared/config/routes.ts";
import {LoginPage} from "../../Pages/LoginPage";
import {RegisterPage} from "../../Pages/RegisterPage";
import {ProtectedRoute} from "../routes/protected-route.tsx";
import {ProfilePage} from "../../Pages/ProfilePage";

export const router = createBrowserRouter([
    {
        path:LOGIN_PATH,
        element:<LoginPage/>
    },
    {
        path:REGISTER_PATH,
        element:<RegisterPage/>
    },
    {
        path:HOME_PATH,
        element:<ProtectedRoute><ProfilePage/></ProtectedRoute>
    }
])