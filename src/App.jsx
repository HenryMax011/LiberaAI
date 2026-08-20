import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GtmPageview } from "./components/GtmPageview";
import { Home } from "./pages/Home";
import { Falar } from "./pages/Falar";
import { Orcamento } from "./pages/Orcamento";
import { Obrigado } from "./pages/Obrigado";
import { Privacy } from "./pages/Privacy";

export default function App() {
  return (
    <BrowserRouter>
      <GtmPageview />
      <Routes>
        <Route path="/" element={<Home key="home" />} />
        <Route path="/home/obrigado/formulario" element={<Navigate to="/obrigado/formulario" replace />} />
        <Route path="/home/obrigado/whatsapp" element={<Navigate to="/obrigado/whatsapp" replace />} />
        <Route path="/home/obrigado/whatsapp/" element={<Navigate to="/obrigado/whatsapp" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/alvara-de-funcionamento" element={<Home key="alvara" landing="alvara" />} />
        <Route path="/vigilancia-sanitaria" element={<Home key="vigilancia" landing="vigilancia" />} />
        <Route path="/formulario" element={<Orcamento />} />
        <Route path="/formulario/alvara-de-funcionamento" element={<Orcamento kind="alvara" />} />
        <Route path="/formulario/vigilancia-sanitaria" element={<Orcamento kind="vigilancia" />} />
        <Route path="/orcamento" element={<Navigate to="/formulario" replace />} />
        <Route path="/orcamento/alvara-de-funcionamento" element={<Navigate to="/formulario/alvara-de-funcionamento" replace />} />
        <Route path="/orcamento/vigilancia-sanitaria" element={<Navigate to="/formulario/vigilancia-sanitaria" replace />} />
        <Route path="/whatsapp" element={<Falar />} />
        <Route path="/whatsapp/" element={<Falar />} />
        <Route path="/whatsapp/formulario/home" element={<Navigate to="/whatsapp/?source=LP_HOME" replace />} />
        <Route path="/whatsapp/formulario/alvara-de-funcionamento" element={<Navigate to="/whatsapp/?source=LP_ALVARA_FUNCIONAMENTO" replace />} />
        <Route path="/whatsapp/formulario/vigilancia-sanitaria" element={<Navigate to="/whatsapp/?source=LP_VIGILANCIA_SANITARIA" replace />} />
        <Route path="/falar" element={<Navigate to="/whatsapp/?source=LP_HOME" replace />} />
        <Route path="/obrigado/formulario" element={<Obrigado />} />
        <Route path="/obrigado/whatsapp" element={<Obrigado />} />
        <Route path="/obrigado/whatsapp/" element={<Obrigado />} />
        <Route path="/alvara-de-funcionamento/obrigado/formulario" element={<Obrigado />} />
        <Route path="/alvara-de-funcionamento/obrigado/whatsapp" element={<Obrigado />} />
        <Route path="/alvara-de-funcionamento/obrigado/whatsapp/" element={<Obrigado />} />
        <Route path="/vigilancia-sanitaria/obrigado/formulario" element={<Obrigado />} />
        <Route path="/vigilancia-sanitaria/obrigado/whatsapp" element={<Obrigado />} />
        <Route path="/vigilancia-sanitaria/obrigado/whatsapp/" element={<Obrigado />} />
        <Route path="/obrigado" element={<Navigate to="/obrigado/formulario" replace />} />
        <Route path="/privacidade" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}
