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
    isHumanTurn: boolean = true; // Control de turno

    constructor(playerNames: string[]) {
        super(); // Necesario al extender EventTarget
        this.deck = new Deck();
        this.deck.shuffle();

        this.players.push(new HumanPlayer("player-1", playerNames[0]));
        this.players.push(new CPUPlayer()); // Usar la clase correcta

        console.log("Jugadores iniciados:");
    }

    // Inicia la partida
    public startGame(): void {
        console.log("INICIANDO PARTIDA");
        this.deck = new Deck(); // Reiniciar mazo
        this.deck.shuffle();

        // Limpiar manos
        this.players.forEach(p => p.hand = []);

        // Repartir 5 cartas
        for (let i = 0; i < 5; i++) {
            this.players.forEach(player => {
                const card = this.deck.dealCard();
                if (card) player.drawCard(card);
            });
        }

        // Carta inicial en mesa
        const initialCard = this.deck.dealCard();
        if (initialCard) {
            this.activeCard = initialCard;
            this.currentSuit = initialCard.suit;
            console.log(
                `Carta inicial: ${initialCard.mostrarNombreCompleto()} – Palo actual: ${this.currentSuit}`
            );
        }

        this.isHumanTurn = true; // Empieza el humano
    }

    // Jugar turno del humano
    public playTurn(player: IPlayer, cardIndex: number): boolean {
        if (!this.isHumanTurn && player.isHuman) {
            console.warn("No es tu turno.");
            return false;
        }

        const cardToPlay = player.hand[cardIndex]; // Solo mirar, no quitar todavía

        if (!cardToPlay) return false;

        const hasSuit = player.canPlaySuit(this.currentSuit);

        // Validación: Debe seguir el palo si tiene
        if (hasSuit && cardToPlay.suit !== this.currentSuit) {
            console.warn(
                `${player.name}: NO puedes jugar ${cardToPlay.suit}. Debes jugar ${this.currentSuit}.`
            );
            return false; // Jugada inválida
        }

        // Si pasa validación, jugamos la carta
        player.playCard(cardIndex); // Ahora sí la quitamos
        this.activeCard = cardToPlay;
        this.currentSuit = cardToPlay.suit;
        console.log(`${player.name} juega: ${cardToPlay.mostrarNombreCompleto()}`);

        // Cambio de turno
        this.isHumanTurn = false;

        // Programar turno CPU
        setTimeout(() => this.playCPUTurn(), 1500);

        return true;
    }

    // Turno de la CPU
    private playCPUTurn(): void {
        const cpu = this.players.find(p => !p.isHuman) as CPUPlayer;
        if (!cpu) return;

        console.log("Turno de CPU...");

        // 1. Verificar si tiene carta del palo
        const hasSuit = cpu.canPlaySuit(this.currentSuit);

        if (hasSuit) {
            // Estrategia simple: jugar la primera válida
            const cardIndex = cpu.hand.findIndex(c => c.suit === this.currentSuit);
            if (cardIndex !== -1) {
                const card = cpu.playCard(cardIndex);
                if (card) {
                    this.activeCard = card;
                    this.currentSuit = card.suit; // El palo sigue siendo el mismo, o cambia si es nueva ronda (reglas simples por ahora)
                    console.log(`CPU juega: ${card.mostrarNombreCompleto()}`);
                }
            }
        } else {
            // 2. Si no tiene, debe robar hasta encontrar o vaciar mazo
            this.handleDrawIfNecessary(cpu);
        }

        // Volver turno al humano
        this.isHumanTurn = true;
        // Notificar a la UI (esto se haría idealmente con eventos, pero por ahora la UI sondeará o se actualizará tras el timeout)
        // Como no tenemos eventos, la UI en index.ts necesitará saber cuándo actualizarse. 
        // Por simplicidad, index.ts puede pasar un callback o sondear.
        // Vamos a añadir un callback simple si es necesario, o dejar que index.ts maneje el estado.
        // Notificar a la UI mediante un evento propio de la instancia Game
        this.dispatchEvent(new CustomEvent('game-state-changed'));
    }

    // Robar carta si no tiene del palo actual
    public handleDrawIfNecessary(player: IPlayer): void {
        console.log(`${player.name} no tiene ${this.currentSuit}. Debe robar.`);

        let drawnCard: Card | undefined;
        let found = false;

        // Límite de seguridad para no colgar
        let attempts = 0;
        while (!found && this.deck.cards.length > 0 && attempts < 50) {
            drawnCard = this.deck.dealCard();
            attempts++;

            if (drawnCard) {
                player.drawCard(drawnCard);
                console.log(`...roba: ${drawnCard.mostrarNombreCompleto()}`);

                if (drawnCard.suit === this.currentSuit) {
                    found = true;
                    // Jugarla inmediatamente
                    const index = player.hand.length - 1;
                    const played = player.playCard(index);
                    if (played) {
                        this.activeCard = played;
                        // this.currentSuit se mantiene
                        console.log(`¡${player.name} encontró y jugó: ${played.mostrarNombreCompleto()}`);
                    }
                }
            }
        }
    }
}
