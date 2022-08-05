import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonList,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { BsChatFill } from "react-icons/bs";
import {FaQuestionCircle} from "react-icons/fa";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import "../theme/tailwind.css";
import LilTalksIcon from "../components/LilTalksIcon";
import HelpPopUp from "../components/HelpPopup";
import {FiDownload} from "react-icons/fi";
type HomeArgs = {
  version?: string;
};

const Home: React.FC<HomeArgs> = ({ version = "v0.00" }) => {
  const [username, setUsername] =
    useState<string | number | null | undefined>(null);
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<boolean>(true);
  const [centerHelp, setCenterHelp] = useState<string>("justify-between");
  useEffect(() => {
    var localUsername = localStorage.getItem("username");
    if (localUsername) {
      setNewUser(false);
      setUsername(JSON.parse(localUsername));
    }
    if (isPlatform('pwa')){
      setCenterHelp("justify-center");
    }
  }, []);
  useEffect(() => {
    if (username) {
      let noNoNames: string[] = ["serveradmin", "halliday"];
      if (noNoNames.includes(username.toString().toLowerCase())) {
        setValidUsername(false);
        return;
      }
      setValidUsername(true);
    }
  }, [username]);
  const [openHelp, setOpenHelp]=useState<boolean>(false)
  const [helpType, setHelpType]=useState<string>("help")
  return (
    <IonPage>
      {openHelp&&<HelpPopUp type={helpType} setOpen={setOpenHelp}/>}
      <IonHeader translucent={true}>
        <div className={`absolute w-full flex ${centerHelp} px-8 dark:text-white text-black font-mono text-3xl sm-h:mt-3 mt-7`}>
          {!isPlatform('pwa')&&<button onClick={()=>{
            setOpenHelp(true);
            setHelpType("install");
          }} type="button" className=" flexjustify-center active:text-green-700 animate-bounce">
            <FiDownload/>
          </button>}
          <button onClick={()=>{
            setOpenHelp(true)
            setHelpType("help")
            }} type="button" className="flex justify-center active:text-green-700">
            <FaQuestionCircle/>
          </button>
        </div>
      </IonHeader>
      <IonContent fullscreen>
        <div className="w-full h-[99%] flex flex-col justify-center items-center">
          <div className="w-full h-14 flex justify-center text-centeritems-center">
            <div className="w-3/4 h-full flex items-center text-center justify-center font-mono text-lg sm-w:text-sm xs-w:text-xs dark:text-white text-black">
              L I T T L E &nbsp;
              {/* <BsChatFill /> */}
              <LilTalksIcon />
              &nbsp; T A L K S
            </div>
          </div>
          <div className="w-56 m-2">
            <IonItem className="rounded-lg">
              <IonInput
                type="text"
                disabled={!newUser}
                placeholder="Username"
                maxlength={12}
                value={username}
                onIonChange={(e) => setUsername(e.target.value)}
              ></IonInput>
            </IonItem>
          </div>
          {/* <div className="w-56 m-2">
            <IonItem className="rounded-lg">
              <IonInput type="password" placeholder="Password"></IonInput>
            </IonItem>
          </div> */}
          {!newUser && (
            <div className="text-xs dark:text-gray-300 text-gray-500 font-mono">
              You must use your first entered username
            </div>
          )}
          {username != null &&
            username != "" &&
            (validUsername ? (
              <div className="w-fit m-2">
                <Link
                  onClick={() => {
                    localStorage.setItem("username", JSON.stringify(username));
                  }}
                  to={{
                    pathname: "/game",
                    state: {
                      username: username,
                      unique_id: uuid(),
                    },
                  }}
                  type="button"
                  className="dark:gradient-theme-dark gradient-theme-light text-white py-3 h-fit px-5 rounded-xl active:border border-white"
                >
                  Enter
                </Link>
              </div>
            ) : (
              <div className="text-red-400 sm-w:text-xs text-sm">
                Please select another username
              </div>
            ))}
        </div>
      </IonContent>
      <IonFooter>
        <div className="text-gray-600 w-full flex justify-center p-3 font-mono text-sm">
          {version}
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
