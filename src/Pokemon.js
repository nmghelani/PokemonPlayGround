import React, { useEffect, useState } from "react";
import "./PokemonList.css";
import { serverUrl } from "./helper";
import { useLazyQuery, useQuery } from "@apollo/client";
import actions from "./actions";
import queries from "./queries";
import {
  makeStyles,
  Button,
  Avatar,
  Grid,
  Card,
  CardActionArea,
} from "@material-ui/core";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles({
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
  caughtButton: {
    margin: "10px 5px 10px 5px",
    backgroundColor: "#da0037",
    color: "white",
    "&:hover": {
      backgroundColor: "#c2c2c2",
    },
  },
  gridContainer: {
    borderRadius: "4px",
    margin: "5px",
    width: "100%",
    background: "#2d2d2d",
    marginTop: "3%",
  },
  gridItem: {
    borderBottom: "2px solid #171717",
  },
  image: {
    height: "100%",
    width: "auto",
  },
  height100: {
    height: "100%",
  },
  title: {
    color: "white",
  },
  description: {
    color: "#EFEFEF",
    textAlign: "justify",
  },
  detailsContainer: {
    padding: "10px 20px",
    textAlign: "left",
    overflowY: "auto",
    height: "100vh",
  },
  li: {
    width: "70%",
    float: "left",
  },
  centerCroppedImage: {
    height: "100%",
    width: "100%",
  },
  isbn: {
    fontWeight: "bold",
  },
});

const Pokemon = (props) => {
  const dispatch = useDispatch();
  const trainers = useSelector((state) => state.trainers);
  let selectedTrainer = trainers.filter((trainer) => trainer.selected)[0];
  let { id } = useParams();
  const navigate = useNavigate();
  if (isNaN(id)) {
    navigate("/error", {
      state: { code: 400, message: `Invalid id '${id}'` },
    });
  }
  id = parseInt(id);
  const classes = useStyles();
  const [pokemon, setPokemon] = useState({});
  const [getPokemon] = useLazyQuery(queries.GET_POKEMON, {
    variables: { id: 1 },
  });

  async function fetchPokemon() {
    setPokemon(null);
    const { data } = await getPokemon({ variables: { id: id } });
    if (data.getPokemon != null) {
      setPokemon(data.getPokemon);
    } else {
      navigate("/error", {
        state: { code: 404, message: "Resource not found" },
      });
    }
  }

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

  if (pokemon) {
    return (
      <div className={classes.height100}>
        <Grid container spacing={20} className={classes.height100}>
          <Grid item xs={12} sm={4} md={4}>
            <img
              className={classes.centerCroppedImage}
              src={pokemon.image}
              alt={pokemon.name}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={8}>
            <div className={classes.detailsContainer}>
              <Grid
                container
                spacing={0}
                direction="row"
                alignItems="center"
                justifyContent="left"
              >
                <Grid item>
                  <Typography
                    variant="h2"
                    component="h2"
                    style={{ fontWeight: "bold", padding: "10px 5px" }}
                  >
                    {pokemon.name}
                  </Typography>
                </Grid>
                <Grid item style={{ marginLeft: "10px" }}>
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
                </Grid>
              </Grid>
              <Typography variant="body1" component="span">
                The pokemon on the left is known as {pokemon.name}. It has many
                abilities and moves. Here's a list of its capabilities.
              </Typography>
              <Grid container spacing={3} className={classes.gridContainer}>
                <Grid item xs={12} align="center" className={classes.gridItem}>
                  <Typography
                    variant="h5"
                    component="h5"
                    style={{ fontWeight: "bold" }}
                  >
                    Forms
                  </Typography>
                </Grid>
                {pokemon.forms &&
                  pokemon.forms.map((form) => {
                    return (
                      <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
                        {form.name}
                      </Grid>
                    );
                  })}
              </Grid>
              <Grid container spacing={3} className={classes.gridContainer}>
                <Grid item xs={12} align="center" className={classes.gridItem}>
                  <Typography
                    variant="h5"
                    component="h5"
                    style={{ fontWeight: "bold" }}
                  >
                    Abilities
                  </Typography>
                </Grid>
                {pokemon.abilities &&
                  pokemon.abilities.map(({ ability }) => {
                    return (
                      <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
                        {ability.name}
                      </Grid>
                    );
                  })}
              </Grid>
              <Grid container spacing={3} className={classes.gridContainer}>
                <Grid item xs={12} align="center" className={classes.gridItem}>
                  <Typography
                    variant="h5"
                    component="h5"
                    style={{ fontWeight: "bold" }}
                  >
                    Moves
                  </Typography>
                </Grid>
                {pokemon.moves &&
                  pokemon.moves.map(({ move }) => {
                    return (
                      <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
                        {move.name}
                      </Grid>
                    );
                  })}
              </Grid>
              <Link className="footer-link" to="/pokemon/page/1">
                Back to pokemon list
              </Link>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Pokemon;
