import "./App.css";
import React from "react";

import { Button } from "@material-ui/core";
import Modal from "react-modal";

import doEvent from "./doEvent.js";
import { Typography } from "@material-ui/core";

import NewCharacterModal from "./NewCharacterModal.jsx";
const IS_PROD = process.env.NODE_ENV === "production";

function SlotText(props) {
  return (
    <div
      className="CharacterSlotMiddleText"
      style={{ color: props.color && props.color }}
    >
      {props.children}
    </div>
  );
}

function App() {
  const [visible, updateVisible] = React.useState(!IS_PROD);
  const [characters, setCharacters] = React.useState([]);

  const [newModalOpen, openNewModal] = React.useState(false);
  const [createButtonDisabled, setButtonDisabled] = React.useState(true);

  const [values, setValues] = React.useState({
    first_name: "",
    last_name: "",
    gender: "",
    born: "2000-01-01",
  });

  function setValue(name, value) {
    setValues({ ...values, [name]: value });
  }

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.show !== undefined) {
        updateVisible(event.data.show);
      }
    });

    doEvent(
      "fetchCharacters",
      [],
      [
        {
          character_id: 3,
          character_name: "Pede Homo",
          gender: 0,
          date_of_birth: "1999-01-01",
          faction: {
            group: {
              faction_name: "LSPD",
            },
            member: {
              rank_name: "Chief of Police",
              rank_level: 100,
            },
          },
          job: "",
          phone_number: 396543813,
          dead: null,
          prison: null,
        },
        {
          character_id: 4,
          character_name: "Barack Obama",
          gender: 0,
          date_of_birth: "1999-01-01",
          faction: null,
          job: "",
          phone_number: 133623245,
          dead: null,
          prison: true,
        },
        {
          character_id: 5,
          character_name: "Uuga Buuga",
          gender: 0,
          date_of_birth: "1992-06-31",
          faction: null,
          job: "",
          phone_number: 133623245,
          dead: null,
          prison: null,
        },
      ]
    ).then((result) => {
      setCharacters(result);
    });
  }, []);

  function closeModal() {
    openNewModal(false);
  }

  function canCreate() {
    let c1 = values.first_name.length >= 3;
    let c2 = values.last_name.length >= 3;
    let c3 = values.gender === "female" || values.gender === "male";
    let c4 =
      new Date(values.born) < new Date("2000-01-02") &&
      new Date(values.born) > new Date("1899-12-31");

    console.log(values.born);

    return c1 && c2 && c3 && c4;
  }

  React.useEffect(() => {
    setButtonDisabled(!canCreate());
  }, [values]);

  function handleCreate() {
    if (canCreate()) {
      console.log("YAY!");
    }
  }

  return (
    <div>
      {visible && (
        <div className="App">
          <div className="Main">
            <div className="Top">
              <div style={{ padding: "1rem" }}>Welcome to JahPede :)</div>
            </div>
            <div className="Characters">
              {characters.map((character) => {
                return (
                  <div className="CharacterSlot">
                    <div className="CharacterSlotTop">
                      <Typography
                        variant="h6"
                        style={{
                          color: "white",
                        }}
                      >
                        {character.character_name}
                      </Typography>
                    </div>
                    <div className="CharacterSlotMiddle">
                      <SlotText>Citizen ID: {character.character_id}</SlotText>
                      {character.faction && (
                        <SlotText>
                          {character.faction.group.faction_name} |{" "}
                          {character.faction.member.rank_name}
                        </SlotText>
                      )}
                      {!character.faction && <SlotText>No Faction</SlotText>}
                      <SlotText>
                        {character.gender === 0 ? "Male" : "Female"}
                      </SlotText>
                      <SlotText>{character.date_of_birth}</SlotText>
                      {character.dead && (
                        <SlotText color="red">IN HOSPITAL</SlotText>
                      )}
                      {character.prison && (
                        <SlotText color="red">IN PRISON</SlotText>
                      )}
                    </div>
                    <div className="CharacterSlotBottom">
                      <Button
                        style={{
                          backgroundColor: "hsl(144, 60%, 36%)",
                          color: "white",
                          width: "100%",
                          margin: "6px",
                        }}
                      >
                        PLAY
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="Bottom">
              <Button
                style={{
                  backgroundColor: "hsl(144, 60%, 36%)",
                  color: "white",
                }}
                onClick={() => {
                  openNewModal(true);
                }}
              >
                CREATE NEW
              </Button>
            </div>
            {newModalOpen && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Modal
                  className="Modal"
                  isOpen={newModalOpen}
                  onRequestClose={closeModal}
                  style={{
                    overlay: {
                      backgroundColor: "rgba(255, 255, 255, 0)",
                    },
                  }}
                >
                  <div className="ModalContainer">
                    <NewCharacterModal
                      handleCreate={handleCreate}
                      createButtonDisabled={createButtonDisabled}
                      closeModal={() => {
                        openNewModal(false);
                      }}
                      values={values}
                      setValue={setValue}
                    />
                  </div>
                </Modal>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
