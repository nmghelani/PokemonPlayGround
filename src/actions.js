const actions = {
  ADD_TRAINER: 0,
  REMOVE_TRAINER: 1,
  SELECT_TRAINER: 2,
  CATCH_POKEMON: 3,
  RELEASE_POKEMON: 4,
};

const addTrainer = (trainerName) => ({
  type: actions.ADD_TRAINER,
  payload: {
    trainerName: trainerName,
  },
});

const removeTrainer = (trainerId) => ({
  type: actions.REMOVE_TRAINER,
  payload: {
    trainerId: trainerId,
  },
});

const selectTrainer = (trainerId) => ({
  type: actions.SELECT_TRAINER,
  payload: {
    trainerId: trainerId,
  },
});

const catchPokemon = (pokemon) => ({
  type: actions.CATCH_POKEMON,
  payload: {
    pokemon: pokemon,
  },
});

const releasePokemon = (pokemon) => ({
  type: actions.RELEASE_POKEMON,
  payload: {
    pokemon: pokemon,
  },
});

module.exports = {
  actions,
  addTrainer,
  removeTrainer,
  selectTrainer,
  catchPokemon,
  releasePokemon,
};
