import { Fix, Votes_Bug } from '../fix.model';
import { Tech } from './technologies.model';

export interface Bug {
  id: number;
  title: string;
  description: string;
  is_fixed: Boolean;
  votes: number;
  image: string;
  user_id: number;
  tech_id: number;
  version_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  tech: Tech;
  fix: Fix[];
  votes_bug: Votes_Bug[];
}
