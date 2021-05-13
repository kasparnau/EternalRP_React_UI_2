import "./Pages.css";
import React from "react";
import { useProfileStore } from "./../store";
import {
  Button,
  FilledInput,
  FormControl,
  InputLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CoolBox from "./../components/CoolBox";
import moment from "moment";

const axios = require("axios");

const Page = (props) => {
  const userData = useProfileStore((store) => store.userData);
  const [pendingApps, setPendingApps] = React.useState(false);
  const [currentApp, setCurrentApp] = React.useState(false);

  function refreshAppData() {
    axios
      .get("/api/staff/getPendingApps")
      .then((res) => {
        let apps = res.data;

        for (let i = 0; i < apps.length; i++) {
          let answersObj = JSON.parse(apps[i].answers);
          let newAnswers = [];

          for (const property in answersObj) {
            newAnswers.push([property, answersObj[property]]);
          }

          apps[i].answers = newAnswers;
        }

        setPendingApps(apps);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    refreshAppData();
  }, []);

  const processApp = (action) => {
    setPendingApps((apps) => {
      let newApps = apps.filter((app) => app.id !== currentApp.id);
      return newApps;
    });
    setCurrentApp(false);

    axios
      .post("/api/staff/processApp", {
        id: currentApp.id,
        hex: currentApp.hex,
        action: action,
      })
      .then((res) => {
        refreshAppData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function acceptApp() {
    processApp("accept");
  }

  function rejectApp() {
    processApp("reject");
  }

  return (
    <div className="PageMain">
      {userData && pendingApps && (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ width: "20%" }}>
              <CoolBox title="Pending" />
              {pendingApps.map((app) => {
                return (
                  <CoolBox
                    style={{ paddingTop: "px" }}
                    onClick={() => setCurrentApp(app)}
                    title={`${app.id} | ${app.name}`}
                    description={moment(app.timestamp * 1000).fromNow()}
                  />
                );
              })}
            </div>
            <div style={{ width: "80%" }}>
              <CoolBox
                title={`Selected App: ${
                  currentApp ? `${currentApp.id} | ${currentApp.name}` : ""
                }`}
              />
              {currentApp &&
                currentApp.answers.map((question) => {
                  return (
                    <CoolBox
                      titleSize="16px"
                      title={question[0]}
                      description={question[1]}
                    />
                  );
                })}

              {currentApp && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "32px",
                  }}
                >
                  <CoolBox
                    style={{ backgroundColor: "var(--green)" }}
                    centerTitle
                    title="ACCEPT"
                    onClick={acceptApp}
                  />
                  <CoolBox
                    style={{ backgroundColor: "var(--red)" }}
                    centerTitle
                    title="REJECT"
                    onClick={rejectApp}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
