export interface Room {
  id?: string;
  name: string;
  admin: string;
  players: Array<string>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
