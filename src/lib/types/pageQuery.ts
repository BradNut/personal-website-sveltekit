export type PageQuery = {
	sort: string;
	perPage: number;
	since: number;
	page: number;
	tags: string;
	content: 'metadata' | 'full';
};
