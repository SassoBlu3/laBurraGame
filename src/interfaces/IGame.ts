import { IDeck } from './IDeck.js';
import {IPlayer} from './IPlayer.js';
import { ICard } from './ICard.js';

export interface IGame {
  deck: IDeck;
  discard: ICard | null;
  players: IPlayer[];
  currentPlayerIndex: number;
  start(): void;
  nextTurn(): Promise<void>;
  playHumanCard(playerId: string, cardIndex: number): boolean;
  playerDraw(playerId: string): ICard | undefined;
  checkRoundWinner(): IPlayer | null; // compara últimas jugadas
  checkGameWinner(): IPlayer | null;  // si mano vacía => ganador absoluto
}
