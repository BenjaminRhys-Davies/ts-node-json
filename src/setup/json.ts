import * as question from "../service/interrogation";
import * as parse from "../service/parser";
import * as correlate from "../service/correlation";
import { Document } from "../types/document";
import { FileAnswer } from "../command/query";

interface Words {
  [x: string]: number;
}

export const extension = ".json";

// Register content parsers
const parsers: parse.Register[] = [
  [
    extension,
    str => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return undefined;
      }
    }
  ],
];
parsers.forEach(args => parse.register.apply(null, args));

// Register interrogation questions
const bigramQuestionKey = "bigrams";

const questions: question.Register[] = [
  [
    bigramQuestionKey,
    ({ m_BiGrams }: Document) => m_BiGrams,
  ],
];
questions.forEach(args => question.register.apply(null, args));

// Register correlation criteria
const criteria: correlate.Register[] = [
  [
    "bigrams",
    answers => {
      const bigramReducer = (words: Words, [, { [bigramQuestionKey]: bigrams }]: FileAnswer) => {
        bigrams.forEach((w: string) => {
          const word = w.toLowerCase();
          words[word] = (words[word] ?? 0) + 1;
        });
        return words;
      };
      const words: Words = answers.reduce(
        bigramReducer,
        {},
      );

      return Object.keys(words)
        .map(text => ({
          text,
          frequency: words[text],
        }))
        .sort(({ frequency: oA }, { frequency: oB }) => oB - oA);
    },
  ],
];
criteria.forEach(args => correlate.register.apply(null, args));
