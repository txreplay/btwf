export interface RoomModel {
  code: string;
  admin: string;
  type: string;
  teams?: Array<string>;
  players?: Array<string>;
}
