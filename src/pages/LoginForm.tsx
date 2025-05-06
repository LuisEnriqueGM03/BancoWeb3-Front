
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { useAppDispatch } from '../redux/hooks';
import { setCredentials } from '../redux/slices/authSlice';
import { LoginRequest } from '../models/dto/LoginRequest';
import { useState } from 'react';
import Header from '../components/headers';


const LoginForm = () => {
  const [formData, setFormData] = useState<LoginRequest>({ username: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AuthService.login(formData);
      dispatch(setCredentials({ token: res.access, user: res.username,userId: res.user_id.toString(), }));
      navigate('/dashboard');
    } catch (error) {
      alert('Credenciales inválidas');
      console.error(error);
    }
  };

  return (
    <>
      <Header />
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Usuario</label>
          <input type="text" name="username" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} required />
        </div>
        <button className="btn btn-primary" type="submit">Ingresar</button>
      </form>
    </div>
    </>
  );
};

export default LoginForm;
