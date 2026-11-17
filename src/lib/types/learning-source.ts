export type NotableWork = {
  text: string;
  href: string;
};

export type LearningSource = {
  name: string;
  href: string;
  notableWork?: NotableWork;
  subjects: string[];
};
