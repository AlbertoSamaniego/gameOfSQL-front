export interface Point {
  id: string;
  level: string | false;
  title: string;
  history: string;
  question: string | false;
  archievement: string | false;
  failed_required_points: string[];
  guessed_required_points: string[];
  coordinates: string | false;
  reward: string | false;
}
