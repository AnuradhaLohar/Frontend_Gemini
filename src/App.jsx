
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import MainLayout from "./components/MainLayout";
import Login from "./components/Login";
import DisplayMessage from "./components/DisplayMessage";
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
        >
          <Route index element={<DisplayMessage />} />
          <Route path="new-chat" element={<DisplayMessage />} />
          <Route path=":chatId" element={<DisplayMessage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
