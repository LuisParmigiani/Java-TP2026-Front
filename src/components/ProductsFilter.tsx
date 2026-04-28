import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Select.tsx';
import { Button } from '../components/Button.tsx';
import Filter from '../components/Filter.tsx';
import Input from '../components/Input.tsx';
import type { DomicilioResponse } from '../services/Interfaces.ts';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { getAllByUserId } from '../services/DirectionService.ts';

interface Props {
    setAppliedSearchTerm: (value: string) => void,
    setAppliedMinPrice: (value: number | '') => void,
    setAppliedMaxPrice: (value: number | '') => void,
    setAppliedDirection?: (value: string) => void,
    sortOption: string;
    setSortOption: (value: string) => void;
    direction?: string;
    setDirection?: (value: string) => void;
    currentUserRole?: string;

}



export default function ProductsFilter(props: Props) {
    const {
        setAppliedDirection,
        setAppliedMaxPrice,
        setAppliedMinPrice,
        setAppliedSearchTerm,
        sortOption,
        setSortOption,
        direction,
        setDirection,
        currentUserRole,

    } = props;
    // Variable para guardar las direcciones del usuario si es que el que entra esta registrado. 
    const [directions, setDirections] = useState<DomicilioResponse[]>([]);
    // Variable para cuando la pantalla es chica que se desplege el form de filtros
    const [showFilters, setShowFilters] = useState(false);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');


    const { token } = useAuth();
    useEffect(() => {
        async function fetchDirections() {
            if (currentUserRole === 'Usuario' && setAppliedDirection && setDirection) {
                try {
                    const response = await getAllByUserId(token);
                    setDirections(response.content);
                } catch (error) {
                    console.error('Error fetching directions:', error);
                }
            } else {
                setDirections([]);
            }
        }
        fetchDirections();
    }, [currentUserRole, token, setAppliedDirection, setDirection]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setMinPrice('');
        setMaxPrice('');
        setDirection?.('');
        setAppliedSearchTerm('');
        setAppliedMinPrice('');
        setAppliedMaxPrice('');
        setAppliedDirection?.('');
    };
    // Handlers for search and clear
    const handleSearch = () => {
        setAppliedSearchTerm(searchTerm);
        setAppliedMinPrice(minPrice);
        setAppliedMaxPrice(maxPrice);
        setAppliedDirection?.(direction);
    };

    return (
        <div className="flex flex-col lg:gap-6 justify-end mb-4">
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
                <Button variant='primary' size='md' onClick={handleSearch}>Buscar</Button>
                <Button variant='secondary' size='md' onClick={handleClearFilters}>Borrar filtros</Button>
            </div>
            <div className="md:hidden w-full mb-4 flex flex-col items-end ">
                <Button variant='primary' size='full' onClick={() => setShowFilters(!showFilters)}>
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
                            <Button variant='primary' size='md' onClick={handleSearch}>Buscar</Button>
                            <Button variant='secondary' size='md' onClick={handleClearFilters}>Borrar filtros</Button>
                        </div>
                    </div>
                )}
            </div>
            <div className={`flex flex-col sm:flex-row gap-4 ${setAppliedDirection && setDirection ? 'justify-end' : ''} items-center`}>
                <div className='sm:w-60 w-full '>
                    <Filter name={sortOption} options={["Mayor Precio", "Menor Precio", "Nombre A-Z", "Nombre Z-A"]} color="primary" onSave={setSortOption} size='md' containerSize='full' />
                </div>
                {currentUserRole === 'Usuario' && directions.length > 0 && setAppliedDirection && setDirection && (
                    <Select value={direction} onValueChange={setDirection}>
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
    );
}