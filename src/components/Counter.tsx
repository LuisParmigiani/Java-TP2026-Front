import Input from "./Input.tsx";
interface Props {
    value: number;
    onChange: (value: number) => void;
    name?: string;
}

export default function Counter(props: Props) {
    const count = props.value;
    return (
        <div className="w-full flex items-center justify-end gap-2 min-w-0">
            <button
                className="h-9 w-9 shrink-0 rounded-md bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
                onClick={() => props.onChange(Math.max(0, count - 1))}
                type="button"
            >
                -
            </button>

            <Input name={props.name ?? "counter"}
                type="number"
                placeholder="0"
                value={count.toString()}
                onChange={(value) => props.onChange(Math.max(0, parseInt(value) || 0))}
                color="gray"
                size="xs" />

            <button
                className="h-9 w-9 shrink-0 rounded-md bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
                onClick={() => props.onChange(count + 1)}
                type="button"
            >
                +
            </button>
        </div>
    );
}