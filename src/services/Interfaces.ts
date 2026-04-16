export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
}

export interface jwtDecoded {
  userId: number;
  email: string;
  role: "Administrador" | "Empleado" | "Usuario" | "Conductor";
  username?: string;
}

export interface UserResponse {
  id: number;
  nombreUsuario: string;
  email: string;
  nivelAcceso: string;
  persona: PersonaResponse;
}

export interface PersonaResponse {
  id: number;
  tipoDoc: string;
  nroDocumento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  saldo: number;
  pagos: PagoResponse[];
  domicilios: domicilioResponse[];
}

export interface PagoResponse {
  id: number;
  monto: number;
  fecha: string;
  metodoPago: string;
  personaId: number;
}
export interface domicilioResponse {
  id: number;
  calle: string;
  numero: string;
  personaId: number;
  casa: string;
  dia: boolean[];
  zona: ZonaResponse;
  ventas: VentaResponse[];
  activo: boolean;
  productosDomicilio: productosDomicilio[];
}

export interface CamionResponse {
  id: number;
  patente: string;
  modelo: string;
  marca: string;
  kilometraje: number;
  estado: string;
}

export interface productosDomicilio {
  id: number;
  productoId: number;
  nombreProducto: string;
  domicilioId: number;
  cantVaciosActuales: number;
  aproxSemana: number;
}
export interface VentaResponse {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  pagado: boolean;
  idDomicilio: number;
  lineasPedido: LineaPedidoResponse[];
}
export interface LineaPedidoResponse {
  id: number;
  cantidad: number;
  subtotal: number;
  productoZona: ProductoZonaResponse;
}

export interface ProductoZonaResponse {
  id: number;
  zona: ZonaResponse;
  producto: ProductoResponse;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  detalle: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
}
export interface ZonaResponse {
  id: number;
  nombre: string;
  detalle: string;
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------- REQUESTS --------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface DomicilioRequest {
  calle?: string;
  numero?: string;
  casa?: string;
  dia?: boolean[];
  zonaId?: number;
}

export interface LoginRequest {
  success?: boolean;
  token?: string;
  userId?: number;
  role?: string;
  error?: string;
}
export interface UserRequest {
  nombreUsuario?: string;
  email?: string;
  nivelAcceso?: string;
  personaId?: number;
}

export interface PersonaRequest {
  tipoDoc?: string;
  nroDocumento?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  saldo?: number;
}

export interface PagoRequest {
  monto?: number;
  fecha?: string;
  metodoPago?: string;
  personaId?: number;
}
export interface domicilioRequest {
  calle?: string;
  numero?: string;
  personaId?: number;
  casa?: string;
  dia?: boolean[];
  zonaId?: number;
  camionId?: number;
  ventas?: VentaRequest[];
  activo?: boolean;
}

export interface productosDomicilioRequest {
  productoId?: number;
  domicilioId?: number;
  cantVaciosActuales?: number;
  aproxSemana?: number;
}
export interface VentaRequest {
  fecha?: string;
  total?: number;
  estado?: string;
  pagado?: boolean;
  idDomicilio?: number;
  lineasPedidoIds?: number[];
}
export interface LineaPedidoRequest {
  cantidad?: number;
  subtotal?: number;
  productoZonaId?: number;
}

export interface ProductoZonaRequest {
  id?: number;
  zona?: ZonaRequest;
  productoId?: number;
}

export interface ProductoRequest {
  nombre?: string;
  detalle?: string;
  precio?: number;
  stock?: number;
  imagenUrl?: string;
  activo?: boolean;
}
export interface ZonaRequest {
  nombre?: string;
  detalle?: string;
}

export interface GastoRequest {
  detalle?: string;
  monto?: number;
  fecha?: string;
  camion_id?: number;
}

export interface CamionRequest {
  patente: string;
  modelo: string;
  marca: string;
  estado?: boolean;
  kilometraje: number;
}
export interface CargaProductoRequest {
  cantLleno?: number;
  cantVacio?: number;
  idCarga?: number;
  idProducto?: number;
}
export interface CargaRequest {
  tipo?: string;
  fechaHora?: Date;
  idUsuario?: number;
  idCamion?: number;
}

export interface ErrorResponse {
  mensaje: string;
  errores?: Record<string, string>;
  codigo: number;
}
