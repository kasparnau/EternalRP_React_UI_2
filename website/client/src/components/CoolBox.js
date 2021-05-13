import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  selectableBox: {
    backgroundColor: "#313348",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "#3e4157",
    },
  },
  coolBox: {
    backgroundColor: "#313348",
  },
}));

function CoolBox(props) {
  const classes = useStyles();
  return (
    <div
      onClick={props.onClick}
      className={props.onClick ? classes.selectableBox : classes.coolBox}
      style={{
        ...props.style,
        background: "none",
        width: "100%",
      }}
    >
      <div
        className={props.onClick ? classes.selectableBox : classes.coolBox}
        style={{
          margin: "0px 8px 8px 8px",
          ...props.style,
          borderRadius: "8px",
        }}
      >
        <div style={{ padding: "16px", height: "100%" }}>
          {props.title && (
            <div
              style={{
                textAlign: props.centerTitle ? "center" : "",
                fontSize: props.titleSize ? props.titleSize : "24px",
                fontWeight: "600",
                color: "#d1d5db",
              }}
            >
              {props.title}
            </div>
          )}
          {props.description && (
            <div
              style={{
                fontSize: "16px",
                fontWeight: "500",
                marginTop: "8px",
                color: "#9ca1a6",
              }}
            >
              {props.description}
            </div>
          )}
          {props.children && (
            <div
              style={{
                fontSize: "16px",
                fontWeight: "500",
                marginTop: "8px",
                color: "#9ca1a6",
              }}
            >
              {props.children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoolBox;
