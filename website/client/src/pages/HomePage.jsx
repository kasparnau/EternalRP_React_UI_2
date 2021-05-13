import "./Pages.css";
import React from "react";
import { useProfileStore } from "./../store";
import { Button, makeStyles, Typography } from "@material-ui/core";
import CoolBox from "./../components/CoolBox";
import moment from "moment";

const axios = require("axios");

const Page = (props) => {
  const userData = useProfileStore((store) => store.userData);

  const [whitelist, setWhitelist] = React.useState(false);

  const refreshPageData = () => {
    axios
      .get("/api/whitelist/get")
      .then((res) => {
        setWhitelist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    refreshPageData();
  }, []);

  return (
    <div className="PageMain">
      {userData && whitelist && (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {userData.ban && (
            <CoolBox
              style={{ backgroundColor: "#a32733" }}
              title={`You are banned!`}
              // description={`Ban ID: ${userData.ban.id} | Reason: ${userData.ban.reason}`}
            >
              <div>{`Ban ID: #${userData.ban.id}`}</div>
              <div>{`Reason: ${userData.ban.reason}`}</div>
              <div>{`Banned by: ${userData.ban.banner}`}</div>
              <div style={{ marginTop: "6px" }}>{`Expires ${moment(
                (userData.ban.date + userData.ban.length) * 1000
              ).fromNow()}`}</div>
            </CoolBox>
          )}

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                height: "100%",
                width: "50%",
                display: "flex",
              }}
            >
              <div className="CoolBoxHolder">
                <CoolBox
                  title={`Welcome back, ${userData.displayName}!`}
                  description={`Tere tulemast tagasi ;)!`}
                />
                <CoolBox title={`Info`}>
                  <div>
                    Player ID:{" "}
                    {userData.player_id
                      ? userData.player_id
                      : "NONE (You haven't played the server yet)"}
                  </div>
                  <div>Steam ID: {userData.hex}</div>
                  {whitelist.priority && (
                    <div>Priority: {whitelist.priority}</div>
                  )}
                  {!whitelist.priority && <div>You aren't whitelisted!</div>}
                  <div>Character Slots: 3</div>

                  <br />
                  <div>
                    <img
                      src={userData.photos[2].value}
                      style={{
                        objectFit: "fill",
                        height: "120px",
                        width: "120px",
                      }}
                    />
                  </div>
                </CoolBox>
              </div>
            </div>
            <div style={{ height: "100%", width: "50%" }}>
              <div className="CoolBoxHolder">
                <CoolBox
                  title={`idk man`}
                  description={`siia poolele tulevad vb reeglid/patch noted/teated etc`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
