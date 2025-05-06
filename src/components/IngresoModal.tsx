import React, { useState } from 'react';
import { CuentaResponse } from '../models/CuentaResponse';
import { CuentaService } from '../services/CuentaService';
import { TransaccionService } from '../services/TransaccionService'; 

interface IngresoModalProps {
  show: boolean;
  nroCuenta: string;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

const IngresoModal: React.FC<IngresoModalProps> = ({ show, nroCuenta, token, onClose, onSuccess }) => {
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIngreso = async () => {
    setLoading(true);
    setError('');

    try {
      const cuenta: CuentaResponse = await CuentaService.getCuentaPorNumero(nroCuenta, token);
      const montoFloat = parseFloat(monto);
      const saldoActual = parseFloat(String(cuenta.saldo));

      if (isNaN(montoFloat) || montoFloat <= 0) {
        setError('El monto ingresado no es válido.');
        setLoading(false);
        return;
      }

      const nuevoSaldo = Number((saldoActual + montoFloat).toFixed(2));

      await CuentaService.actualizarSaldo(cuenta.id, {
        saldo: nuevoSaldo,
        nro_cuenta: cuenta.nro_cuenta,
        usuario: cuenta.usuario,
      }, token);

      await TransaccionService.registrar({
        cuenta: cuenta.id,
        tipo: 'ingreso',
        monto: montoFloat,
      }, token);

      onSuccess();
      onClose();
    } catch (err) {
      setError('Hubo un error al ingresar dinero.');
      console.error(err);
    }

    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ingresar dinero</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <label className="form-label">Monto a ingresar</label>
            <input
              type="number"
              className="form-control"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              min={0}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-success" onClick={handleIngreso} disabled={loading}>
              {loading ? 'Procesando...' : 'Ingresar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngresoModal;
