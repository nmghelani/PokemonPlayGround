import React, { useEffect, useState } from "react";
import "./PokemonList.css";
import { serverUrl } from "./helper";
import { useLazyQuery, useQuery } from "@apollo/client";
import queries from "./queries";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import actions from "./actions";
import {
  makeStyles,
  Button,
  Avatar,
  Grid,
  Card,
  CardActionArea,
} from "@material-ui/core";
import { Pagination } from "@mui/material";

const useStyles = makeStyles({
  textbox: {
    background: "#2d2d2d",
    padding: "15px 15px",
    width: "90%",
    marginTop: "10px",
    border: "0px",
    borderRadius: "5px",
    outline: "none",
    color: "white",
    fontSize: "medium",
  },
  addButton: {
    background: "#da0037",
    padding: "15px 15px",
    width: "85%",
    marginTop: "10px",
    border: "0px",
    borderRadius: "5px",
    outline: "none",
    color: "white",
    fontSize: "medium",
  },
  button: {
    margin: "10px 5px 10px 5px",
    backgroundColor: "#2d2d2d",
    color: "white",
    "&:hover": {
      backgroundColor: "#c2c2c2",
    },
  },
  disabledButton: {
    margin: "10px 5px 10px 5px",
    backgroundColor: "#cccccc",
    color: "white",
    "&:hover": {
      backgroundColor: "#c2c2c2",
    },
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
    padding: "1% 2%",
  },
  info: {
    padding: 20,
    margin: "auto 0px",
  },
  container: {
    margin: "15px auto",
    borderRadius: "5px",
    backgroundColor: "white",
    width: "100%",
  },
  image: {
    height: "25vh",
    width: "25vh",
    margin: "10px",
  },
  button: {
    margin: "10px 5px 10px 5px",
    backgroundColor: "#2d2d2d",
    color: "white",
    "&:hover": {
      backgroundColor: "#c2c2c2",
    },
  },
  description: {
    textAlign: "left",
    padding: "5px 10px",
    color: "#878787",
    fontSize: "small",
  },
  binnedCount: {
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    color: "#2d2d2d",
    padding: "5px 0px",
    fontSize: "larger",
    margin: "auto 5px",
  },
  pagination: {
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "15px",
  },
  caughtButton: {
    margin: "10px 5px 10px 5px",
    backgroundColor: "#da0037",
    color: "white",
    "&:hover": {
      backgroundColor: "#c2c2c2",
    },
  },
  ul: {
    "& .MuiPaginationItem-root": {
      color: "#fff",
    },
  },
});

const PokemonList = (props) => {
  const dispatch = useDispatch();
  const { pagenum: paramsPageNum } = useParams();
  const trainers = useSelector((state) => state.trainers);
  let selectedTrainer = trainers.filter((trainer) => trainer.selected)[0];
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  if (isNaN(paramsPageNum)) {
    navigate("/error", {
      state: { code: 400, message: `Invalid page number '${paramsPageNum}'` },
    });
  }
  const classes = useStyles();
  const [pageNum, setPageNum] = useState(
    paramsPageNum ? parseInt(paramsPageNum) : 1
  );
  const [pokemonList, setPokemonList] = useState({});
  const [pokemonFilteredList, setPokemonFilteredList] = useState({});
  const [getPokemon, { called, loading, data }] = useLazyQuery(
    queries.GET_POKEMON_LIST,
    { variables: { pageNum: 1 } }
  );

  async function fetchPokemon() {
    setPokemonList(null);
    const { data } = await getPokemon({ variables: { pageNum: pageNum } });
    if (data.getPokemonList != null) {
      setPokemonList(data.getPokemonList);
    } else {
      navigate("/error", {
        state: { code: 404, message: "Resource not found" },
      });
    }
  }

  useEffect(() => {
    if (pokemonList && pokemonList.results) {
      let tempList = { ...pokemonList };
      tempList.results = [];
      for (let i = 0; i < pokemonList.results.length; i++) {
        if (
          pokemonList.results[i].name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          tempList.results.push(pokemonList.results[i]);
        }
      }
      setPokemonFilteredList(tempList);
    }
  }, [pokemonList, searchTerm]);

  useEffect(() => {
    fetchPokemon();
    window.history.pushState({}, null, `/pokemon/page/${pageNum}`);
  }, [pageNum]);

  async function handleCatchClick(pokemon, e) {
    e.stopPropagation();
    if (selectedTrainer == null) {
      return alert("Select trainer to catch pokemon");
    }
    dispatch(actions.catchPokemon(pokemon));
  }

  async function handleReleaseClick(pokemon, e) {
    e.stopPropagation();
    dispatch(actions.releasePokemon(pokemon));
  }

  useEffect(() => {
    fetchPokemon();
  }, []);
  console.log(pokemonFilteredList);
  if (pokemonFilteredList && pokemonFilteredList.results) {
    return (
      <div>
        <form action="">
          <Grid container style={{ width: "100%", marginTop: "10px" }}>
            <Grid item xs={10} align="center">
              <input
                type="text"
                placeholder="Search pokemon..."
                className={classes.textbox}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </Grid>
            <Grid item xs={2} align="left">
              <input
                type="submit"
                className={classes.addButton}
                value="Search"
              />
            </Grid>
          </Grid>
        </form>
        <Pagination
          classes={{ ul: classes.ul }}
          className={classes.pagination}
          count={pokemonFilteredList.totalPage}
          page={pageNum}
          onChange={(event, value) => setPageNum(value)}
          color="primary"
          shape="rounded"
          size="large"
        />
        {pokemonFilteredList.results.length != 0 && (
          <Grid container className={classes.grid} spacing={3}>
            {pokemonFilteredList.results.map((pokemon) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={3}
                  xl={1}
                  key={pokemon.id}
                  onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                >
                  <Card className={classes.container} variant="outlined">
                    <CardActionArea>
                      <img
                        className={classes.image}
                        src={pokemon.image}
                        alt={pokemon.image}
                      />
                      <div className={classes.name}>{pokemon.name}</div>
                      <div>
                        {selectedTrainer &&
                          selectedTrainer.pokemonList.filter(
                            (p) => p.id == pokemon.id
                          ).length != 0 && (
                            <Button
                              size="small"
                              className={classes.caughtButton}
                              onClick={(e) => handleReleaseClick(pokemon, e)}
                            >
                              Release
                            </Button>
                          )}
                        {selectedTrainer &&
                          selectedTrainer.pokemonList.filter(
                            (p) => p.id == pokemon.id
                          ).length == 0 && (
                            <Button
                              size="small"
                              className={classes.button}
                              onClick={(e) => handleCatchClick(pokemon, e)}
                            >
                              Catch
                            </Button>
                          )}
                        {!selectedTrainer && (
                          <Button
                            size="small"
                            className={classes.disabledButton}
                            onClick={(e) => handleCatchClick(pokemon, e)}
                          >
                            Catch
                          </Button>
                        )}
                      </div>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default PokemonList;
