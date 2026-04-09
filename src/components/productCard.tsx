
export default function ProductCard({ name, description, image, price }: { name: string; description: string; image: string, price: number }) {
    return (
        <div className="group bg-card rounded-xl flex flex-col border-2 border-black shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-primary w-auto h-auto">
            <div className="w-full h-48 overflow-hidden rounded-t-lg border-b-2 border-black group-hover:border-primary transition-all duration-300">
                <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="text-xl font-semibold mb-3">
                <h3 className="text-lg font-bold mb-3 p-3 text-foreground group-hover:text-primary transition-colors duration-300">{name}</h3>
                <p className="text-gray-500 text-sm px-3 leading-relaxed">{description}</p>
                <p className="text-2xl font-bold p-3 text-primary">${price.toFixed(2)}</p>
            </div>
        </div>
    );
}