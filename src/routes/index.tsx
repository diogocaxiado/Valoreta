import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main/index";

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas para quando o usuário estiver em uma sala específica */}
      <Route path="/sala/:roomId" element={<Main />} />
      <Route path="/room/:roomId" element={<Main />} />

      {/* Rota padrão (home) caso ele não digite nenhuma sala */}
      <Route path="/" element={<Main />} />

      {/* Opcional: manter o coringa para caminhos não encontrados */}
      <Route path="*" element={<Main />} />
    </Routes>
  );
}

export default AppRoutes;