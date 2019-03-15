export interface Room {
  id?: string;
  name: string;
  admin: string;
  players: Array<string>;
  isBuzzable: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
