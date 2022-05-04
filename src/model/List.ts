export class List {
  constructor(
    private id: string,
    private name: string,
    private creatorId: string
  ) {}

  public getId = (): string => {
    return this.id;
  };
  public getName = (): string => {
    return this.name;
  };
  public getCreatorId = (): string => {
    return this.creatorId;
  };
}
