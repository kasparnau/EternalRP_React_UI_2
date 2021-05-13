const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const BigNumber = require("bignumber.js"); // FOR DEC -> HEX

// SQL SETUP
const DB = require("./db");
const { response } = require("express");

async function sql(string, data) {
  try {
    await DB.initialized;

    let [results] = await DB.connection.execute(string, data);

    return results;
  } catch (e) {
    throw new Error(e);
  }
}

// IDK
const app = express();
const PORT = process.env.PORT || 5000;

const SECRET_CODE = "ABCD1234";

// MIDDLEWARE
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use(
  session({
    secret: SECRET_CODE,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// PASSPORT SETUP
const fetchBanData = `
  SELECT *
  FROM bans
  WHERE steam=?
`;

async function getBanData(hex) {
  try {
    const result = await sql(fetchBanData, [hex]);
    for (let i = 0; i < result.length; i++) {
      const ban = result[i];
      if (ban.enabled === 1 && ban.date + ban.length > Date.now() / 1000) {
        return { ...ban };
      }
    }
    return false;
  } catch {
    throw new Error("Failed?");
  }
}

const fetchAdminData = `
  SELECT level
  FROM admins
  WHERE hex=?
`;

async function getAdminData(hex) {
  try {
    const result = await sql(fetchAdminData, [hex]);
    if (result[0]) {
      return result[0].level;
    }
    return false;
  } catch {
    throw new Error("Failed?");
  }
}

function DecToHex(dec) {
  var x = new BigNumber(dec, 10);
  var result = x.toString(16).toUpperCase();
  return result;
}

function FormatHexForFivem(hex) {
  return `steam:${hex.toLowerCase()}`;
}

const fetchPlayerData = `
  SELECT pid, players.steam, whitelist.priority
  FROM players 
  LEFT JOIN whitelist 
    ON whitelist.steam = players.steam
  WHERE players.steam=?
  GROUP BY whitelist.steam, players.steam
`;

passport.serializeUser(async function (user, done) {
  user.hex = DecToHex(user.id);

  try {
    const results = await sql(fetchPlayerData, [FormatHexForFivem(user.hex)]);

    user.player_id = results[0] ? results[0].pid : null;

    try {
      const ban = await getBanData(FormatHexForFivem(user.hex));
      user.ban = ban;
    } catch (err) {
      console.log("failed fetching ban data? " + err);
    }

    try {
      const admin_level = await getAdminData(FormatHexForFivem(user.hex));
      user.admin = admin_level;
    } catch (err) {
      console.log("failed fetching admin data? " + err);
    }

    done(null, user);
  } catch (err) {
    console.log(err);

    done(null, user);
  }
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: `http://localhost:${PORT}/api/auth/steam/return`,
      apiKey: "54C8D82D703E04511C86FDB1D0D31E46",
    },
    function (identifier, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

// AUTH ROUTES

app.get(
  "/api/auth/steam",
  passport.authenticate("steam", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/",
  }),
  function (req, res) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
  }
);

app.get(
  "/api/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  async function (req, res) {
    res.redirect("http://localhost:3000/");
  }
);

app.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000/");
});

app.get("/api/user", (req, res) => {
  res.send(req.user);
});

// DATA ROUTES

const fetchWhitelist = `
  SELECT priority
  FROM whitelist
  WHERE steam=?
  ORDER BY id DESC
`;

app.get("/api/whitelist/get", loggedIn, async (req, res, next) => {
  try {
    let data = await sql(fetchWhitelist, [FormatHexForFivem(req.user.hex)]);
    if (data[0]) {
      res.send({ priority: data[0].priority });
    } else {
      res.send({});
    }
  } catch (err) {
    console.log(err);
  }
});

const fetchCharacters = `
  SELECT _faction_members.rank_name, _faction_groups.faction_name, cid, first_name, last_name, dob
  FROM characters
  LEFT JOIN _faction_members ON _faction_members.character_id = cid
  LEFT JOIN _faction_groups ON _faction_groups.faction_id = _faction_members.faction_id
  WHERE pid=?
  GROUP BY cid, _faction_members.character_id
`;

const fetchVehicles = `
  SELECT vin, model, plate
  FROM vehicles
  WHERE cid=?
`;

