import React, { useEffect, useState } from 'react';
import { CuentaResponse } from '../models/CuentaResponse';
import { CuentaService } from '../services/CuentaService';
import { TransaccionService } from '../services/TransaccionService';
import { BeneficiarioService } from '../services/BeneficiarioService';
import { BeneficiarioResponse } from '../models/BeneficiarioResponse';

interface Props {
  show: boolean;
  nroCuentaOrigen: string;
  token: string;
  userId: number;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

const TransaccionCuentas: React.FC<Props> = ({ show, nroCuentaOrigen, token, userId, onClose, onSuccess }) => {
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioResponse[]>([]);
  const [monto, setMonto] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && userId) {
      BeneficiarioService.getPorUsuario(userId, token)
        .then(setBeneficiarios)
        .catch((err) => console.error('Error al cargar beneficiarios', err));
    }
  }, [token, userId]);

  const handleTransferir = async () => {
    setLoading(true);
    setError('');

    try {
      const montoFloat = parseFloat(monto);
      if (isNaN(montoFloat) || montoFloat <= 0) {
        setError('El monto debe ser un número positivo.');
        setLoading(false);
        return;
      }

      const cuentaOrigen: CuentaResponse = await CuentaService.getCuentaPorNumero(nroCuentaOrigen, token);
      const cuentaDestino: CuentaResponse = await CuentaService.getCuentaPorNumero(destinatario, token);

      const saldoOrigen = parseFloat(String(cuentaOrigen.saldo));
      const saldoDestino = parseFloat(String(cuentaDestino.saldo));

      if (montoFloat > saldoOrigen) {
        setError('Saldo insuficiente.');
        setLoading(false);
        return;
      }

      const nuevoSaldoOrigen = Number((saldoOrigen - montoFloat).toFixed(2));
      const nuevoSaldoDestino = Number((saldoDestino + montoFloat).toFixed(2));

      await CuentaService.actualizarSaldo(cuentaOrigen.id, {
        saldo: nuevoSaldoOrigen,
        nro_cuenta: cuentaOrigen.nro_cuenta,
        usuario: cuentaOrigen.usuario,
      }, token);

      await CuentaService.actualizarSaldo(cuentaDestino.id, {
        saldo: nuevoSaldoDestino,
        nro_cuenta: cuentaDestino.nro_cuenta,
        usuario: cuentaDestino.usuario,
      }, token);

      await TransaccionService.registrar({
        cuenta: cuentaOrigen.id,
        tipo: 'transferencia',
        monto: montoFloat,
        cuenta_destino: cuentaDestino.nro_cuenta  
      }, token);

      onSuccess();
      onClose();
      setMonto('');
      setDestinatario('');
    } catch (err) {
      setError('Error al realizar la transferencia. Verifica los datos.');
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
            <h5 className="modal-title">Transferir a Beneficiario</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Monto</label>
              <input
                type="number"
                className="form-control"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                min={0}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Beneficiario</label>
              <select
                className="form-select"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
              >
                <option value="">Selecciona un beneficiario</option>
                {beneficiarios.map((b) => (
                  <option key={b.id} value={b.cuenta_destino}>
                    {b.nombre} - {b.cuenta_destino}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleTransferir} disabled={loading}>
              {loading ? 'Procesando...' : 'Transferir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransaccionCuentas;
