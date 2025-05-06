import React, { useEffect, useState } from 'react';
import { CuentaService } from '../services/CuentaService';
import { BeneficiarioService } from '../services/BeneficiarioService';
import { CuentaResponse } from '../models/CuentaResponse';
import { BeneficiarioResponse } from '../models/BeneficiarioResponse';

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  token: string;
  userId: number;
  beneficiario: BeneficiarioResponse;
}

const EditarBeneficiarioModal: React.FC<Props> = ({ show, onClose, onSuccess, token, userId, beneficiario }) => {
  const [nombre, setNombre] = useState(beneficiario.nombre);
  const [cuentaDestino, setCuentaDestino] = useState(beneficiario.cuenta_destino);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNombre(beneficiario.nombre);
    setCuentaDestino(beneficiario.cuenta_destino);
  }, [beneficiario]);

  const handleActualizar = async () => {
    if (!nombre || !cuentaDestino || !token || !userId) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const cuenta: CuentaResponse = await CuentaService.getCuentaPorNumero(cuentaDestino, token);

      await BeneficiarioService.actualizar(beneficiario.id, {
        nombre,
        cuenta_destino: cuenta.nro_cuenta,
        usuario: Number(userId),
      }, token);

      onSuccess();
      onClose();
    } catch (err) {
      setError('No se pudo actualizar el beneficiario. Verifique que la cuenta existe.');
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
            <h5 className="modal-title">Editar Beneficiario</h5>
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
                value={cuentaDestino}
                onChange={(e) => setCuentaDestino(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleActualizar} disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarBeneficiarioModal;
