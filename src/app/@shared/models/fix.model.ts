export interface Fix {
  id: number;
  title: string;
  description: string;
  votes: number;
  image: null;
  bug_id: number;
  user_id: number;
}


export interface UPDOWN_VOTES {
  id: number;
  isUpvote: boolean;
}
