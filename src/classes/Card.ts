import { ICard } from "../interfaces/ICard.js"; 
export class Card implements ICard {
    suit: string;
    value: string;
    rank: number;

    constructor(suit: string, value: string) {
        this.suit = suit;
        this.value = value;
        this.rank = this.calcularRank(this.value);    
    
    }
    
    public mostrarNombreCompleto(): string {
            return `${this.value} de ${this.suit}`;
    }
    private calcularRank(valorVisual: string): number {
        // Usamos un 'switch' para decidir el valor.
           switch (valorVisual) {
            case "A": return 14; // El As suele ser el más alto (o 1, según el juego)
            case "K": return 13;
            case "Q": return 12;
            case "J": return 11;
            // Si no es letra, convertimos el texto "10", "9" a número real.
            default: return parseInt(valorVisual); 
        }
    }
}