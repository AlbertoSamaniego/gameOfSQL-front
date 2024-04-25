export interface User {
  email: string;
  password: string;
  name_character: string | null;
  nickname_character: string | null;
  name_house: string | null;
  words_house: string | null;
  shield: string | null;
  archievements: string[] | null;
}
