import { Route, Routes } from "react-router-dom"
import CircadianApp from "./Circadian"
import RootRoutes from "./RootRoutes"

const AppRoutes = () => {
    return (
        <div>
            <CircadianApp />
            <Routes>
                <Route path="/" element={<RootRoutes />} />
            </Routes>
        </div>
    )
}

export default AppRoutes;