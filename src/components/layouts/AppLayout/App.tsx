import { BrowserRouter } from "react-router-dom";
import Header from "./Header/Header";
import Fotter from "./Fotter/Fotter";
import AppRoutes from "../../../routes/AppRoutes";

export default function App() {
return (
        <div className="App">
            <BrowserRouter>
            <Header/>
            <AppRoutes/>
            <Fotter/>
            </BrowserRouter>
        </div>
    );
}