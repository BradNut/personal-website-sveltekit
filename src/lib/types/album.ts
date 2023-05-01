export type Album = {
	url: string;
	artwork: string;
	title: string;
	artist: string;
	src?: ExternalImageSource[];
};

export type ExternalImageSource = {
	format: string;
	src: string;
	width: number;
	height?: number;
};
