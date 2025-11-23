import {IDeck} from "../interfaces/IDeck.js";//importar interfaz
import { Card } from "./Card.js"; //importar clase

export class Deck implements IDeck {
    cards: Card[] = []; //inicializar array de cartas

    constructor() {
        this.initializeDeck();
    }
    private initializeDeck(): void {
        const suits: string[] = ["♥", "♦", "♣", "♠"];
        const values: string[] = [
            "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
        ];  
        for (const suit of suits) { //recorrer palos
            for (const value of values) { //recorrer valores
                this.cards.push(new Card(suit, value)); //crear carta y añadir al array
            }
        }   
    }

    //crear metodo para barajar
    public shuffle(): void {
        this.cards.sort(() => Math.random() - 0.5);
    }

    //crear metodo para repartir 
    public dealCard(): Card | undefined {
        return this.cards.pop(); //sacar ultima carta del array, la que est[a encima
    }
}