app.get("/api/characters/get", loggedIn, isPlayer, async (req, res, next) => {
  try {
    let characters = await sql(fetchCharacters, [req.user.player_id]);

    let parsed = [];
    for (let i = 0; i < characters.length; i++) {
      let char = characters[i];
      let vehicles = [];

      try {
        vehicles = await sql(fetchVehicles, [char.cid]);
      } catch (err) {
        console.log("Failed to fetch vehicles: " + err);
      }

      parsed.push({
        rank_name: char.rank_name,
        faction_name: char.faction_name,
        citizen_id: char.cid,
        first_name: char.first_name,
        last_name: char.last_name,
        born: char.dob,
        vehicles: vehicles,
      });
    }

    res.send(parsed);
  } catch (err) {
    res.status(500).send("Error :(");
  }
});

const addApplication = `
  INSERT INTO whitelist_applications (hex, answers, name)
  VALUES (?, ?, ?)
`;

app.post(
  "/api/whitelist/apply",
  loggedIn,
  notBanned,
  async (req, res, next) => {
    try {
      await sql(addApplication, [
        FormatHexForFivem(req.user.hex),
        JSON.stringify(req.body),
        req.user.displayName,
      ]);

      res.send();
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
);

function getAppStatusText(status) {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Rejected";
    case 3:
      return "Accepted";
    default:
      return "Unknown";
  }
}

const fetchPlayerApplications = `
  SELECT id, timestamp, status, admin_comment
  FROM whitelist_applications
  WHERE hex=?
  ORDER BY id DESC
`;

async function getPlayerApplications(hex) {
  let applications = await sql(fetchPlayerApplications, [hex]);
  let result = [];

  for (let i = 0; i < applications.length; i++) {
    let application = applications[i];

    application.status = getAppStatusText(application.status);

    result.push({ ...application });
  }

  return result;
}

app.get("/api/whitelist/appStatus", loggedIn, async (req, res, next) => {
  try {
    let response = { canApply: false };

    let applications = await getPlayerApplications(
      FormatHexForFivem(req.user.hex)
    );

    let recentApp = applications[0];

    if (recentApp) {
      response.recentApp = recentApp;
    }

    if (
      applications.length < 3 &&
      !req.ban &&
      recentApp?.status !== "Pending"
    ) {
      response.canApply = true;
    }

    res.send(response);
  } catch (err) {
    res.status(500).send();
  }
});

const fetchPendingApplications = `
  SELECT id, hex, name, answers, timestamp, status, admin_comment
  FROM whitelist_applications
  WHERE status=1
  ORDER BY id DESC
`;

async function getPendingApplications() {
  let applications = await sql(fetchPendingApplications);
  let result = [];

  for (let i = 0; i < applications.length; i++) {
    let application = applications[i];

    application.status = getAppStatusText(application.status);

    result.push({ ...application });
  }

  return result;
}

app.get(
  "/api/staff/getPendingApps",
  loggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      res.send(await getPendingApplications());
    } catch (err) {
      res.status(500).send();
    }
  }
);

const setApplicationStatus = `
  UPDATE whitelist_applications
  SET status=?, processed_by=?
  WHERE id=?
`;

const addPlayerWhitelist = `
  INSERT INTO whitelist (steam, priority)
  VALUES (?, 1)
`;

app.post("/api/staff/processApp", loggedIn, isAdmin, async (req, res, next) => {
  try {
    let status = 1;

    switch (req.body.action) {
      case "accept":
        status = 3;
        break;
      case "reject":
        status = 2;
        break;
    }

    await sql(setApplicationStatus, [
      status,
      req.user.displayName,
      req.body.id,
    ]);

    try {
      await sql(addPlayerWhitelist, [req.body.hex]);
    } catch (err) {
      console.log("FAILED ADDING PLAYER WHITELIST TO " + req.body.hex);
    }

    res.send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

function isAdmin(req, res, next) {
  if (req.user.admin && req.user.admin > 0) {
    next();
  }
}

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  }
}

function isPlayer(req, res, next) {
  if (req.user.player_id) {
    next();
  }
}

function notBanned(req, res, next) {
  if (!req.user.ban) {
    next();
  }
}

//INIT SERVER
app.listen(PORT, () => {
  console.log("STARTED");
});
