import { IGame } from "../interfaces/IGame.js";
import { IPlayer } from "../interfaces/IPlayer.js";
import { HumanPlayer } from "./HumanPlayer.js";
import { CPUPlayer } from "./CPUPlayer.js";
import { Card } from "./Card.js";
import { Deck } from "./Deck.js";

export class Game extends EventTarget implements IGame {
    players: IPlayer[] = [];
    deck: Deck;
    activeCard: Card | null = null;
    currentSuit: string = "";
    isHumanTurn: boolean = true;
    isFirstRound: boolean = true;

    humanPlayedCard: Card | null = null;
    cpuPlayedCard: Card | null = null;

    roundWinner: 'human' | 'cpu' | null = null;

    gameOver: boolean = false;
    gameWinner: 'human' | 'cpu' | null = null;

    constructor(playerNames: string[]) {
        super();

        this.deck = new Deck();
        this.deck.shuffle();

        this.players.push(new HumanPlayer("player-1", playerNames[0]));
        this.players.push(new CPUPlayer());

        console.log("Jugadores iniciados.");
    }

    // ===========================
    //        START GAME
    // ===========================
    startGame(): void {
        console.log("INICIANDO PARTIDA");

        this.deck = new Deck();
        this.deck.shuffle();

        // Reset estados
        this.players.forEach(p => p.hand = []);
        this.isFirstRound = true;
        this.humanPlayedCard = null;
        this.cpuPlayedCard = null;
        this.roundWinner = null;
        this.gameOver = false;
        this.gameWinner = null;

        // Repartir 5 cartas
        for (let i = 0; i < 5; i++) {
            this.players.forEach(player => {
                const card = this.deck.dealCard();
                if (card) player.drawCard(card);
            });
        }

        // Carta inicial
        const initialCard = this.deck.dealCard();
        if (initialCard) {
            this.activeCard = initialCard;
            this.currentSuit = initialCard.suit;
            console.log(
                `Carta inicial: ${initialCard.mostrarNombreCompleto()} – Palo actual: ${this.currentSuit}`
            );
        }

        this.isHumanTurn = true;
        this.dispatchEvent(new CustomEvent("game-state-changed"));
    }

    // ===========================
    //       HUMAN TURN
    // ===========================
    playTurn(player: IPlayer, cardIndex: number): boolean {
        if (!this.isHumanTurn) {
            console.warn("No es tu turno.");
            return false;
        }

        const hasSuit = player.canPlaySuit(this.currentSuit);
        const cardToPlay = player.hand[cardIndex];

        if (!cardToPlay) return false;

        if (!hasSuit) {
            console.log(`${player.name} no tiene ${this.currentSuit} y debe robar.`);
            this.handleDrawIfNecessary(player);
            return false;
        }

        if (cardToPlay.suit !== this.currentSuit) {
            console.warn(`Debes jugar del palo ${this.currentSuit}.`);
            return false;
        }

        // Carta válida
        player.playCard(cardIndex);
        this.activeCard = cardToPlay;
        this.humanPlayedCard = cardToPlay;

        console.log(`${player.name} juega: ${cardToPlay.mostrarNombreCompleto()}`);

        this.isHumanTurn = false;

        this.dispatchEvent(new CustomEvent("game-state-changed"));

        setTimeout(() => this.playCPUTurn(), 1000);

        return true;
    }

    // ===========================
    //        CPU TURN
    // ===========================
    private playCPUTurn(): void {
        const cpu = this.players.find(p => !p.isHuman) as CPUPlayer;
        if (!cpu) return;

        console.log("Turno de CPU...");

        const hasSuit = cpu.canPlaySuit(this.currentSuit);

        if (hasSuit) {
            const cardIndex = cpu.hand.findIndex(c => c.suit === this.currentSuit);
            const card = cpu.playCard(cardIndex);

            if (card) {
                this.activeCard = card;
                this.cpuPlayedCard = card;
                console.log(`CPU juega: ${card.mostrarNombreCompleto()}`);
            }
        } else {
            this.handleDrawIfNecessary(cpu);
        }

        this.determineRoundWinner();

        if (!this.gameOver) {
            this.isHumanTurn = this.roundWinner === "human";
        }

        this.dispatchEvent(new CustomEvent("game-state-changed"));
    }

    // ===========================
    //     DETERMINAR GANADOR
    // ===========================
    private determineRoundWinner(): void {

        if (!this.humanPlayedCard || !this.cpuPlayedCard) return;

        const humanRank = this.getCardValue(this.humanPlayedCard);
        const cpuRank = this.getCardValue(this.cpuPlayedCard);

        console.log(`\n========== RONDA TERMINADA ==========`);
        console.log(`Tu carta: ${this.humanPlayedCard.mostrarNombreCompleto()} (Rank: ${humanRank})`);
        console.log(`CPU carta: ${this.cpuPlayedCard.mostrarNombreCompleto()} (Rank: ${cpuRank})`);

        if (humanRank > cpuRank) {
            this.roundWinner = "human";
            this.currentSuit = this.humanPlayedCard.suit;
            console.log("GANADOR DE LA RONDA: ¡TÚ!");
        } else {
            this.roundWinner = "cpu";
            this.currentSuit = this.cpuPlayedCard.suit;
            console.log("GANADOR DE LA RONDA: CPU");
        }

        setTimeout(() => {
            this.humanPlayedCard = null;
            this.cpuPlayedCard = null;
            this.dispatchEvent(new CustomEvent("game-state-changed"));
        }, 1500);

        this.isFirstRound = false;

        this.checkGameOver();
    }

    // ===========================
    //        CARD VALUES
    // ===========================
    private getCardValue(card: Card): number {
        const rankValues: Record<string, number> = {
            "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
            "8": 8, "9": 9, "10": 10,
            "J": 11, "Q": 12, "K": 13, "A": 14
        };
        return rankValues[card.rank] || 0;
    }

    // ===========================
    //      CHECK GAME OVER
    // ===========================
    private checkGameOver(): boolean {
        for (const player of this.players) {
            if (player.hand.length === 0) {
                this.gameOver = true;
                this.gameWinner = player.isHuman ? "human" : "cpu";
                console.log(`${player.name} ganó la partida!`);
                this.dispatchEvent(new CustomEvent("game-over", {
                    detail: { winner: this.gameWinner }
                }));
                return true;
            }
        }
        return false;
    }

    // ===========================
    //     DRAW IF NECESSARY
    // ===========================
    public handleDrawIfNecessary(player: IPlayer): void {
        console.log(`${player.name} no tiene ${this.currentSuit}. Debe robar.`);

        while (this.deck.cards.length > 0) {
            const drawnCard = this.deck.dealCard();

            if (drawnCard) {
                player.drawCard(drawnCard);
                console.log(`...roba: ${drawnCard.mostrarNombreCompleto()}`);

                if (drawnCard.suit === this.currentSuit) {
                    const idx = player.hand.length - 1;
                    const played = player.playCard(idx);

                    if (played) {
                        this.activeCard = played;
                        console.log(`¡${player.name} encontró y jugó: ${played.mostrarNombreCompleto()}`);
                    }
                    break;
                }
            }
        }

        this.dispatchEvent(new CustomEvent("game-state-changed"));
    }
}
