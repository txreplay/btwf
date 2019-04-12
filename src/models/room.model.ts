export interface Room {
  id: string;
  name: string;
  admin: string;
  players: Array<string>;
  isBuzzable: boolean;
  status: string;
  buzzer?: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}
