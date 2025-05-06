import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>BancoApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link onClick={() => navigate('/dashboard')}>💲 Mis Cuentas</Nav.Link>
                <Nav.Link onClick={() => navigate('/beneficiarios')}>👥 Beneficiarios</Nav.Link>
              </Nav>
              <Navbar.Text className="me-3">👤 {username}</Navbar.Text>
              <Button variant="outline-light" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Nav>
              <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
              <Nav.Link onClick={() => navigate('/register')}>Registro</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
