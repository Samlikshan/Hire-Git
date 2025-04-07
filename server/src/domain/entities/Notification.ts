export class Notification {
  constructor(
    public type: string,
    public title: string,
    public job: string,
    // public company: string,
    public candidate: string,
    public message: string,
    public read: boolean,
    public action: { type: string; label: string; url: string },
    public createdAt?: Date,
    public _id?: string
  ) {}
}
