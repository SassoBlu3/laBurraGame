import { Card } from "../classes/Card.js";
export interface IPlayer {
  id: string;
  name: string; //nombre del jugador o cpu
  hand: Card[]; //cartas en la mano
  isHuman: boolean;
  playCard(cardIndex: number): Card | null;
  drawCard(card: Card): void;
  canPlaySuit(suit: string): boolean //para saber si el jugador tiene una carta que se pueda jugar del palo especifico
}