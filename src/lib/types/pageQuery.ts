export type PageQuery = {
  sort: 'created' | 'updated' | 'archived';
  order: 'asc' | 'desc';
  perPage: number;
  since: number;
  page: number;
  tags: string;
  content: 'metadata' | 'full';
};
