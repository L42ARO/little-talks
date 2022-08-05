import React, { useState } from "react";
import { AiFillCloseCircle } from 'react-icons/ai';
import "../theme/tailwind.css";
import "../theme/variables.css";

type ScoreboardArgs={
    entries?:BoardEntryType[]
    onClose?:React.Dispatch<React.SetStateAction<boolean | undefined>>
}
const Scoreboard :React.FC<ScoreboardArgs>=({entries, onClose})=>{
    const [dummy, dummyClose]=useState<boolean>(false);
    const closeFunc = onClose? onClose:dummyClose;
    let entries2put=entries?entries:[
        {rank:1, username:"Mad Max", points:1985},
        {rank:2, username:"Megamind", points:201},
        {rank:3, username:"Parzival", points:45}
    ];
    return(
        <div className="fixed z-[9999] w-full h-full">
            <div className="absolute z-[9999] w-full h-full flex justify-center items-center">
                <div className="relative sm:w-3/4 w-11/12 h-3/4 dark:gradient-gray-dark bg-slate-300 rounded-2xl flex flex-col items-center justify-start border-slate-900 border-2">
                    <div className="h-14 w-full px-4 flex items-center">
                        <span className="dark:text-white text-black font-mono grow text-center">S C O R E B O A R D</span>
                        <div className="w-12 h-full"></div>
                    </div>
                    <div className="z-[9999] absolute px-4 w-full h-12 flex items-center justify-end">
                        <button type="button" className="w-12 h-11/12 text-2xl dark:text-slate-400 text-slate-600 active:text-blue-500 flex items-center justify-center" onClick={e=>{
                            e.preventDefault();
                            closeFunc(false);
                        }}>
                            <AiFillCloseCircle/>
                        </button>
                    </div>
                    <div className="w-full h-full bg-ion-dark pt-3 rounded-b-2xl overflow-auto">
                        <div className="px-5 py-1 grid grid-cols-6  sm:grid-cols-4 font-mono font-bold">
                            <div className="text-fuchsia-600 text-center px-2">#</div>
                            <div className="col-span-3 sm:col-span-2 text-fuchsia-600 truncate px-2">USERNAME</div>
                            <div className="text-fuchsia-600 px-2 sm:col-span-1 col-span-2 truncate">POINTS</div>
                        </div>
                        {
                            entries2put.map((v,i)=>{
                                return <BoardEntry key={`entry-${i}`} username={v.username} rank={v.rank} points={v.points}></BoardEntry>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="w-full h-full">
                <div className="absolute w-full h-full bg-gray-900 opacity-70"></div>
                <div className="absolute w-full h-full backdrop-blur-sm"></div>
            </div>
        </div>
    )
}
type BoardEntryType={
    rank?:number,
    username?:string,
    points?:number,
}
const BoardEntry:React.FC<BoardEntryType>=({rank=1, username="Frederich", points=69420})=>{
    return(
        <div className="px-5 py-1 grid grid-cols-6  sm:grid-cols-4 font-mono">
            <div className="text-white text-center px-2 truncate">{(rank<10)?"0"+rank.toString():rank}</div>
            <div className="col-span-3 sm:col-span-2 text-green-500 truncate px-2">{username}</div>
            <div className="text-blue-500 px-2 sm:col-span-1 col-span-2 truncate">{points}</div>
        </div>
    )
}

export default Scoreboard;