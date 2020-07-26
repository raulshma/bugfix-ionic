export interface Fix {
  id: number;
  title: string;
  description: string;
  votes: number;
  image: null;
  bug_id: number;
  user_id: number;
  votes_fix: Votes_Fix[];
}

export interface VOTES_POST {
  user_id: number;
  fix_id: number;
  is_upvote: boolean;
}

export interface Votes_Fix {
  id: number;
  user_id: number;
  fix_id: number;
  is_upvote: boolean;
}
