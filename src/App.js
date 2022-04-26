import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Intro from "./Intro";
import PokemonList from "./PokemonList";
import Pokemon from "./Pokemon";
import Error from "./Error";
import Trainers from "./Trainers";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

const useStyles = makeStyles({
  link: {
    padding: 10,
    color: "#FFF",
    textDecoration: "none",
    "&:hover": {
      color: "#c2c2c2",
    },
  },
  navOption: {
    padding: "20px 0px",
  },
  header: {},
});

function App() {
  const classes = useStyles();
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <div className="App-header">
            <div className={classes.navOption}>
              <Link to="/" className={classes.link}>
                Home
              </Link>
              <Link to="/trainers" className={classes.link}>
                Trainers
              </Link>
              <Link to="/pokemon/page/1" className={classes.link}>
                Pokemon
              </Link>
            </div>
          </div>
          <div className="divider" />
          <div className="App-body">
            <Routes>
              <Route exact path="/" element={<Intro />} />
              <Route
                exact
                path="/pokemon/page/:pagenum"
                element={<PokemonList />}
              />
              <Route exact path="/pokemon/:id" element={<Pokemon />} />
              <Route exact path="/trainers" element={<Trainers />} />
              <Route exact path="/error" element={<Error />} />
              <Route
                exact
                path="*"
                element={<Error code={404} message="Page not found" />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
