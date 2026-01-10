import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Fotter from "./Fotter/Fotter";
import AppRoutes from "../../../routes/AppRoutes";
import HeaderX from "./HeaderX/HeaderX";

export default function App() {
return (
        <div className="app">
            <BrowserRouter>
            <HeaderX/>
            <AppRoutes/>
            <Fotter/>
            </BrowserRouter>
        </div>
    );
}