import { Card } from "../classes/Card.js"; 


export interface IDeck {
    cards: Card[]; // Un mazo tiene muchas cartas adentro.
    shuffle(): void; // Método para barajar las cartas.
    dealCard: Card | undefined; // Método para repartir una carta.

}

