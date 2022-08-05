import React from "react";
import icon,{ ReactComponent as Logo }  from '../theme/icon.svg';
import icon2,{ ReactComponent as Logo2 }  from '../theme/iconSVG3opt2.svg';
import '../theme/tailwind.css';
const LilTalksIcon:React.FC=()=>{
    return(
        <div className="text-red">
             {/* <img src={icon2} alt="logo" className="xs-a:h-[25px] h-[30px]"/> */}
             <Logo2 className="dark:fill-white fill-black xs-a:h-[25px] h-[30px]"/>
        </div>
    )
}

export default LilTalksIcon;