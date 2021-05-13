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

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  formControl: {
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
}));

const ApplicationFormInput = (props) => {
  const classes = useStyles();

  return (
    <FormControl
      style={{ ...props.style, width: "100%" }}
      variant="filled"
      className={classes.formControl}
    >
      <InputLabel htmlFor="filled-adornment-amount">{props.display}</InputLabel>
      <FilledInput
        id="filled-adornment-amount"
        value={props.values[props.id]}
        multiline
        inputProps={{
          maxlength: props.max,
        }}
        onChange={(event) => {
          props.setValue(props.id, event.target.value);
        }}
      />
    </FormControl>
  );
};

const ApplicationForm = (props) => {
  const defaultValues = {
    age: "",
    rules: "",
    charType: "",
    strengths: "",
    scenario1: "",
    scenario2: "",
  };

  const [values, setValues] = React.useState(defaultValues);

  function setValue(name, value) {
    setValues({ ...values, [name]: value });
  }

  const sendApp = () => {
    setValues(defaultValues);

    let parsed = {};

    for (const property in values) {
      let question = questions.filter(
        (question) => question.id === property
      )[0];
      parsed[question.display] = values[property];
    }

    console.log(parsed);

    axios
      .post("/api/whitelist/apply", parsed)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        props.refreshAppData();
      });
  };

  const [isDisabled, setIsDisabled] = React.useState(true);

  function checkSendButton() {
    const vals = Object.values(values);
    const keys = Object.keys(values);
    for (let i = 0; i < vals.length; i++) {
      if (!vals[i]) {
        setIsDisabled(true);
        return;
      }
    }

    setIsDisabled(false);
  }

  React.useEffect(() => {
    checkSendButton();
  }, [values]);

  const classes = useStyles();

  const questions = [
    {
      id: "age",
      display: "Sinu IRL vanus",
      max: 2,
    },
    {
      id: "rules",
      display:
        "Kas sa oled lugenud meie serveri reegleid? Kui oled, ütle kust neid leida on.",
      max: 50,
    },
    {
      id: "charType",
      display: "Millist karakterit sa soovid mängida?",
      max: 200,
    },
    {
      id: "strengths",
      display: "Mis on su karakteri tugevused ja nõrkused?",
      max: 300,
    },
    {
      id: "scenario1",
      display: "Keegi sihib sind relvaga, kuidas su karakter reageerib?",
      max: 600,
    },
    {
      id: "scenario2",
      display:
        "Sa müüd narksi oma sõbraga ja suvakas isik hakkab sihtima teid relvaga ja röövima. Mida teed?",
      max: 600,
    },
  ];

  return (
    <div style={{ marginTop: "16px", height: "50%", overflowY: "auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          margin: "8px",
        }}
      >
        {questions.map((question) => {
          return (
            <ApplicationFormInput
              style={{ marginTop: "8px" }}
              id={question.id}
              display={question.display}
              values={values}
              setValue={setValue}
              max={question.max}
            />
          );
        })}
      </div>

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
            width: "100%",
            backgroundColor: "rgb(33 131 80)",
            marginLeft: "5px",
          }}
          disabled={isDisabled}
          onClick={sendApp}
        >
          SEND APPLICATION
        </Button>
      </div>
    </div>
  );
};

const Page = (props) => {
  const userData = useProfileStore((store) => store.userData);

  const [isWhitelisted, setWhitelisted] = React.useState(false);

  const [appData, setAppData] = React.useState(false);

  React.useEffect(() => {
    axios
      .get("/api/whitelist/get")
      .then((res) => {
        if (res.data.priority) {
          setWhitelisted(res.data.priority);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function refreshAppData() {
    axios
      .get("/api/whitelist/appStatus")
      .then((res) => {
        setAppData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    refreshAppData();
  }, []);

  return (
    <div className="PageMain">
      {userData && appData && (
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
            <CoolBox
              style={{
                backgroundColor: !isWhitelisted ? "var(--red)" : "var(--green)",
              }}
              title="Whitelist Status"
              description={
                !isWhitelisted
                  ? "You are not whitelisted"
                  : "You are whitelisted!"
              }
            />
            {appData.recentApp?.status && (
              <CoolBox
                title={`Application ${appData.recentApp?.status}`}
                description={`${
                  appData.recentApp?.admin_comment
                    ? appData.recentApp?.admin_comment
                    : "No admin comment"
                }`}
              />
            )}
          </div>

          {!isWhitelisted && appData.canApply && (
            <div style={{ marginBottom: "24px" }}>
              <CoolBox title="Application Form">
                <ApplicationForm refreshAppData={refreshAppData} />
              </CoolBox>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
