
export interface TransaccionResponse {
    id: number;
    cuenta: number;
    tipo: 'ingreso' | 'egreso' | 'transferencia';
    monto: number;
    cuenta_destino?: number | null;
    fecha: string;
  }
