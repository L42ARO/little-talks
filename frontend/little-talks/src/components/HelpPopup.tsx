import React from 'react';
import {FaQuestionCircle, FaSafari,FaChrome} from "react-icons/fa";
import {MdOutlineCloseFullscreen,MdSmartphone,MdComputer} from "react-icons/md";
import {FiDownload} from "react-icons/fi";
import {IoShareOutline} from "react-icons/io5"
import { isPlatform } from '@ionic/react';
import {BsPlusSquare,BsThreeDotsVertical} from 'react-icons/bs';
import LilTalksIcon from "../components/LilTalksIcon";

const HelpPopUp:React.FC<{type:string, setOpen:(v:boolean)=>void}>= (props)=>{
    return (
        <div className="fixed w-full h-full backdrop-blur-sm z-[9999] flex justify-center items-center">
        <div className="absolute bg-gray-500 w-full h-full opacity-25"></div>
        <div className="sm-w:w-5/6 w-1/3 h-fit dark:bg-ion-dark z-[99] bg-white overflow-hidden rounded-2xl flex flex-col items-center justify-center sm-w:px-6 px-10 py-4">
          <div className="w-full flex justify-end">
            <button onClick={()=>{props.setOpen(false)}} className="active:text-amber-600 text-xl"><MdOutlineCloseFullscreen/></button>
          </div>
          <div className="font-mono flex items-center font-bold text-xl">
            {props.type==="help"&&<>&nbsp;H E L P&nbsp;<FaQuestionCircle/></>}
            {props.type==="install"&&<>&nbsp;INSTALL&nbsp;<FiDownload/></>}
          </div>
          <hr className="w-full h-[1px] dark:bg-white bg-black opacity-50 my-3"></hr>
          {props.type==="install"&&<div className="w-full text-sm mb-3 text-center dark:text-gray-300 text-gray-900">To install this App on your device follow these steps:</div>}
          <ol className="text-end">
                {props.type==="help"&&
                <>
                    <li className="py-2 flex items-center">👤<div className="grow text-center ml-1">Create a <u>unique</u> <b>username</b></div></li>
                    <li className="py-2 flex items-center">🧠<div className="grow text-center ml-1">Enter <b>the game</b> and <u>start guessing</u> words</div></li>
                    <li className="py-2 flex items-center">☝️<div className="grow text-center ml-1">Pay attention to the <b>hint</b> on <u>top</u></div></li>
                    <li className="py-2 flex items-center">🏆<div className="grow text-center ml-1">If you guess a word you'll appear on the <u>leaderboard</u></div></li>
                    <li className="py-2 flex items-center">🥇<div className="grow text-center ml-1"><b>Get on top!</b></div></li>
                </>}
                {props.type==="install"&&<>
                    {isPlatform('ios')&&<>
                        <li className="py-2 flex items-center text-2xl"><div className="grow text-center pr-1 text-sm">Open this web-app in <b>safari</b></div><FaSafari/></li>
                        <li className="py-2 flex items-center text-2xl sm-w:text-3xl"><div className="grow text-center pr-1 text-sm">Click on the <b>share button</b></div><IoShareOutline/></li>
                        <li className="py-2 flex items-center text-2xl sm-w:text-3xl"><div className="grow text-center pr-2 text-sm">Scroll down and select <b>Add to Home Screen</b></div><BsPlusSquare/></li>
                    </>}
                    {isPlatform('android')&&<>
                    <li className="py-2 flex items-center text-2xl"><div className="grow text-center mr-2 text-sm">Open this web-app in <b>Chrome</b></div><FaChrome/></li>
                        <li className="py-2 flex items-center text-2xl"><div className="grow text-center mr-1 text-sm">Click on the <b>Three dots</b></div><BsThreeDotsVertical/></li>
                        <li className="py-2 flex items-center text-2xl sm-w:text-3xl"><div className="grow text-center mr-1 text-sm">Select <b>Install App</b></div><MdSmartphone/></li>
                    </>}
                    {!isPlatform('android')&&!isPlatform('ios')&&<>
                    <li className="py-2 flex items-center text-2xl"><div className="grow text-center mr-2 text-sm">Open this web-app in <b>Chrome</b></div><FaChrome/></li>
                        <li className="py-2 flex items-center text-2xl"><div className="grow text-center mr-1 text-sm">Click on the <b>Three dots</b></div><BsThreeDotsVertical/></li>
                        <li className="py-2 flex items-center text-2xl sm-w:text-3xl"><div className="grow text-center mr-1 text-sm">Select <b>Install Little Talks...</b></div><MdComputer/></li>
                    </>}
                    <li className="py-2 flex items-center text-2xl sm-w:text-3xl"><div className="grow text-center pr-2 text-sm">Go through your Apps and look for <b>LilTalks</b></div><LilTalksIcon/></li>
                </>}
                
            </ol>
        </div>
      </div>
    )
}

export default HelpPopUp;