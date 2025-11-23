import { IGame } from "../interfaces/IGame.js";
import { IPlayer } from "../interfaces/IPlayer.js";
import { HumanPlayer } from "./HumanPlayer.js";
import { Card } from "./Card.js";
import { Deck } from "./Deck.js";   

export class Game implements IGame {
    players: IPlayer[] = [];
    deck: Deck;
    currentSuit: string = ""; //palo que se está jugando en la ronda actual

    constructor(playerNames: string[]) {
        this.deck = new Deck();
        this.deck.shuffle();

    // crear jugadores (humano y CPU )
        this.players.push(new HumanPlayer ("player-1", playerNames[0])); //por ahora dos jugadores humanos
        this.players.push(new HumanPlayer("player-2", "CPU")); //por ahora dos jugadores humanos para probar

        console.log("Jugadores inciado:");
    }

    //metodo para iniciarl el juego
    public startGame(): void {
        console.log("INICIANDO PARTIDA");
        //repartir 5 cartas a cada jugador
        for (let i = 0; i < 5; i++) {
            this.players.forEach(player => {
                const card = this.deck.dealCard(); 
                if (card) {
                    player.drawCard(card);
                } 
        
        const initialCard = this.deck.dealCard();
        if (initialCard) {
            this.currentSuit = initialCard.suit;
            console.log(`Carta inicial en juego: ${initialCard.mostrarNombreCompleto()}. Palo actual: ${this.currentSuit}`);
        }   

        //arbitro chequea si la jugada es valida: obtener la carta que el jugador quiere jugar y luego chequear si es válida
        playTurn(player: IPlayer, cardIndex: number): void {
            const cardToPlay = player.playCard[cardIndex];
