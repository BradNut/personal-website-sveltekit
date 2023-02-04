import type { ArticleTag } from './articleTag';

export type Article = {
	tags: ArticleTag[];
	title: string;
	url: URL;
	hashed_url: string;
	reading_time: number;
	preview_picture: string;
	created_at: Date;
	updated_at: Date;
	archived_at: Date | null;
};

export type WallabagArticle = {
	tags: WallabagTag[];
	title: string;
	url: URL;
	hashed_url: string;
	reading_time: number;
	preview_picture: string;
	created_at: Date;
	updated_at: Date;
	archived_at: Date | null;
};

export type WallabagTag = {
	id: number;
	label: string;
	slug: string;
};
