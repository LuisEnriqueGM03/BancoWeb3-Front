import { Routes, Route } from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import Dashboard from "../pages/Dashboard"; 
import TransaccionesPage from "../pages/TransaccionesPage";
import BeneficiariosPage from "../pages/BeneficiariosPage";
import { URLS } from "./CONTANTS";

export const RouterConfig = () => {
  return (
    <Routes>
      <Route path={URLS.LOGIN} element={<LoginForm />} />
      <Route path={URLS.REGISTER} element={<RegisterForm />} />
      <Route path={URLS.DASHBOARD} element={<Dashboard />} />
      <Route path={URLS.TRANSACCIONES.POR_CUENTA} element={<TransaccionesPage />} />
      <Route path={URLS.BENEFICIARIOS.LIST} element={<BeneficiariosPage />} />

    </Routes>
  );
};

export default RouterConfig;
