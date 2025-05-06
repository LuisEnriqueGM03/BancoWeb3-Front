import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CuentaService } from "../services/CuentaService";
import { TransaccionService } from "../services/TransaccionService";
import { useAppSelector } from "../redux/hooks";
import { CuentaResponse } from "../models/CuentaResponse";
import { TransaccionResponse } from "../models/TransaccionResponse";
import Header from '../components/headers';

const TransaccionesPage = () => {
  const { cuentaId } = useParams<{ cuentaId: string }>();
  const token = useAppSelector((state) => state.auth.token);
  const [cuenta, setCuenta] = useState<CuentaResponse | null>(null);
  const [transacciones, setTransacciones] = useState<TransaccionResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("cuentaId desde params:", cuentaId);
      console.log("token actual:", token);
      if (!cuentaId || !token) return;

      try {
        const cuentaData = await CuentaService.getCuentaPorId(Number(cuentaId), token);
        console.log("Cuenta obtenida:", cuentaData);
        setCuenta(cuentaData);

        const transaccionesData = await TransaccionService.getPorCuenta(cuentaData.id, token);
        console.log("Transacciones obtenidas:", transaccionesData);
        setTransacciones(transaccionesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [cuentaId, token]);

  return (
    <>
      <Header />
    <div className="container mt-5">
      {cuenta && (
        <div className="card mb-4 shadow rounded-4">
          <div className="card-body text-center">
            <h4 className="card-title">Cuenta: {cuenta.nro_cuenta}</h4>
            <p className="card-text fs-5">Saldo actual: <strong>Bs. {cuenta.saldo}</strong></p>
          </div>
        </div>
      )}

      <div className="card shadow rounded-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Transacciones</h5>
          {transacciones.length === 0 ? (
            <p>No hay transacciones registradas.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Monto (Bs.)</th>
                  <th>Cuenta destino</th>
                </tr>
              </thead>
              <tbody>
                {transacciones.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.fecha).toLocaleString()}</td>
                    <td>{tx.tipo}</td>
                    <td>{tx.monto}</td>
                    <td>{tx.cuenta_destino ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default TransaccionesPage;
