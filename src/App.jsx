import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Falar } from "./pages/Falar";
import { Obrigado } from "./pages/Obrigado";
import { Privacy } from "./pages/Privacy";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/falar" element={<Falar />} />
        <Route path="/obrigado/whatsapp" element={<Obrigado />} />
        <Route path="/obrigado/whatsapp/" element={<Obrigado />} />
        <Route path="/obrigado/formulario" element={<Obrigado />} />
        <Route path="/obrigado" element={<Navigate to="/obrigado/formulario" replace />} />
        <Route path="/privacidade" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}
