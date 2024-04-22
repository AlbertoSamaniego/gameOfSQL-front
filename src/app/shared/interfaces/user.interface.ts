import { Archievement } from "./archievement.interface";
import { Shield } from "./shield.interface";

export interface User {
  email: string;
  password: string;
  name_character?: string;
  nickname_character?: string;
  name_house?: string;
  words_house?: string;
  shield?: Shield;
  archievements?: Archievement[];
}
