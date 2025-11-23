import { IDeck } from './IDeck.js';
import {IPlayer} from './IPlayer.js';
import { ICard } from './ICard.js';

export interface IGame {
  deck: IDeck;
  players: IPlayer[];
  currentSuit: string; //palo que se está jugando en la ronda actual
  startGame(): void;
  playTurn(player: IPlayer, cardIndex: number): void;

}