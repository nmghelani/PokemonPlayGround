import React, { useState } from "react";
import "./Trainers.css";
import actions from "./actions";
import { useDispatch, useSelector } from "react-redux";
import {
  makeStyles,
  Button,
  Avatar,
  Grid,
  Card,
  CardActionArea,
  Typography,
} from "@material-ui/core";
import { useLazyQuery } from "@apollo/client";
import queries from "./queries";
import { Link } from "react-router-dom";

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
  selectedButton: {
    margin: "10px 5px 10px 5px",
    backgroundColor: "#da0037",
    color: "white",
    "&:hover": {
      backgroundColor: "#c2c2c2",
    },
  },
  description: {
    textAlign: "center",
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
  ul: {
    "& .MuiPaginationItem-root": {
      color: "#fff",
    },
  },
  pokemonImg: {
    width: "50px",
    height: "50px",
  },
});

const Trainers = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [trainerName, setTrainerName] = useState("");
  const [getPokemon] = useLazyQuery(queries.GET_POKEMON, {
    variables: { id: 1 },
  });
  const trainers = useSelector((state) => state.trainers);
  console.log("Trainers", trainers);

  function addTrainer(e) {
    e.preventDefault();
    if (trainerName != "") {
      dispatch(actions.addTrainer(trainerName));
      setTrainerName("");
    }
  }

  function selectTrainer(trainerId) {
    dispatch(actions.selectTrainer(trainerId));
  }

  function removeTrainer(trainerId) {
    dispatch(actions.removeTrainer(trainerId));
  }

  return (
    <div>
      <form action="">
        <Grid container style={{ width: "100%" }}>
          <Grid item xs={10} align="center">
            <input
              type="text"
              placeholder="Enter trainer name"
              className={classes.textbox}
              onChange={(e) => setTrainerName(e.target.value)}
              value={trainerName}
            />
          </Grid>
          <Grid item xs={2} align="left">
            <input
              type="submit"
              className={classes.addButton}
              value="Add Trainer"
              onClick={addTrainer}
            />
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={3} style={{ margin: "10px" }}>
        {trainers.map((trainer) => {
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              xl={1}
              key={trainer.trainerId}
            >
              <Card className={classes.container} variant="outlined">
                <CardActionArea>
                  <Typography
                    variant="h4"
                    component="h4"
                    style={{ fontWeight: "bold", padding: "10px 5px" }}
                  >
                    {trainer.trainerName}
                  </Typography>
                  <img
                    className={classes.image}
                    src="https://www.seekpng.com/png/detail/27-275556_pokemon-go-avatar-png-buddy-jpg-transparent-download.png"
                    alt={trainer.trainerName}
                  />
                  {trainer.pokemonList.length != 0 && (
                    <Typography
                      variant="subtitle1"
                      component="div"
                      style={{ fontWeight: "bold", padding: "10px 5px" }}
                    >
                      Pokemon
                    </Typography>
                  )}
                  <Grid container>
                    {trainer.pokemonList.map((pokemon) => {
                      return (
                        <Grid
                          item
                          style={{
                            border: "1px solid grey",
                            padding: "5px",
                            borderRadius: "4px",
                            margin: "5px",
                          }}
                        >
                          <Link to={"/pokemon/" + pokemon.id}>
                            <img
                              className={classes.pokemonImg}
                              src={pokemon.image}
                              alt={pokemon.image}
                            />
                          </Link>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <div>
                    {trainer.selected && (
                      <Button size="small" className={classes.selectedButton}>
                        Selected
                      </Button>
                    )}
                    {!trainer.selected && (
                      <Button
                        size="small"
                        className={classes.button}
                        onClick={() => selectTrainer(trainer.trainerId)}
                      >
                        Select
                      </Button>
                    )}
                    {!trainer.selected && (
                      <Button
                        size="small"
                        className={classes.selectedButton}
                        onClick={() => removeTrainer(trainer.trainerId)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Trainers;
