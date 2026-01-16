import { Routes, Route } from "react-router-dom";
import Lobby from "../pages/Lobby";
import Main from "../pages/Main/index";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas para quando o usuário estiver em uma sala específica */}
      <Route path="/sala/:roomId" element={<Main />} />
      <Route path="/room/:roomId" element={<Main />} />

      {/* Rota padrão (home) caso ele não digite nenhuma sala */}
      <Route path="/" element={<Lobby />} />

      {/* Opcional: manter o coringa para caminhos não encontrados */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;