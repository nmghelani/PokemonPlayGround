import { v4 as uuid } from "uuid";
import { actions } from "../actions";
const initalState = [
  {
    trainerId: uuid(),
    trainerName: "Nevil",
    selected: false,
    pokemonList: [],
  },
];

const trainerReducer = (state = initalState, action) => {
  const { type, payload } = action;
  let copyState;
  let selectedTrainer = state.filter((trainer) => trainer.selected);
  switch (type) {
    case actions.ADD_TRAINER:
      return [
        ...state,
        {
          trainerId: uuid(),
          trainerName: payload.trainerName,
          selected: false,
          pokemonList: [],
        },
      ];
    case actions.REMOVE_TRAINER:
      copyState = [...state];
      let index = copyState.findIndex((x) => x.trainerId == payload.trainerId);
      copyState.splice(index, 1);
      return [...copyState];
    case actions.SELECT_TRAINER:
      copyState = [...state];
      return [
        ...copyState.map((x) => {
          x.selected = x.trainerId == payload.trainerId;
          console.log(x);
          return x;
        }),
      ];
    case actions.CATCH_POKEMON:
      if (selectedTrainer == null || selectedTrainer.length == 0) {
        return [...state];
      }
      copyState = [...state];
      return [
        ...copyState.map((x) => {
          if (x.trainerId == selectedTrainer[0].trainerId) {
            x.pokemonList.push(payload.pokemon);
          }
          return x;
        }),
      ];
    case actions.RELEASE_POKEMON:
      selectedTrainer = state.filter((trainer) => trainer.selected);
      if (selectedTrainer == null || selectedTrainer.length == 0) {
        return [...state];
      }
      copyState = [...state];
      return [
        ...copyState.map((x) => {
          if (x.trainerId == selectedTrainer[0].trainerId) {
            let pokemonInx = x.pokemonList.findIndex(
              (p) => p.id == payload.pokemon.id
            );
            x.pokemonList.splice(pokemonInx, 1);
          }
          return x;
        }),
      ];
    default:
      return state;
  }
};

export default trainerReducer;
