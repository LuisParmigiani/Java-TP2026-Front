export interface LoginResponse {
    success: boolean;
    token?: string;
    userId?: number;
    role?: string;
    error?: string;
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
