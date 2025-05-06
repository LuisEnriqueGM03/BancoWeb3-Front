import { useEffect, useState } from 'react';
import { CuentaResponse } from '../models/CuentaResponse';
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { CuentaService } from '../services/CuentaService';
import Header from '../components/headers';
import ConfirmModal from '../components/ConfirmModal';
import IngresoModal from '../components/IngresoModal';
import EgresoModal from '../components/EgresoModal'; 
import TransaccionCuentas from '../components/TransaccionCuentasModal'; 

const Dashboard = () => {
  const token = useAppSelector((state) => state.auth.token);
  const userId = localStorage.getItem('user_id');
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showIngresoModal, setShowIngresoModal] = useState(false);
  const [showEgresoModal, setShowEgresoModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false); 
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<string | null>(null);
  const [cuentaSeleccionadaTransferencia, setCuentaSeleccionadaTransferencia] = useState<string | null>(null); 
  const navigate = useNavigate();

  const fetchCuentas = async () => {
    try {
      if (userId && token) {
        const data = await CuentaService.getCuentasPorUsuario(Number(userId), token);
        setCuentas(data);
      }
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, [token, userId]);

  const handleCrearCuenta = () => {
    setShowModal(true);
  };

  const confirmarCrearCuenta = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      await CuentaService.createCuenta({ usuario: Number(userId) }, token);
      await fetchCuentas();
      setShowModal(false);
    } catch (error) {
      console.error("Error al crear cuenta:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirIngresoModal = (nroCuenta: string) => {
    setCuentaSeleccionada(nroCuenta);
    setShowIngresoModal(true);
  };

  const abrirEgresoModal = (nroCuenta: string) => {
    setCuentaSeleccionada(nroCuenta);
    setShowEgresoModal(true);
  };

  const abrirTransferModal = (nroCuenta: string) => {
    setCuentaSeleccionadaTransferencia(nroCuenta);
    setShowTransferModal(true);
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Mis Cuentas</h2>
          <button className="btn btn-success d-flex align-items-center" onClick={handleCrearCuenta}>
            <span className="me-2">Nueva Cuenta</span>
            <span className="fs-4">+</span>
          </button>
        </div>

        <div className="row">
          {cuentas.map((cuenta) => (
            <div key={cuenta.id} className="col-md-4 mb-4">
              <div
                className="card shadow rounded-4 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/cuentas/${cuenta.id}/transacciones`)}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">Nro. de Cuenta</h5>
                  <p className="card-text fw-bold">{cuenta.nro_cuenta}</p>
                  <h6>Saldo: Bs. {cuenta.saldo}</h6>
                  <div className="d-flex justify-content-around mt-4">
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirIngresoModal(cuenta.nro_cuenta);
                      }}
                    >
                      Ingresar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirEgresoModal(cuenta.nro_cuenta);
                      }}
                    >
                      Egresar
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirTransferModal(cuenta.nro_cuenta);
                      }}
                    >
                      Transferir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {cuentas.length === 0 && <p>No se encontraron cuentas.</p>}
        </div>
      </div>

      <ConfirmModal
        show={showModal}
        title="Confirmar creación"
        message="¿Deseas crear una nueva cuenta bancaria?"
        onConfirm={confirmarCrearCuenta}
        onClose={() => setShowModal(false)}
        loading={loading}
      />

      <IngresoModal
        show={showIngresoModal}
        nroCuenta={cuentaSeleccionada || ''}
        token={token!}
        onClose={() => setShowIngresoModal(false)}
        onSuccess={fetchCuentas}
      />

      <EgresoModal
        show={showEgresoModal}
        nroCuenta={cuentaSeleccionada || ''}
        token={token!}
        onClose={() => setShowEgresoModal(false)}
        onSuccess={fetchCuentas}
      />

      <TransaccionCuentas
        show={showTransferModal}
        nroCuentaOrigen={cuentaSeleccionadaTransferencia || ''}
        token={token!}
        userId={Number(userId)} 
        onClose={() => setShowTransferModal(false)}
        onSuccess={fetchCuentas}
      />
    </>
  );
};

export default Dashboard;
