import { Route, Routes } from "react-router-dom";
import CircadianApp from "./Circadian";
import CheeringApp from "./Cheering";
import RootRoutes from "./RootRoutes";

const AppRoutes = () => {
    return (
        <div>
            <CircadianApp />
            <CheeringApp />
            <Routes>
                <Route path="/" element={<RootRoutes />} />
            </Routes>
        </div>
    )
}

export default AppRoutes;