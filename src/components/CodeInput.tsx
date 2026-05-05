import React from "react";

// Componente para ingresar códigos de varios dígitos (por ejemplo, 6 números para verificación)

// Props:
// - length: cantidad de casillas (por defecto 6)
// - value: el valor actual del código (string)
// - onChange: función que se llama cuando cambia el código
// - disabled: deshabilita los inputs si es true
type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

export const CodeInput: React.FC<Props> = ({
  length = 6,
  value,
  onChange,
  disabled,
  error = false,
}) => {
  // Crea un array con la cantidad de casillas necesarias
  const inputs = Array.from({ length });

  // Cuando el usuario escribe en una casilla
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    // Si el input queda vacío, borra el carácter correspondiente
    if (e.target.value === "") {
      const newValue = value.split("");
      newValue[idx] = "";
      const joined = newValue.join("");
      onChange(joined.padEnd(length, ""));
      return;
    }
    // Solo permite un carácter alfanumérico
    const val = e.target.value.replace(/[^0-9a-zA-Z]/g, "").slice(0, 1);
    if (!val) return;
    // Convierte el string actual en array para modificar el dígito correspondiente
    const newValue = value.split("");
    newValue[idx] = val;
    const joined = newValue.join("");
    // Llama a onChange con el nuevo valor, rellenando con espacios si falta
    onChange(joined.padEnd(length, ""));
    // Mueve el foco automáticamente a la siguiente casilla
    const next = document.getElementById(`code-input-${idx + 1}`);
    if (next) (next as HTMLInputElement).focus();
  };

  // Permite retroceder con Backspace si la casilla está vacía
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      // Mueve el foco a la casilla anterior
      const prev = document.getElementById(`code-input-${idx - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  // Permite pegar el código entero
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9a-zA-Z]/g, "")
      .slice(0, length);

    if (!pastedData) return;

    onChange(pastedData.padEnd(length, ""));

    // Mueve el foco al final del texto pegado o al último casillero
    const focusIndex = Math.min(pastedData.length, length - 1);
    const next = document.getElementById(`code-input-${focusIndex}`);
    if (next) (next as HTMLInputElement).focus();
  };

  // Renderiza los inputs uno al lado del otro
  return (
    <div className="flex gap-2 justify-center">
      {inputs.map((_, idx) => (
        <input
          key={idx}
          id={`code-input-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={`w-10 h-12 text-center rounded-lg border text-xl font-mono ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary"}`}
          value={value[idx] || ""} // Muestra el valor correspondiente
          onChange={(e) => handleChange(e, idx)} // Maneja el cambio de cada input
          onKeyDown={(e) => handleKeyDown(e, idx)} // Permite retroceder con Backspace
          onPaste={handlePaste} // Maneja el pegado de texto
          disabled={disabled}
        />
      ))}
    </div>
  );
};
