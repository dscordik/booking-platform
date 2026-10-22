import {createBrowserRouter} from "react-router-dom";
import {
    ADMIN_BOOKINGS_PATH,
    ADMIN_SERVICES_PATH, ADMIN_SLOTS_PATH,
    HOME_PATH,
    LOGIN_PATH,
    MY_BOOKINGS_PATH,
    PROFILE_PATH,
    REGISTER_PATH,
    SERVICE_DETAIL_PATH,
    SERVICES_PATH
} from "../../Shared/config/routes";
import {LoginPage} from "../../Pages/LoginPage";
import {RegisterPage} from "../../Pages/RegisterPage";
import {ServicesPage} from "../../Pages/ServicesPage";
import {ServiceDetailPage} from "../../Pages/ServiceDetailPage";
import {ProfilePage} from "../../Pages/ProfilePage";
import {ProtectedRoute} from "../routes/protected-route";
import {Layout} from "../../Shared/layout/Layout";
import {MyBookingsPage} from "../../Pages/MyBookingsPage";
import {ProtectedAdminRoute} from "../routes/admin-route.tsx";
import {AdminServicesPage} from "../../Pages/AdminServicesPage/ui/AdminServicesPage.tsx";
import {AdminSlotsPage} from "../../Pages/AdminSlotsPage/ui/AdminSlotsPage.tsx";
import {AdminBookingsPage} from "../../Pages/AdminBookingsPage/ui/AdminBookingsPage.tsx";

export const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: LOGIN_PATH,
                element: <LoginPage/>
            },
            {
                path: REGISTER_PATH,
                element: <RegisterPage/>
            },
            {
                path: PROFILE_PATH,
                element: <ProtectedRoute><ProfilePage/></ProtectedRoute>
            },
            {
                path: HOME_PATH,
                element: <ServicesPage/>
            },
            {
                path: SERVICES_PATH,
                element: <ServicesPage/>
            },
            {
                path: SERVICE_DETAIL_PATH,
                element: <ServiceDetailPage/>
            },
            {
                path:MY_BOOKINGS_PATH,
                element:<ProtectedRoute><MyBookingsPage/></ProtectedRoute>
            },
            {
                path:ADMIN_SERVICES_PATH,
                element:<ProtectedAdminRoute><AdminServicesPage/></ProtectedAdminRoute>
            },
            {
                path:ADMIN_SLOTS_PATH,
                element:<ProtectedAdminRoute><AdminSlotsPage/></ProtectedAdminRoute>
            },
            {
                path:ADMIN_BOOKINGS_PATH,
                element:<ProtectedAdminRoute><AdminBookingsPage/></ProtectedAdminRoute>
            }
        ]
    },
])