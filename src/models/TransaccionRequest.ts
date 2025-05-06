export interface TransaccionRequest {
    cuenta: number;
    tipo: 'ingreso' | 'egreso' | 'transferencia';
    monto: number;
    cuenta_destino?: string; 
  }
  