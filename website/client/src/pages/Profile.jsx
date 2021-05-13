import "./Pages.css";
import React from "react";
import { useProfileStore } from "./../store";
import { Button, makeStyles, Typography } from "@material-ui/core";

import HomePage from "./HomePage";
import CharactersPage from "./CharactersPage";
import WhitelistPage from "./WhitelistPage";
import StaffAppPage from "./StaffAppPage";

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: "#252636",
    "&:hover": {
      backgroundColor: "#3e4157",
    },
  },
  selectedButton: {
    backgroundColor: "#3e4157",
    "&:hover": {
      backgroundColor: "#3e4157",
    },
  },
}));

function SidebarButton(props) {
  const classes = useStyles();
  return (
    <div
      className="SidebarButton"
      onClick={() => {
        props.onClick(props.name);
      }}
    >
      <div style={{ padding: "4px" }}>
        <Button
          className={
            props.currentPage === props.name
              ? classes.selectedButton
              : classes.button
          }
          style={{
            width: "100%",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              width: "100%",
              color: "#a3a7cc",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginLeft: "16px",
            }}
          >
            <div style={{ marginLeft: "8px", display: "flex", width: "100%" }}>
              <div style={{ width: "10%", textAlign: "center" }}>
                {props.icon && <i class={`fas fa-${props.icon}`}></i>}
              </div>
              <div
                style={{ width: "90%", textAlign: "left", marginLeft: "8px" }}
              >
                {props.name}
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}

const Profile = () => {
  const userData = useProfileStore((store) => store.userData);

  const logOut = () => {
    window.location.assign("/api/logout");
  };

  const [currentPage, setPage] = React.useState("Home");

  const Menus = [
    ["Home", "house-user"],
    ["Characters", "user-friends"],
    ["Whitelist", "clipboard"],
    ["Donate", "money-bill-wave"],
  ];

  if (userData.admin && userData.admin > 0) {
    Menus.push(["STAFF: Applications", "user-shield"]);
  }

  const sidebarRows = [];
  for (let data of Menus) {
    const row = (
      <SidebarButton
        name={data[0]}
        icon={data[1]}
        onClick={setPage}
        currentPage={currentPage}
      />
    );
    sidebarRows.push(row);
  }

  return (
    <div className="Main">
      {userData && (
        <React.Fragment>
          <div className="Topbar" style={{ justifyContent: "flex-end" }}>
            <Button
              style={{
                fontSize: "12px",
                color: "white",
                marginRight: "8px",
                backgroundColor: "#a32733",
              }}
              onClick={logOut}
            >
              Log out
            </Button>
          </div>

          <div className="Holder">
            <div className="NavMenu">{sidebarRows}</div>
            <div className="Container">
              {currentPage === "Home" && <HomePage />}
              {currentPage === "Characters" && <CharactersPage />}
              {currentPage === "Whitelist" && <WhitelistPage />}
              {currentPage === "STAFF: Applications" && <StaffAppPage />}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Profile;
