import "./../App.css";
import React from "react";

import { useProfileStore } from "../store";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import steam_button from "./../img/steam_button.png";
import steam_button2 from "./../img/steam_button2.png";

let quotes = [
  [`"Se on maailma parim server"`, `- Albert Einstein (1963)`],
  [`"Yes I can confirm it is indeed."`, `- Barack Obama (2004)`],
  [
    `Kui su isa pangakaardi number oleks kui palju raha sul on,`,
    `kui palju raha sul oleks?`,
  ],
  [`Klicerille saab raha anda donate menuust!`],
];

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const Home = () => {
  const setUserData = useProfileStore(
    (state) => state.setUserData
  ); /* CHANGE SELECTED PROFILE */

  const userData = useProfileStore((store) => store.userData);
  const [randomQuote, setRandomQuote] = React.useState(["", ""]);

  const logIn = () => {
    window.location.assign("/api/auth/steam");
  };

  React.useEffect(() => {
    setRandomQuote(quotes.sample());
  }, []);

  return (
    <div className="GradientBackground">
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontSize: "32px",
          fontWeight: 600,
        }}
      >
        {!userData && (
          <React.Fragment>
            <div>{randomQuote[0]}</div>
            <div>{randomQuote[1]}</div>
            <Button
              style={{ height: "66px", width: "109px", marginTop: "128px" }}
            >
              <img
                src={steam_button2}
                onClick={logIn}
                style={{ objectFit: "fill", height: "66px", width: "109px" }}
              />
            </Button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Home;
