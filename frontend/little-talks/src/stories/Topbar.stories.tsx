import { IonContent, IonPage } from "@ionic/react";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import React from "react";
import TopBar from "../components/Topbar";

import '../theme/tailwind.css';
export default{
    title:"Topbar",
    component:TopBar
}

export const ChatTopbar:React.FC = ()=>(
    <IonPage>
            <TopBar />
            <IonContent>
                <div className="h-full w-full dark:bg-slate-900 bg-slate-200">
                </div>
            </IonContent>
    </IonPage>
);