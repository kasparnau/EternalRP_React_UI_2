import "./Pages.css";
import React from "react";
import { useProfileStore } from "./../store";
import { Button, makeStyles, Typography } from "@material-ui/core";
import CoolBox from "./../components/CoolBox";
import { padEnd } from "lodash";

const axios = require("axios");

const Page = (props) => {
  const userData = useProfileStore((store) => store.userData);

  const [characters, setCharacters] = React.useState(false);
  const [selectedCharacter, selectCharacter] = React.useState(false);

  const fetchCharacters = () => {
    axios
      .get("/api/characters/get")
      .then((res) => {
        console.log(res);
        setCharacters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div className="PageMain">
      {userData && characters && (
        <div style={{ height: "100%", width: "100%", display: "flex" }}>
          <div style={{ height: "100%", width: "50%" }}>
            <div className="CoolBoxHolder">
              <CoolBox title="Characters" />
              {characters.map((char) => {
                return (
                  <CoolBox
                    style={{ paddingTop: "px" }}
                    onClick={() => {
                      selectCharacter(char);
                    }}
                  >
                    <div>
                      {char.first_name} {char.last_name}
                    </div>
                  </CoolBox>
                );
              })}
            </div>
          </div>
          <div style={{ height: "100%", width: "50%", backgroundColor: "" }}>
            {selectedCharacter && (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CoolBox
                  title={`${selectedCharacter.first_name} ${selectedCharacter.last_name}`}
                >
                  <br />
                  <div>Citizen ID: {selectedCharacter.citizen_id}</div>
                  <br />
                  {selectedCharacter.faction_name && (
                    <div>
                      Faction:{" "}
                      {`${selectedCharacter.faction_name} ${
                        selectedCharacter.rank_name
                          ? `| ${selectedCharacter.rank_name}`
                          : ""
                      }`}
                    </div>
                  )}
                  {!selectedCharacter.faction_name && <div>No Faction</div>}
                  <br />
                  Born: {selectedCharacter.born}
                </CoolBox>
                <CoolBox
                  title={`Vehicles (${selectedCharacter.vehicles.length})`}
                >
                  {selectedCharacter.vehicles.map((vehicle) => {
                    return (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ width: "40%" }}>
                          Plate: {vehicle.plate}
                        </div>
                        <div style={{ width: "60%" }}>{vehicle.model}</div>
                      </div>
                    );
                  })}
                </CoolBox>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
