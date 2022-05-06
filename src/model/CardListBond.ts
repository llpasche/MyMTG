export class CardListBond {
  constructor(
    private bondId: string,
    private cardId: string,
    private listId: string
  ) {}

  public getBondId = (): string => {
    return this.bondId;
  };
  public getCardId = (): string => {
    return this.cardId;
  };
  public getlistId = (): string => {
    return this.listId;
  };
}
