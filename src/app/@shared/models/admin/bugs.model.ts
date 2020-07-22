import { Tech } from './technologies.model';

export interface Bug {
  id: number;
  title: string;
  description: string;
  is_fixed: boolean;
  votes: number;
  image: string;
  user_id: number;
  tech_id: number;
  version_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  tech: Tech;
}
