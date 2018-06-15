export class Message {
  constructor(
    public kind: string,
    public time: Date,
    public user: string,
    public msg: string) {}
}
