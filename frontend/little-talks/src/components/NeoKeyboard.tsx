import { IonItem, IonInput } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsChevronBarDown } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import "../theme/tailwind.css";
import "../theme/variables.css";
import "./neokeyboard.css";

type keyboardArgs = {
  value?: string | number | null | undefined;
  setValue?: React.Dispatch<
    React.SetStateAction<string | number | null | undefined>
  >;
  submit?: () => Promise<void>;
  chatBottom?: () => void;
};

const NeoKeyboard: React.FC<keyboardArgs> = ({
  value = "",
  setValue,
  submit,
  chatBottom,
}) => {
  const [message, setMessage] = [value, setValue];
  const [focused, setFocused] = useState<boolean>(false);
  const [keysDisabled, setKeysDisabled] = useState<boolean>(true);
  const Qwerty = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];
  const [isMobile, setIsMobile]=useState<boolean>(false);
  useEffect(()=>{
    setIsMobile(window.innerHeight<=700?true:false);
  },[]);
  return (
    <div className="w-full h-fit dark:bg-ion-dark bg-white pb-3 pt-1 flex flex-wrap flex-col justify-center">
      {focused && isMobile && (
        <div className="w-full relative flex items-end">
          <button
            type="button"
            onClick={(e) => {
              setFocused(false);
              setKeysDisabled(true);
            }}
            className="absolute h-7 w-12 dark:bg-ion-dark bg-white flex justify-center items-center rounded-t-full"
          >
            <BsChevronBarDown />
          </button>
        </div>
      )}
      <div className="h-auto w-full flex items-center px-3">
        {!focused && isMobile && (
          <button
            onClick={(e) => {
              setFocused(true);
              setTimeout(() => {
                setKeysDisabled(false);
              }, 10);
            }}
            className="z-[999] absolute w-11/12 h-12"
          ></button>
        )}
        <div className="grow">
          <IonItem className="rounded-xl" color="light">
            <IonInput
              disabled={isMobile}
              placeholder="Guess the word..."
              className="sm:text-base text-base dark:text-white text-black font-mono"
              type="text"
              value={message}
              onFocus={(e) => {
                setFocused(true);
                setTimeout(() => {
                  setKeysDisabled(false);
                }, 10);
              }}
              onIonChange={(e) => {
                if (setMessage) {
                  setMessage(e.target.value);
                }
              }}
              onKeyUp={(e) => {
                e.preventDefault();
                if ((e.key === "Enter" || e.key === "13") && submit) submit();
              }}
            ></IonInput>
          </IonItem>
        </div>
        <div className="z-[9999]">
          <button
            type="button"
            disabled={message == ""}
            className="text-blue-400 disabled:text-gray-500 active:text-blue-100 text-[1.75rem] font-bold m-3 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              if (submit) submit();
            }}
          >
            <IoMdSend />
          </button>
        </div>
      </div>
      {focused && isMobile && (
        <div className="flex flex-wrap justify-center h-40 px-3">
          {Qwerty.map((v, i) => {
            return (
              <div
                key={`keyboard-row-${i}`}
                className="flex w-full justify-center font-mono py-1"
              >
                {v.map((v, i) => {
                  return (
                    <Letter
                      key={`letter-${v.toLowerCase()}`}
                      char={v}
                      msg={message}
                      setMsg={setMessage}
                      disabled={keysDisabled}
                    />
                  );
                })}
                {i == 2 && (
                  <CharButton char="⌫" msg={message} setMsg={setMessage} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

type charButtonArgs = {
  char: string;
  msg?: string | number | null | undefined;
  setMsg?: null | React.Dispatch<
    React.SetStateAction<string | number | null | undefined>
  >;
  disabled?: boolean;
};
const Letter: React.FC<charButtonArgs> = ({
  char,
  msg,
  setMsg,
  disabled = false,
}) => (
  <button
    disabled={disabled}
    type="button"
    onClick={(e) => {
      let message = msg ? msg : "";
      message += msg != "" ? char : char.toUpperCase();
      if (setMsg && message) {
        setMsg(message);
      }
    }}
    className="dark:bg-gray-900 bg-gray-300 grow justify-center flex items-center md:m-1 m-[0.125rem] active:bg-gray-600 rounded-lg"
  >
    {msg != "" ? char : char.toUpperCase()}
  </button>
);
const CharButton: React.FC<charButtonArgs> = ({
  char,
  msg,
  setMsg,
  disabled = false,
}) => (
  <button
    disabled={disabled}
    type="button"
    className="dark:bg-gray-900 bg-gray-300 w-12 grow flex justify-center items-center md:m-2 m-[0.25rem] active:bg-gray-600 rounded-lg"
    onClick={(e) => {
      e.preventDefault();
      let message = msg ? msg : "";
      message = message.toString().slice(0, -1);
      if (setMsg) {
        setMsg(message);
      }
    }}
  >
    {char}
  </button>
);

const useCheckMobileScreen = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const handleWindowSizeChange = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  var res =height<=700
  console.log(res?"IS MOBILE":"IS NOT MOBILE")
  return res;
};

export default NeoKeyboard;
