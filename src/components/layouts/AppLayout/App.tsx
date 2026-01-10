import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Header from "./Header/Header";
import Fotter from "./Fotter/Fotter";
import AppRoutes from "../../../routes/AppRoutes";
import HeaderX from "./HeaderX/HeaderX";

export default function App() {
return (
        <div className="app">
            <BrowserRouter>
            <Header/>
            <HeaderX/>
            <AppRoutes/>
            <Fotter/>
            </BrowserRouter>
        </div>
    );
}