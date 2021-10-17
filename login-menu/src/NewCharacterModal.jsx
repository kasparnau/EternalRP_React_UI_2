import "./App.css";
import React from "react";
import {
  Button,
  FilledInput,
  FormControl,
  InputLabel,
  makeStyles,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      color: "white",
    },
    "& .MuiTypography-colorTextSecondary": {
      color: "white",
    },
    "& .MuiInputLabel-formControl": {
      color: "white",
    },
    "& .MuiFilledInput-input": {
      color: "white",
    },
  },
  maleButton: {
    backgroundColor: "hsla(208, 100%, 50%, 0.1)",
    "&:hover": {
      backgroundColor: "hsla(208, 100%, 50%, 0.3)",
    },
  },
  femaleButton: {
    backgroundColor: "hsla(333, 100%, 50%, 0.1)",
    "&:hover": {
      backgroundColor: "hsla(333, 100%, 50%, 0.3)",
    },
  },
}));

function NewCharacterModal(props) {
  const { closeModal, values, setValue } = props;
  const classes = useStyles();
  return (
    <div style={{ height: "100%", weight: "100%" }}>
      {/* <div className="ModalTopbar"></div> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            width: "50%",
            marginRight: "5px",
            backgroundColor:
              values.gender === "male" && "hsla(208, 100%, 50%, 0.5)",
          }}
          className={classes.maleButton}
          onClick={() => {
            setValue("gender", "male");
          }}
        >
          MEES
        </Button>
        <Button
          style={{
            width: "50%",
            marginLeft: "5px",
            backgroundColor:
              values.gender === "female" && "hsla(333, 100%, 50%, 0.5)",
          }}
          className={classes.femaleButton}
          onClick={() => {
            setValue("gender", "female");
          }}
        >
          NAINE
        </Button>
      </div>
      <div
        style={{
          marginTop: "5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormControl
          style={{ width: "100%" }}
          variant="filled"
          className={classes.root}
        >
          <InputLabel htmlFor="filled-adornment-amount">Eesnimi</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={values.first_name}
            onChange={(event) => {
              setValue("first_name", event.target.value);
            }}
          />
        </FormControl>
      </div>

      <div
        style={{
          marginTop: "5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormControl
          style={{ width: "100%" }}
          variant="filled"
          className={classes.root}
        >
          <InputLabel htmlFor="filled-adornment-amount">Sugunimi</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={values.last_name}
            onChange={(event) => {
              setValue("last_name", event.target.value);
            }}
          />
        </FormControl>
      </div>
      <div
        style={{
          marginTop: "5%",
          marginBottom: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          style={{ width: "100%" }}
          id="date"
          label="Sünnipäev"
          type="date"
          defaultValue="2000-01-01"
          value={values.born}
          onChange={(event) => {
            setValue("born", event.target.value);
          }}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      {props.createError && (
        <div style={{ color: "#D17D00" }}>{props.createError}</div>
      )}
      {/* FINALIZE: */}
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            width: "50%",
            backgroundColor: "#ce8e4c",
            marginRight: "5px",
          }}
          onClick={closeModal}
        >
          TÜHISTA
        </Button>
        <Button
          onClick={props.handleCreate}
          disabled={props.createButtonDisabled}
          style={{
            width: "50%",
            backgroundColor: "rgb(37 146 81)",
            marginLeft: "5px",
          }}
        >
          LOO KARAKTER
        </Button>
      </div>
    </div>
  );
}

export default NewCharacterModal;
