// src/classes/CPUPlayer.ts
import { IPlayer } from "../interfaces/IPlayer.js";
import { Card } from "./Card.js";

export class CPUPlayer implements IPlayer {
   
    public id: string;
    public name: string;
    public hand: Card[];
    public isHuman: boolean;

    constructor() {
        this.name = "CPU";
        this.isHuman = false; // es la CPU
        this.hand = [];
        this.id = `player-${Math.random()}`; // Genera ID único
    }

   //igual que HumanPlyer

  //recibir la carta
    public drawCard(card: Card): void {
        this.hand.push(card);
    }

    //Comprobar si puede jugar un palo específico 
    public canPlaySuit(currentSuit: string): boolean {
        return this.hand.some(card => card.suit === currentSuit);
    }

    // Quitar la carta de la mano 
    public playCard(cardIndex: number): Card | null {
        if (cardIndex < 0 || cardIndex >= this.hand.length) {
            return null; //no es valido
        }
        // splice = remover la carta y devolverla
        const cardsRemoved = this.hand.splice(cardIndex, 1);
        return cardsRemoved[0];
    }
    
    /// Mostrar la mano (metodo auxiliar para ver por consola la mano del jugador CPU)
    public showHand(): void {
        console.log(`${this.name} (Humano: ${this.isHuman}) tiene:`);
        
        // Si es la CPU, solo mostramos el conteo.
        if (!this.isHuman) {
            // Cartas boca abajo - solo visualizamos el numero de cartas
            const cardBacks = Array(this.hand.length).fill('🂠').join(' ');
            console.log(`[${this.hand.length} cartas] ${cardBacks}`);
        } else {
           
            console.log(this.hand.map((c, i) => `[${i}] ${c.mostrarNombreCompleto()}`).join(", "));
        }
    }
}