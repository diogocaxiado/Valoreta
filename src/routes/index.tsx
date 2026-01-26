import { Routes, Route } from "react-router-dom";
import Lobby from "../pages/Lobby";
import Main from "../pages/Main/index";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/room/:roomId" element={<Main />} />

      <Route path="/" element={<Lobby />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;