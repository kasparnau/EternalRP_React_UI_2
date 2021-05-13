import "./App.css";
import React from "react";
import { Router, Route } from "react-router-dom";
import history from "./history";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

import { useProfileStore } from "./store";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const App = () => {
  const setUserData = useProfileStore(
    (state) => state.setUserData
  ); /* CHANGE SELECTED PROFILE */

  const userData = useProfileStore((store) => store.userData);

  const fetchUserData = () => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setUserData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const recent = React.useRef(0);
  const handlePage = () => {
    let path = window.location.pathname;

    recent.current += 1;
    let last = recent.current;

    if (!userData && path !== "/login") {
      history.push("/login");
    } else {
      if (userData && path === "/login") {
        history.push("/profile");
      }
    }
  };

  React.useEffect(() => {
    handlePage();
  }, [userData]);

  React.useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Router history={history}>
          {userData && (
            <React.Fragment>
              <Route path="/profile" exact component={Profile} />
            </React.Fragment>
          )}
          <Route path="/login" exact component={Login} />
          <Route path="/" exact component={Login} />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
