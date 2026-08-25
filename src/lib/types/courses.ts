export type LearningSourceLink = {
  text: string;
  href: string;
};

export type LearningSource = {
  name: string;
  href?: string;
  links?: LearningSourceLink[];
  tags: string[];
};