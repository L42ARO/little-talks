import {
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
} from "@ionic/react";
import Pusher from "pusher-js";
import React, { useEffect, useRef, useState } from "react";
import { BsChatFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useLocation } from "react-router";
import GameBanner from "../components/GameBanner";
import NeoKeyboard from "../components/NeoKeyboard";
import WindowFocusHandler from "../hooks/WindowFocusHandler";
import TopBar from "../components/Topbar";
import "../theme/tailwind.css";
import "./Chat.css";

type msg = {
  unique_id: string;
  username: string;
  message: string;
};
type homeState = {
  username: string;
  unique_id: string;
};
type ChatArgs = {
  chatActive?: boolean;
};
type Hint = {
  letters: number;
  correct: string[];
  ses_id: string;
};
const Chat: React.FC<ChatArgs> = ({ chatActive: fetchMsg = true }) => {
  // const serverURL="https://little-talks.herokuapp.com";
  const serverURL="https://little-talks.up.railway.app";
  // const serverURL = "http://127.0.0.1:8000";
  const location = useLocation<homeState>();
  const [wonRound, setWonRound] = useState<boolean>(false);
  const [otherWon, setOtherWon] = useState<boolean>(false);
  const [serverErr, setServerErr] = useState<boolean>(false);
  const [hint, setHint] = useState<Hint>();
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const username = location.state ? location.state.username : "Username";
  const unique_id = location.state ? location.state.unique_id : "1234567890";
  const [messages, setMessages] = useState<msg[]>([]);
  const [notifyLB, setNotifyLB] = useState<boolean>(false);
  const [message, setMessage] =
    useState<string | number | null | undefined>("");
  const [outMsg, setOutMsg] = useState<string | number | null | undefined>("");
  const [inMsg, setInMsg] = useState<msg>();
  useEffect(() => {
    subscribe();
    if (fetchMsg) {
      Pusher.logToConsole = true;

      // var pusher = new Pusher("223be03af29491e92fcf", {
      //   cluster: "mt1",
      // });
      var pusher = new Pusher('2d74d42707108f59bde7', {
        cluster: 'us2'
      });

      const channel = pusher.subscribe("chat");
      channel.bind("message", function (data: msg) {
        setInMsg(data);
      });
      return () => {
        pusher.unsubscribe(channel.name);
      };
    }
  }, []);

  useEffect(() => {
    if (inMsg) {
      if (inMsg.username === "serverAdmin") {
        if (inMsg.message === "correct!") {
          if (inMsg.unique_id === unique_id) {
            console.log("My correct Admin message");
            setWonRound(true);
            setNotifyLB(true);
            subscribe(3000);
          } else {
            setOtherWon(true);
            subscribe(3000);
          }
        } else if (inMsg.message === "bootingUp!") {
          setServerErr(true);
          subscribe(3000);
        }
      } else {
        setMessages([...messages, inMsg]);
      }
    }
  }, [inMsg]);
  useEffect(() => {
    if(messages.length>40){
      let msgs=messages;
      let msgDif = messages.length-40;
      msgs.splice(0,msgDif)
      setMessages(msgs);
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    window.addEventListener("focus", OnFocus);
    window.addEventListener("online", OnFocus);
    window.addEventListener("blur", OnBlur);
    window.addEventListener("offline", OnBlur);
    return () => {
          window.removeEventListener("focus", OnFocus);
          window.removeEventListener("blur", OnBlur);
          window.removeEventListener("online", OnFocus);
          window.removeEventListener("offline", OnBlur);
      };
  }, [messages]);
  const subscribe = async (time: number = 0) => {
    var res = await fetch(serverURL + "/subscribe");
    res.json().then((data) => {
      let dataParsed: Hint = data;
      if(hint){
        if(dataParsed.ses_id==hint.ses_id){
          return
        }

      }
      setHint(dataParsed);
      var newWord: msg = {
        username: "serverAdmin",
        message: "New Word",
        unique_id: "12345",
      };
      let cleanMsgs: msg[] = [];
      messages.forEach((v, i) => {
        if (v.username != "serverAdmin") {
          cleanMsgs.push(v);
        }
      });
      setTimeout(() => {
        setWonRound(false);
        setOtherWon(false);
        setServerErr(false);
        setMessages([...cleanMsgs, newWord]);
      }, time);
    });
  };
  const submit = async () => {
    let msgClone = JSON.parse(JSON.stringify(message));
    setMessage("");
    var res = await fetch(serverURL + "/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        unique_id,
        message: msgClone,
      }),
    });
    res.json().then((data) => {
      const dataParsed: Hint = data;
      if (hint) {
        let fixArr = hint.correct.map((v, i) => {
          if (dataParsed.correct[i] == "") {
            return v;
          }
          return dataParsed.correct[i];
        });
        dataParsed.correct = fixArr;
      }
      setHint(dataParsed);
    });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const OnFocus = () => {
    console.log("Back on focus calling subscribe 😄");
    subscribe(10);
  };
  const OnBlur = () => {
    console.log("Window not in focus ☹️");
  };
  // WindowFocusHandler(OnFocus, OnBlur);
  return (
    <IonPage>
      <TopBar
        serverURL={serverURL}
        notifyLB={notifyLB}
        setNotifyLB={setNotifyLB}
      />
      {wonRound && <GameBanner type="Correct" />}
      {!wonRound && !otherWon && hint && !serverErr && (
        <GameBanner type="Hint" hint={hint} />
      )}
      {otherWon && <GameBanner type="OtherWon" />}
      {serverErr && <GameBanner type="ServerErr" />}
      <IonContent>
        <div className="h-full w-full dark:gradient-slate-dark bg-slate-200">
          <div className="dark:gradient-slate-dark border-0 h-auto bg-slate-200 p-5 pt-16 w-full flex flex-col">
            {messages.map((msg, i) => {
              if (msg.username != "serverAdmin") {
                return (
                  <Bubble
                    key={`msg-${i}`}
                    currUser={msg.unique_id === unique_id}
                    username={msg.username}
                    message={msg.message}
                  />
                );
              }
              if (msg.message == "New Word") {
                return (
                  <div
                    key={`msg-${i}`}
                    className="w-full h-fit dark:gradient-yellow-dark gradient-yellow-light flex justify-center items-center rounded-full font-mono sm-w:text-sm"
                  >
                    G U E S S&nbsp;&nbsp;W O R D: &nbsp;&nbsp;{hint?.correct.length}{" "}
                    letters
                  </div>
                );
              }
            })}
            <div ref={bottomRef} />
          </div>
        </div>
      </IonContent>
      <IonFooter>
        {/* <div className="bottom-0 h-auto w-auto pb-2 p-2 flex items-center bg-ion-dark">
          <div className="grow">
            <IonItem className="rounded-xl">
              <IonInput
                className="sm:text-base text-xl"
                type="text"
                value={message}
                onIonChange={(e) => setMessage(e.target.value)}
                onKeyUp={(e) => {
                  e.preventDefault();
                  if (e.key === "Enter" || e.key === "13") submit();
                }}
              ></IonInput>
            </IonItem>
          </div>
          <div>
            <button
              type="button"
              className="text-blue-400 active:text-white text-[1.75rem] font-bold m-3 rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <IoMdSend />
            </button>
          </div>
        </div> */}
        <NeoKeyboard
          value={message}
          setValue={setMessage}
          submit={submit}
          chatBottom={scrollBottom}
        />
      </IonFooter>
    </IonPage>
  );
};
type Bubble = {
  username?: string;
  message?: string;
  currUser?: boolean;
};
const Bubble: React.FC<Bubble> = ({
  currUser = false,
  username = "Brian",
  message = "Always look on the bright side of life!",
}) => {
  let pos = "justify-start";
  let style =
    "dark:bg-green-500 bg-green-600 dark:text-black text-white rounded-bl-sm";
  if (currUser) {
    pos = "justify-end";
    style =
      "dark:bg-blue-500 bg-blue-600 dark:text-black text-white rounded-br-sm";
  }
  return (
    <div className={`w-full h-fit flex ${pos}`}>
      <div
        className={`w-fit max-w-[15rem] sm:max-w-lg ${style} h-auto m-2 text-base py-2 px-5 rounded-xl shadow-black shadow-md`}
      >
        <span className="font-mono font-bold sm:text-lg text-sm">
          {username}
        </span>
        <p className="font-sans">{message}</p>
      </div>
    </div>
  );
};

export default Chat;
