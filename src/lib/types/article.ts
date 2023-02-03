export type Article {
	tags: string[];
	title: string;
	url: URL;
	hashed_url: string;
	reading_time: number;
	preview_picture: string;
	created_at: Date;
	updated_at: Date;
	archived_at: Date | null;
}