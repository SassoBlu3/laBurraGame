export interface IPlayer {
  id: string;
  name: string;
  hand: ICard[];
  isHuman: boolean;
  playCard(cardIndex: number): ICard | null;
  drawCard(card: ICard): void;
}