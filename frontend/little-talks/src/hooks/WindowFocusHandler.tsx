import React, { useEffect } from "react";

// // User has switched back to the tab
// const onFocus = () => {
//     console.log("Tab is in focus");
// };

// // User has switched away from the tab (AKA tab is hidden)
// const onBlur = () => {
//     console.log("Tab is blurred");
// };

const WindowFocusHandler = (onFocus:()=>void, onBlur:()=>void) => {
    useEffect(() => {
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        // Calls onFocus when the window first loads
        // Specify how to clean up after this effect:
        // return () => {
        //     window.removeEventListener("focus", onFocus);
        //     window.removeEventListener("blur", onBlur);
        // };
  }, []);

    return <></>;
};

export default WindowFocusHandler;