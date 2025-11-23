import { IPlayer } from "../interfaces/IPlayer.js";
import { Card } from "./Card.js";

export class HumanPlayer implements IPlayer {
    id: string;
    name: string;
    hand: Card[];
    isHuman: boolean;

    constructor(id: string, name: string) {
        this.id = `player-${Math.random()}`;//para que le asigne un numero aleatorio a cada jugador
        this.name = name;
        this.hand = [];
        this.isHuman = true;
    } 
    //el jugador debe poder robar cartas
    public drawCard(card: Card): void {
        this.hand.push(card);
    }
    //el jugador debe poder jugar una carta (de su mano)
    public playCard(cardIndex: number): Card | null {
        // Validación del índice...
        if (cardIndex < 0 || cardIndex >= this.hand.length) {
            console.error("¡Carta no válida!");
            return null;
        }

        const cardsRemoved = this.hand.splice(cardIndex, 1);
        return cardsRemoved[0]; //devolvemos la carta jugada
    }

    //método para saber si el jugador tiene una carta que se pueda jugar del palo especifico
    public canPlaySuit(currentSuit: string): boolean {
        return this.hand.some(card => card.suit === currentSuit);
    }

    //funcion auxiliar para poder ver por consola la mano que tiene el jugador hasta tener la interfaz gráfica
    public showHand(): void {
        console.log(`${this.name} (Humano: ${this.isHuman}) tiene:`);
        console.log(this.hand.map((c, i) => `[${i}] ${c.mostrarNombreCompleto()}`).join(", "));
    }
}



