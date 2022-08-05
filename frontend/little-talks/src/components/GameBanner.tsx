import React, { useEffect, useState } from "react";
import "../theme/tailwind.css";
import "../theme/variables.css";
import "./gamebanner.css";
type Hint = {
  letters: number;
  correct: string[];
};

type BannerArgs = {
  type?: string;
  hint?: Hint;
};

const GameBanner: React.FC<BannerArgs> = ({ type, hint }) => {
  return (
    <div className="z-[999] relative w-full overflow-visible">
      <div className="absolute w-full h-14 flex items-center justify-center">
        {type == "Correct" ? (
          <CorrectBanner />
        ) : type === "Hint" ? (
          <HintBanner hint={hint} />
        ) : type === "OtherWon" ? (
          <OtherWonBanner />
        ) : type === "ServerErr" ? (
          <ServerErrBanner />
        ) : null}
      </div>
    </div>
  );
};

const CorrectBanner: React.FC = () => {
  return (
    <div className="animateFade w-fit dark:bg-green-700 bg-green-500 h-full rounded-b-3xl shadow-black drop-shadow-lg flex items-center justify-center">
      <span className="mx-10 my-2 text-base sm:text-lg dark:text-white text-black font-mono font-bold">
        C&nbsp;O&nbsp;R&nbsp;R&nbsp;E&nbsp;C&nbsp;T&nbsp;!
      </span>
    </div>
  );
};
const OtherWonBanner: React.FC = () => {
  return (
    <div className="animateFade w-fit dark:bg-red-700 bg-red-400 h-full rounded-b-3xl shadow-black drop-shadow-lg flex items-center justify-center">
      <span className="mx-10 my-2 text-base sm:text-lg dark:text-white text-black font-mono font-bold">
        WORD&nbsp;&nbsp;WAS&nbsp;&nbsp;GUESSED
      </span>
    </div>
  );
};
const ServerErrBanner: React.FC = () => {
  return (
    <div className="animateFade w-fit dark:bg-red-700 bg-red-400 h-full rounded-b-3xl shadow-black drop-shadow-lg flex items-center justify-center">
      <span className="mx-5 my-2 text-base sm:text-lg dark:text-white text-black font-mono font-bold text-center">
        SERVER ERROR:&nbsp;&nbsp;Changing word, sorry 😞
      </span>
    </div>
  );
};

const HintBanner: React.FC<{ hint?: Hint }> = ({ hint }) => {
  const correct = hint?.correct ? hint.correct : ["B", "", "W", "I", ""];

  return (
    <div className="w-fit dark:gradient-orange-dark gradient-orange-light shadow-amber-800 shadow-md h-full rounded-b-3xl drop-shadow-lg flex flex-col items-center justify-center">
      <div className="mx-10 text-xs dark:text-white text-black font-mono font-bold">
        H&nbsp;I&nbsp;N&nbsp;T
      </div>
      <div className="mx-8 my-1 text-lg sm:text-xl dark:text-white text-black font-mono font-bold flex">
        {correct.map((v, i) => {
          let last = i + 1 === correct.length;
          return (
            <LetterHint
              key={`letter-hint-${i}`}
              last={last}
              letter={correct[i]}
            />
          );
        })}
      </div>
    </div>
  );
};
const LetterHint: React.FC<{ last?: boolean; letter?: string }> = ({
  last,
  letter = "",
}) => {
  return (
    <React.Fragment>
      <div className="underline">
        {letter === "" ? <>&nbsp;</> : letter.toUpperCase()}
      </div>
      {!last ? <>&nbsp;</> : null}
    </React.Fragment>
  );
};

export default GameBanner;
