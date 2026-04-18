export interface LoginResponse {
  success: boolean;
  token?: string;
  userId?: number;
  role?: string;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
}

export interface UserResponse {
  id: number;
  nombreUsuario: string;
  email: string;
  nivelAcceso: string;
  persona?: PersonaResponse;
  personaId?: number;
  cargas?: CargaResponse[];
  cargaIds?: number[];
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
  pagos?: PagoResponse[];
  pagosIds?: number[];
  domicilios?: DomicilioResponse[];
  domicilioIds?: number[];
  usuario?: UserResponse;
  usuarioId?: number;
}

export interface PagoResponse {
  id: number;
  monto: number;
  fecha: string;
  metodoPago: string;
  persona?: PersonaResponse;
  personaId?: number;
}

export interface DomicilioResponse {
  id: number;
  calle: string;
  numero: string;
  casa: string;
  dia?: boolean[];
  activo: boolean;
  zona?: ZonaResponse;
  zonaId?: number;
  ventas?: VentaResponse[];
  ventaIds?: number[];
  productosDomicilio?: ProductosDomicilio[];
  productoDomicilioIds?: number[];
  pedidosSemanales?: PedidoSemanalResponse[];
  pedidoSemanalIds?: number[];
  camion?: CamionResponse;
  camionId?: number;
  persona?: PersonaResponse;
  personaId?: number;
}

export interface ProductosDomicilio {
  id: number;
  productoId?: number;
  nombreProducto?: string;
  domicilioId?: number;
  cantVaciosActuales: number;
  aproxSemana?: number;
  domicilio?: DomicilioResponse;
  producto?: ProductoResponse;
}

export interface VentaResponse {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  pagado: boolean;
  idDomicilio?: number;
  domicilio?: DomicilioResponse;
  lineasPedido?: LineaPedidoResponse[];
}

export interface LineaPedidoResponse {
  id: number;
  cantidad: number;
  subtotal: number;
  productoZona?: ProductoZonaResponse;
  productoZonaId?: number;
  venta?: VentaResponse;
  ventaId?: number;
}

export interface ProductoZonaResponse {
  id: number;
  zona?: ZonaResponse;
  zonaId?: number;
  producto?: ProductoResponse;
  productoId?: number;
  lineaPedidos?: LineaPedidoResponse[];
  lineaPedidosIds?: number[];
  pedidoSemanal?: PedidoSemanalResponse[];
  pedidoSemanalIds?: number[];
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  detalle: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  productosZona?: ProductoZonaResponse[];
  productoZonaIds?: number[];
  productosDomicilio?: ProductosDomicilio[];
  productoDomicilioIds?: number[];
}

export interface ZonaResponse {
  id: number;
  nombre: string;
  detalle: string;
  dia?: boolean[];
  productoZonas?: ProductoZonaResponse[];
  productoZonaIds?: number[];
  domicilios?: DomicilioResponse[];
  domicilioIds?: number[];
}

export interface CamionResponse {
  id: number;
  patente: string;
  modelo: string;
  marca: string;
  kilometraje: number;
  estado: boolean;
  gastos?: GastoResponse[];
  gastoIds?: number[];
  domicilios?: DomicilioResponse[];
  domiciliosIds?: number[];
  cargas?: CargaResponse[];
  cargasIds?: number[];
}

export interface PedidoSemanalResponse {
  id: number;
  cantidad: number;
  domicilio?: DomicilioResponse;
  domicilioId?: number;
  productoZona?: ProductoZonaResponse;
  productoZonaId?: number;
}

export interface GastoResponse {
  id: number;
  detalle: string;
  monto: number;
  fecha: string;
  camion?: CamionResponse;
  camionId?: number;
}

export interface CargaResponse {
  id: number;
  tipo: string;
  fechaHora: Date;
  usuario?: UserResponse;
  usuarioId?: number;
  camion?: CamionResponse;
  camionId?: number;
  cargaProductos?: CargaProductoResponse[];
  cargaProductoIds?: number[];
}

export interface CargaProductoResponse {
  id: number;
  cantLleno: number;
  cantVacio: number;
  carga?: CargaResponse;
  cargaId?: number;
  producto?: ProductoResponse;
  productoId?: number;
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

export interface Camion {
  patente: string;
  modelo: string;
  marca: string;
  kilometros: number;
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