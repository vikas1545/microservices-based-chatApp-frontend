import Chat from "../Chat/Chat";
import Login from "../Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function PageRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<h1>Home</h1>} />
                <Route path='/login' element={<Login />} />
                <Route path='/chat' element={<Chat />} />
            </Routes>
        </BrowserRouter>
    )
}

export default PageRoutes;