

import { Button } from '../components/Button.tsx';
import Filter from '../components/Filter.tsx';
import Footer from '../components/Footer.tsx';
import Input from '../components/Input.tsx';
import NavBar from '../components/NavBar.tsx';
import ProductCard from '../components/ProductCard.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Select.tsx';
import type { DomicilioResponse, ProductoResponse } from '../services/Interfaces.ts';
import { getActiveProducts } from '../services/ProductService.ts';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../hooks/useAuth";
import { getAllByUserId } from '../services/DirectionService.ts';

// useEffect(() => {
//     async function fetchProducts() {
//         const result = await getActiveProducts(token);
//         setProducts(result);
//     }
//     fetchProducts();
// }, [token]);

export default function Products() {
    // Variable para cuando la pantalla es chica que se desplege el form de filtros
    const [showFilters, setShowFilters] = useState(false);
    // VAriable para guardar todos los productos 
    const [products, setProducts] = useState<ProductoResponse[]>([]);
    // Variable para guardar las direcciones del usuario si es que el que entra esta registrado. 
    const [directions, setDirections] = useState<DomicilioResponse[]>([]);
    // UI filtros y orden
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [sortOption, setSortOption] = useState<string>('Ordenar por:');
    // Filtros aplicados (para mantener el estado de los filtros al cambiar el orden)
    const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>('');
    const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | ''>('');
    const [appliedMinPrice, setAppliedMinPrice] = useState<number | ''>('');
    const [appliedDirection, setAppliedDirection] = useState<string>('');
    // Variable para poder ver el tipo de usuairo. 
    const { currentUser } = useAuth();
    const { token } = useAuth();

    useEffect(() => {
        // Si el usuario es cliente, traigo sus direcciones para poder filtrar por zona. 
        const fetchDirections = async () => {
            if (currentUser?.role === 'Usuario') {
                try {
                    const response = await getAllByUserId(token);
                    console.log('Fetched directions:', response);
                    setDirections(response);
                } catch (error) {
                    console.error('Error fetching directions:', error);
                }
            }
        };
        fetchDirections();
    }, [currentUser, token]);

    // Fetch productos con filtros y orden, usando useCallback para evitar recrear la función en cada renderizado y evitar loops infinitos
    const fetchProducts = useCallback(async (sort?: string, search?: string, min?: number | '', max?: number | '', direction?: string, userType?: string) => {
        try {
            const response = await getActiveProducts(
                token,
                userType ?? currentUser?.role,
                sort ?? sortOption,
                search ?? appliedSearchTerm,
                min ?? appliedMinPrice,
                max ?? appliedMaxPrice,
                direction ?? appliedDirection,

            );
            setProducts(response);

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [currentUser, sortOption, appliedSearchTerm, appliedMinPrice, appliedMaxPrice, appliedDirection, token]);

    // Fetch inicial de productos o de cuando se cabia el orden.
    // llama a los filtros activos asi no se borran al cambair el orden.
    useEffect(() => {
        const fetchInitialProducts = async () => {
            const response = await getActiveProducts(
                token,
                currentUser?.role ?? null,
                sortOption,
                appliedSearchTerm,
                appliedMinPrice,
                appliedMaxPrice,
                appliedDirection
            );
            setProducts(response);
        };
        fetchInitialProducts();
    }, [currentUser, sortOption, appliedSearchTerm, appliedMinPrice, appliedMaxPrice, appliedDirection, token]);


    // Es la funcion que se activa con el boton de bucar.
    // Guarda los inputs en las variables de filtro real
    const handleSearch = () => {
        setAppliedSearchTerm(searchTerm);
        setAppliedMinPrice(minPrice);
        setAppliedMaxPrice(maxPrice);
        fetchProducts(sortOption, searchTerm, minPrice, maxPrice, undefined, currentUser?.role);
    };

    // boton para limpiar filtros y volver a fetch sin filtros
    const handleClearFilters = () => {
        setSearchTerm('');
        setMinPrice('');
        setMaxPrice('');
        setAppliedSearchTerm('');
        setAppliedMinPrice('');
        setAppliedMaxPrice('');
        fetchProducts(sortOption, '', '', '', undefined, currentUser?.role);
    };

    return (
        <div className='m-3'>
            <NavBar />
            <div className="flex flex-col lg:gap-6 justify-end mx-10 mt-6 ">
                <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_auto_auto] items-center gap-2 justify-end order-1 w-full mb-4 lg:grid-cols-[1.5fr_1.5fr_1.5fr_auto_auto]">
                    <Input
                        placeholder='Buscar producto...'
                        color='primary'
                        size='md'
                        name="Buscar producto"
                        type="text"
                        onChange={(value) => {
                            if (typeof value === 'string') {
                                setSearchTerm(value);
                            }
                        }}
                        value={searchTerm}
                    />
                    <Input
                        placeholder='Precio mínimo...'
                        color='primary'
                        size='md'
                        name="Buscar producto"
                        type="Number"
                        onChange={(value) => {
                            setMinPrice(value === '' ? '' : Number(value));
                        }}
                        value={minPrice.toString()}
                    />
                    <Input
                        placeholder='Precio máximo ...'
                        color='primary'
                        size='md'
                        name="Buscar producto"
                        type="Number"
                        onChange={(value) => {
                            setMaxPrice(value === '' ? '' : Number(value));
                        }}
                        value={maxPrice.toString()}
                    />
                    <Button color='primary' size='md' onClick={handleSearch}>Buscar</Button>
                    <Button color='secondary' size='md' onClick={handleClearFilters}>Borrar filtros</Button>
                </div>
                <div className="md:hidden w-full mb-4 flex flex-col items-end ">
                    <Button color='primary' size='full' onClick={() => setShowFilters(!showFilters)}>
                        {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                    </Button>
                    {showFilters && (
                        <div className="flex flex-col gap-2 mt-2 w-full">
                            <Input
                                placeholder='Buscar producto...'
                                color='primary'
                                size='md'
                                name="Buscar producto"
                                type="text"
                                onChange={(value) => {
                                    if (typeof value === 'string') {
                                        setSearchTerm(value);
                                    }
                                }}
                                value={searchTerm}
                            />
                            <Input
                                placeholder='Precio mínimo...'
                                color='primary'
                                size='md'
                                name="Buscar producto"
                                type="Number"
                                onChange={(value) => {
                                    setMinPrice(value === '' ? '' : Number(value));
                                }}
                                value={minPrice.toString()}
                            />
                            <Input
                                placeholder='Precio máximo ...'
                                color='primary'
                                size='md'
                                name="Buscar producto"
                                type="Number"
                                onChange={(value) => {
                                    setMaxPrice(value === '' ? '' : Number(value));
                                }}
                                value={maxPrice.toString()}
                            />
                            <div className="flex gap-2">
                                <Button color='primary' size='md' onClick={handleSearch}>Buscar</Button>
                                <Button color='secondary' size='md' onClick={handleClearFilters}>Borrar filtros</Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="order-2  flex flex-row gap-4 justify-end items-center ">
                    <div className='w-60'>
                        <Filter name={sortOption} options={["Mayor Precio", "Menor Precio", "Nombre A-Z", "Nombre Z-A"]} color="primary" onSave={setSortOption} size='md' />
                    </div>
                    {currentUser?.role === 'Usuario' && (
                        <Select value={appliedDirection} onValueChange={setAppliedDirection}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por direccion" />
                            </SelectTrigger>
                            <SelectContent>
                                {directions.map(dir => (
                                    <SelectItem key={dir.id} value={dir.id.toString()}>{dir.calle + ' ' + dir.casa} </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}


                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-10 xl:grid-cols-4 my-8'>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <Footer />
        </div >
    );
}
