import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { RegisterRequest } from "../models/dto/RegisterRequest";
import Header from '../components/headers';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterRequest>({
    nombre_completo: "",
    ci: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.register(formData);
      alert("Registro exitoso, ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar usuario. Verifica los datos.");
    }
  };

  return (
    <>
      <Header />
    <div className="container mt-5">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre_completo" className="form-label">Nombre completo</label>
          <input
            type="text"
            name="nombre_completo"
            className="form-control"
            value={formData.nombre_completo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="ci" className="form-label">CI</label>
          <input
            type="text"
            name="ci"
            className="form-control"
            value={formData.ci}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
    </>
  );
};

export default RegisterForm;
