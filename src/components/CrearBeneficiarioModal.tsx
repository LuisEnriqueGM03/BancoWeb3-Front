import React, { useState } from 'react';
import { CuentaService } from '../services/CuentaService';
import { BeneficiarioService } from '../services/BeneficiarioService';
import { CuentaResponse } from '../models/CuentaResponse';
import { useAppSelector } from '../redux/hooks';

interface Props {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void | Promise<void>;
    token: string;
    userId: number;
}

const CrearBeneficiarioModal: React.FC<Props> = ({ show, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [cuenta_destino, setcuenta_destino] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = useAppSelector((state) => state.auth.token);
  const userId = localStorage.getItem('user_id');

  const handleGuardar = async () => {
    if (!nombre || !cuenta_destino || !token || !userId) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      setError('');


      const cuenta: CuentaResponse = await CuentaService.getCuentaPorNumero(cuenta_destino, token);

      await BeneficiarioService.crear({
        nombre,
        cuenta_destino: cuenta.nro_cuenta,
        usuario: Number(userId),
      }, token);

      onSuccess();
      onClose();
      setNombre('');
      setcuenta_destino('');
    } catch (err) {
      setError('No se pudo crear el beneficiario. Verifique que la cuenta existe.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo Beneficiario</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Nombre del Beneficiario</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nro. de Cuenta</label>
              <input
                type="text"
                className="form-control"
                value={cuenta_destino}
                onChange={(e) => setcuenta_destino(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-success" onClick={handleGuardar} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearBeneficiarioModal;
