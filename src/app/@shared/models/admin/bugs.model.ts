
export interface Bug {
  id: number;
  title: string;
  description: string;
  is_fixed: boolean;
  image: string;
  user_id: number;
  tech_id: number;
  version_id: number;
  deleted_at: Date;
}
