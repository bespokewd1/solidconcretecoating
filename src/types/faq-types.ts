export type FaqInfo = {
  question: string;
  answer: string; // markdown string
};

export type RenderedFaq = FaqInfo & {
  html: string; // compiled HTML
};
