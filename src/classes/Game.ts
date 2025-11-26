import { IGame } from "../interfaces/IGame.js";
import { IPlayer } from "../interfaces/IPlayer.js";
import { HumanPlayer } from "./HumanPlayer.js";
import { Card } from "./Card.js";
import { Deck } from "./Deck.js";

export class Game implements IGame {
    players: IPlayer[] = [];
    deck: Deck;
    currentSuit: string = "";

    constructor(playerNames: string[]) {
        this.deck = new Deck();
        this.deck.shuffle();

        this.players.push(new HumanPlayer("player-1", playerNames[0]));
        this.players.push(new HumanPlayer("player-2", "CPU"));

        console.log("Jugadores iniciados:");
    }

    //inicia la partida
    public startGame(): void {
        console.log("INICIANDO PARTIDA");

        // repartir 5 cartas
        for (let i = 0; i < 5; i++) {
            this.players.forEach(player => {
                const card = this.deck.dealCard();
                if (card) player.drawCard(card);
            });
        }

        // carta inicial en mesa
        const initialCard = this.deck.dealCard();
        if (initialCard) {
            this.currentSuit = initialCard.suit;
            console.log(
                `Carta inicial: ${initialCard.mostrarNombreCompleto()} – Palo actual: ${this.currentSuit}`
            );
        }
    }

   
    public playTurn(player: IPlayer, cardIndex: number): void {
        const cardToPlay = player.playCard(cardIndex);

        if (!cardToPlay) return;

        const hasSuit = player.canPlaySuit(this.currentSuit);

        // jugada inválida
        if (cardToPlay.suit !== this.currentSuit && hasSuit) {
            console.warn(
                `${player.name}: NO puedes jugar ${cardToPlay.suit}. Debes jugar ${this.currentSuit}.`
            );
            return;
        }

        console.log(`${player.name} juega: ${cardToPlay.mostrarNombreCompleto()}`);
        this.currentSuit = cardToPlay.suit;
    }

    // robar carta si no tiene del palo actual
    public handleDrawIfNecessary(player: IPlayer): void {
        if (player.canPlaySuit(this.currentSuit)) return;

        console.log(`${player.name} no tiene ${this.currentSuit}. Debe robar.`);

        let drawnCard: Card | undefined;

        do {
            drawnCard = this.deck.dealCard();

            if (drawnCard) {
                player.drawCard(drawnCard);
                console.log(`...roba: ${drawnCard.mostrarNombreCompleto()}`);
            }
        } while (
            drawnCard &&
            drawnCard.suit !== this.currentSuit &&
            this.deck.cards.length > 0
        );

        if (drawnCard?.suit === this.currentSuit) {
            console.log(
                `¡${player.name} robaste el palo correcto! Debes jugar esa carta ahora.`
            );
        }
    }
}
