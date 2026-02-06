import Chat from "../Chat/Chat";
import Login from "../Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyPage from "../Verify/VerifyPage";
import ProfilePage from "../Profile/page";


function PageRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<h1>Home</h1>} />
                <Route path='/login' element={<Login />} />
                <Route path='/verify' element={<VerifyPage />} />
                <Route path='/chat' element={<Chat />} />
                <Route path='/profile' element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default PageRoutes;