export interface ICard {
    suit: string;  // 'suit' (palo) debe ser un texto (string), ej: "♥", "♠"
    value: string; // 'value' (valor) debe ser un texto, ej: "A", "10", "K"
    rank: number;  // El valor numérico real (13, 7)
}