export interface Point {
  id: string;
  title: string;
  history: string;
  question: string | false;
  er_image: string;
  history_image: string;
  coordinates: string | false;
  next_points: string[];
}
