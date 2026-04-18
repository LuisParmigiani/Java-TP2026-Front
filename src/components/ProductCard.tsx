import Counter from "./Counter";
import type { ProductoResponse } from "../services/Interfaces";
interface Props {
    product: ProductoResponse
    quantity?: number;
    Cant?: number;
    setCant?: (value: number) => void;
}

export default function ProductCard(props: Props) {



    return (
        <div className={`max-w-sm group bg-card rounded-xl flex flex-col border-2 border-black shadow-md transition-all duration-300 ease-out ${props.Cant === undefined ? 'hover:-translate-y-2 hover:shadow-xl hover:border-primary' : ''} w-auto h-auto`}>
            <div className={`w-full h-48 overflow-hidden rounded-t-lg border-b-2 border-black ${props.Cant === undefined ? 'group-hover:border-primary' : ''} transition-all duration-300`}>
                <img src={props.product.imagenUrl} alt={props.product.nombre} className={`w-full h-full object-cover transition-transform duration-500 ${props.Cant === undefined ? 'group-hover:scale-110' : ''}`} />
            </div>
            <div className="mb-3 flex flex-col gap-2">
                <h3 className="text-lg font-bold px-3 pt-3 text-foreground group-hover:text-primary transition-colors duration-300">{props.product.nombre}</h3>
                <p className="text-gray-500 text-sm px-3 leading-relaxed">{props.product.detalle}</p>
                <p className="text-2xl font-bold px-3 text-primary">${props.product.precio.toFixed(2)}</p>
                {props.Cant !== undefined && (
                    <div>
                        <div className="px-3 pt-1 pb-3 flex items-center justify-between gap-3 min-w-0">
                            <p className="text-sm font-medium text-gray-700 shrink-0">Cantidad:</p>
                            <Counter value={props.Cant} onChange={props.setCant} />
                        </div>
                        <div>
                            <p>Precio total: </p> <p>${(props.product.precio * props.Cant).toFixed(2)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}