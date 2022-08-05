import { IonHeader, IonBadge, IonItem, IonLabel, isPlatform } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { BsChatFill } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa";
import "../theme/tailwind.css";
import "../theme/variables.css";
import LilTalksIcon from "./LilTalksIcon";
import Scoreboard from "./Scoreboard";

type BoardEntryType = {
  rank?: number;
  username?: string;
  points: number;
};

const TopBar: React.FC<{ serverURL?: string, notifyLB?:boolean, setNotifyLB?:(v:boolean)=>void }> = ({
  serverURL = "https://little-talks.herokuapp.com",
  notifyLB = false,
  setNotifyLB
}) => {
  const [openSB, setOpenSB] = useState<boolean>();
  const [scoreboard, setScoreboard] = useState<BoardEntryType[]>();
  // const [notifyLB, setNotifyLB] = useState<boolean>(false)
  const getScoreboard = () => {
    fetch(serverURL + "/scoreboard")
      .then((res) => res.json())
      .then((data) => {
        var dataSorted = data.sort((a: BoardEntryType, b: BoardEntryType) => {
          return b.points - a.points;
        });
        var dataComplete = dataSorted.map((v: BoardEntryType, i: number) => {
          v.rank = i + 1;
          return v;
        });
        setScoreboard(dataComplete);
      });
  };
  const [topOffset, setTopOffset]=useState<string>("mt-1")
  useEffect(()=>{
    if(isPlatform('ios') && isPlatform('pwa'))setTopOffset("mt-4")
  },[]);
  const [notifyType, setNotifyType]=useState<string>("animate-ping")
  useEffect(()=>{
    if(notifyLB){
      setTimeout(() => {
        setNotifyType("animate-bounce")
      }, 6000);
    }
  },[notifyLB])
  return (
    <React.Fragment>
      <IonHeader className="relative">
        <div className="absolute w-full h-full dark:bg-ion-dark bg-white"></div>
        <div className={`relative w-full h-12 mb-1 ${topOffset}`}>
          <div className="absolute w-full h-full flex justify-center items-center">
            <div className="grow h-full flex items-center text-center justify-center font-mono dark:text-white text-black text-base sm-w:text-xs">
              L I T T L E &nbsp;
              {/* <BsChatFill /> */}
              <LilTalksIcon />
              &nbsp; T A L K S
            </div>
            <div className="h-full sm:w-0 w-12"></div>
          </div>
          <div className="absolute w-full h-full flex justify-end items-center">
            <div className="grow h-full sm:grow-0"></div>
            <div className=" relative h-full px-2 flex justify-center items-center">
              {notifyLB&&
                <div className=" h-[85%] flex items-start">
                  <IonBadge
                    color="warning"
                    className={`py-[0.1rem] absolute left-0 px-1 ${notifyType}`}
                  >
                    !
                  </IonBadge>
                </div>
              }
              <button
                type="button"
                className="p-2 md:text-lg dark:gradient-theme-dark gradient-theme-light text-white rounded-lg active:bg-white active:text-ion-dark shadow-green-900 shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  getScoreboard();
                  setOpenSB(true);
                  if(setNotifyLB)setNotifyLB(false);
                }}
              >
                <FaTrophy />
              </button>
            </div>
          </div>
        </div>
      </IonHeader>
      {openSB && <Scoreboard onClose={setOpenSB} entries={scoreboard} />}
    </React.Fragment>
  );
};

export default TopBar;
