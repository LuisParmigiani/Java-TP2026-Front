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

export interface GetResetPasswordRequest {
  email: string;
}

export interface ResetTokenRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  nuevaPassword: string;
}

export interface UserResponse {
  id: number;
  nombreUsuario: string;
  email: string;
  nivelAcceso: string;
  precioPedidosSemanales?: number;
  persona?: PersonaResponse;
  personaId?: number;
  imagenUrl?: string;
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
  estado?: 'Habilitado' | 'Deshabilitado'| 'Pendiente';
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
  activo: string;
  habilitado?: string;
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
  diasDomicilio?: DiaDomicilioResponse[];
  diasDomicilioIds?: number[];
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
  dia?: number[];
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

export interface DiaDomicilioResponse {
  id: number;
  estado: string;
  dia?: DiaResponse;
  diaId?: number;
  domicilio: DomicilioResponse;
  domicilioId?: number;
  persona?: PersonaResponse;
}

export interface DiaResponse {
  id: number;
  nombre: string;
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------- REQUESTS --------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface DomicilioRequest {
  calle?: string;
  numero?: string;
  casa?: string;
  dia?: number[];
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
  persona?: PersonaRequest;
  personaId?: number;
  password?: string;
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
  dia?: number[];
  zonaId?: number;
  camionId?: number;
  ventas?: VentaRequest[];
  activo?: string;
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
  lineasPedido?: LineaPedidoRequest[];
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


export interface PedidoSemanalRequest {
  cantidad?: number;
  domicilioId?: number;
  productoZonaId?: number;
}

export interface PaginationResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
// Interfaces para DiaZona y DiaZonaOrden
export interface DiaZonaOrdenResponse {
  id: number;
  orden: number;
  domicilio: DomicilioResponse;
  diaZonaId: number;
  domicilioId?: number;
  diaZonaOrdenes?: DiaZonaOrdenResponse[];
}

export interface DiaZonaResponse {
  id: number;
  diaId: number;
  zonaId: number;
  diaZonaOrdenes: DiaZonaOrdenResponse[];
  zona: ZonaResponse;
  dia?: DiaDTOResponse;
}

// Interfaces para guardar órdenes
export interface DiaZonaOrdenRequest {
  id: number;
  orden: number;
  domicilioId: number;
  diaZonaId: number;
}

export interface DiaZonaDTORequestWithOrdenes {
  diaId: number;
  zonaId: number;
  diaZonaOrdenes: DiaZonaOrdenRequest[];
}

export interface DiaDTOResponse {
  id: number;
  nombre: string;
}

export interface MailDTORequest {
  destino: string,
  asunto: string,
  cuerpo: string
}