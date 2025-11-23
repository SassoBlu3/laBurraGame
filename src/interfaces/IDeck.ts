import { Card } from "../classes/Card.js"; 


export interface IDeck {
    cards: Card[]; // cartas en el mazo
    shuffle(): void; // Método para barajar las cartas.
    dealCard(): Card | undefined; // Método para repartir una carta.

}

