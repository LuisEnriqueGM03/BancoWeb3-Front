import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import Header from '../components/headers';
import { BeneficiarioService } from '../services/BeneficiarioService';
import { BeneficiarioResponse } from '../models/BeneficiarioResponse';
import CrearBeneficiarioModal from '../components/CrearBeneficiarioModal';
import EditarBeneficiarioModal from '../components/EditarBeneficiarioModal'; 

const BeneficiariosPage = () => {
  const token = useAppSelector((state) => state.auth.token);
  const userId = localStorage.getItem('user_id');
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioResponse[]>([]);
  const [showModal, setShowModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [beneficiarioEdit, setBeneficiarioEdit] = useState<BeneficiarioResponse | null>(null); 

  const fetchBeneficiarios = async () => {
    try {
      if (userId && token) {
        const data = await BeneficiarioService.getPorUsuario(Number(userId), token);
        setBeneficiarios(data);
      }
    } catch (error) {
      console.error('Error al cargar beneficiarios:', error);
    }
  };

  useEffect(() => {
    fetchBeneficiarios();
  }, [token, userId]);

  const handleEditar = (id: number) => {
    const beneficiario = beneficiarios.find(b => b.id === id);
    if (beneficiario) {
      setBeneficiarioEdit(beneficiario);
      setShowEditModal(true);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!token) return;
    try {
      await BeneficiarioService.eliminar(id, token);
      fetchBeneficiarios();
    } catch (error) {
      console.error('Error al eliminar beneficiario:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Mis Beneficiarios</h2>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => setShowModal(true)}
          >
            <span className="me-2">Nuevo Beneficiario</span>
            <span className="fs-4">+</span>
          </button>
        </div>

        <div className="row">
          {beneficiarios.map((beneficiario) => (
            <div key={beneficiario.id} className="col-md-4 mb-4">
              <div className="card shadow rounded-4">
                <div className="card-body text-center">
                  <h5 className="card-title">{beneficiario.nombre}</h5>
                  <p className="card-text">Nro. de Cuenta: <strong>{beneficiario.cuenta_destino}</strong></p>
                  <div className="d-flex justify-content-around mt-4">
                    <button className="btn btn-warning" onClick={() => handleEditar(beneficiario.id)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(beneficiario.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {beneficiarios.length === 0 && <p>No se encontraron beneficiarios.</p>}
        </div>
      </div>

      <CrearBeneficiarioModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchBeneficiarios}
        token={token!}
        userId={Number(userId)}
      />

      {beneficiarioEdit && (
        <EditarBeneficiarioModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchBeneficiarios}
          token={token!}
          userId={Number(userId)}
          beneficiario={beneficiarioEdit}
        />
      )}
    </>
  );
};

export default BeneficiariosPage;
