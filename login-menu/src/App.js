import "./App.css";
import React from "react";

import { Button } from "@material-ui/core";
import Modal from "react-modal";

import { Typography } from "@material-ui/core";

import Spinner from "react-spinners/RotateLoader";

import NewCharacterModal from "./NewCharacterModal.jsx";
import doEvent from "./doEvent.js";

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
  const [visible, updateVisible] = React.useState(true);
  const [characters, setCharacters] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [newModalOpen, openNewModal] = React.useState(false);
  const [createButtonDisabled, setButtonDisabled] = React.useState(true);
  const [createError, setCreateError] = React.useState("");

  const [values, setValues] = React.useState({
    first_name: "",
    last_name: "",
    gender: "",
    born: "2000-01-01",
  });

  const [current, setCurrent] = React.useState(undefined);

  function setValue(name, value) {
    if (name == "first_name" || name == "last_name") {
      value = value.replace(/\s+/g, "");
      value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      value = value.replace(/[0-9]/g, "");
    }
    setValues({ ...values, [name]: value });
  }

  function reloadCharacters() {
    setCurrent(undefined);
    setLoading(true);
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
      setLoading(false);
    });
  }

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.show !== undefined) {
        updateVisible(event.data.show);
      }
      if (event.data.setCurrent !== undefined) {
        setCurrent(event.data.setCurrent);
      }
      if (event.data.firstTime !== undefined) {
        openNewModal(true);
      }
    });
  }, []);

  React.useEffect(() => {
    if (visible) {
      reloadCharacters();
    }
  }, [visible]);

  function closeModal() {
    openNewModal(false);
  }

  function canCreate() {
    let c1 = values.first_name.length >= 3 && values.first_name.length <= 25;
    let c2 = values.last_name.length >= 3 && values.last_name.length <= 25;
    let c3 = values.gender === "female" || values.gender === "male";
    let c4 =
      new Date(values.born) < new Date("2000-01-02") &&
      new Date(values.born) > new Date("1899-12-31");

    return c1 && c2 && c3 && c4;
  }

  function getCreateError() {
    let c1 = values.first_name.length >= 3 && values.first_name.length <= 25;
    let c2 = values.last_name.length >= 3 && values.last_name.length <= 25;
    let c3 = values.gender === "female" || values.gender === "male";
    let c4 =
      new Date(values.born) < new Date("2000-01-02") &&
      new Date(values.born) > new Date("1899-12-31");

    if (!c3) {
      return "Vali sugupool!";
    }
    if (!c1) {
      return "Vali eesnimi!";
    }
    if (!c2) {
      return "Vali perekonnanimi!";
    }
    if (!c4) {
      return "Vali sünnipäev. (Peab olema vanem kui 2000)";
    }

    return false;
  }

  React.useEffect(() => {
    setButtonDisabled(!canCreate());
    setCreateError(getCreateError());
  }, [values]);

  function handleCreate() {
    if (canCreate()) {
      openNewModal(false);
      doEvent(
        "createCharacter",
        {
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
          born: values.born,
        },
        []
      ).then(() => {
        reloadCharacters();
      });
    }
  }

  function selectCharacter() {
    setLoading(true);
    doEvent("selectCharacter", { current }, []);
  }

  const handleClick = (e) => {
    doEvent(
      "click",
      {
        x: e.clientX,
        y: e.clientY,
      },
      true
    );
  };

  return (
    <div>
      {visible && (
        <div className="App" onMouseDown={handleClick}>
          <div className="Main">
            {loading && (
              <div className="Spinner">
                <Spinner color="white" size={15} loading={loading} />
              </div>
            )}
            {!loading && (
              <React.Fragment>
                <div
                  className="Top"
                  style={{ display: newModalOpen ? "none" : "flex" }}
                >
                  <div className="Selected">
                    <div className="SelectedInner">
                      <div className="SelectedContent">
                        {current === undefined
                          ? `Vali Karakter`
                          : `${current.first_name} ${current.last_name}`}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          backgroundColor: "white",
                        }}
                      />
                      <div className="SelectedContent">
                        <Button
                          style={{
                            backgroundColor:
                              current !== undefined
                                ? "hsl(144, 60%, 36%)"
                                : "hsla(144, 60%, 36%, 0.541)",
                            color: current !== undefined ? "white" : "#c0c0c0",
                            borderRadius: "8px",
                          }}
                          fullWidth
                          disabled={current === undefined}
                          onClick={() => {
                            selectCharacter(current.cid);
                          }}
                        >
                          MÄNGI
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* <div style={{ padding: "1rem" }}>
                    Liitu meie discordiga @ https://discord.io/eternalinvite :)
                  </div> */}
                </div>
                <div className="Middle"></div>
                {/*
                <div className="Characters">
                  {characters.length > 0 &&
                    characters.map((character) => {
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
                            <SlotText>
                              Kodaniku ID: {character.character_id}
                            </SlotText>
                            {character.faction && (
                              <SlotText>
                                {character.faction.group.faction_name} |{" "}
                                {character.faction.member.rank_name}
                              </SlotText>
                            )}
                            {!character.faction && (
                              <SlotText>Pole Grupeeringut</SlotText>
                            )}
                            <SlotText>
                              {character.gender === 0 ? "Mees" : "Naine"}
                            </SlotText>
                            <SlotText>{character.date_of_birth}</SlotText>
                            {character.dead && (
                              <SlotText color="red">HAIGLAS</SlotText>
                            )}
                            {character.prison && (
                              <SlotText color="red">VANGLAS</SlotText>
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
                              onClick={() => {
                                selectCharacter(character.character_id);
                              }}
                            >
                              MÄNGI
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  {characters.length === 0 && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "Roboto",
                        fontSize: "1.5rem",
                        color: "white",
                      }}
                    >
                      Sul pole ühtegi karakteri.
                    </div>
                  )}
                </div>
                */}
                <div
                  className="Bottom"
                  style={{ display: newModalOpen ? "none" : "flex" }}
                >
                  <Button
                    style={{
                      backgroundColor: "hsl(144, 60%, 36%)",
                      color: "white",
                    }}
                    onClick={() => {
                      openNewModal(true);
                    }}
                  >
                    UUS KARAKTER
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
                          createError={createError}
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
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
