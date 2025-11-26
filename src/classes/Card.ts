import { ICard } from "../interfaces/ICard.js"; 
export class Card implements ICard {
    suit: string;
    value: string;
    rank: number;
    imageUrl: string;

    constructor(suit: string, value: string) {
        this.suit = suit;
        this.value = value;
        this.rank = this.calcularRank(this.value);    
        this.imageUrl = this.generarUrlImage(suit, value);
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
    private generarUrlImage(suit: string, value: string): string {
        let codigoPalo = "";
        switch (suit) {
            case "♥": codigoPalo = "H"; break; //corazones
            case "♦": codigoPalo = "D"; break; //diamantes
            case "♣": codigoPalo = "C"; break; //treboles
            case "♠": codigoPalo = "S"; break;//espadas
            default: codigoPalo = "H"; // Desconocido
        }
    // La API usa 0 para el 10
    let codigoValor = value;
    if (value === "10") {
        codigoValor = "0"; 
    }

    //unir y crear url final
    return `https://deckofcardsapi.com/static/img/${codigoValor}${codigoPalo}.png`
    }
}