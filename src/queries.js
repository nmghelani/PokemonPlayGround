const { gql } = require("@apollo/client");

const GET_POKEMON_LIST = gql`
  query GetPokemonList($pageNum: Int) {
    getPokemonList(pageNum: $pageNum) {
      count
      totalPage
      results {
        id
        name
        url
        image
      }
    }
  }
`;

const GET_POKEMON = gql`
  query GetPokemon($id: Int) {
    getPokemon(id: $id) {
      base_experience
      height
      id
      name
      url
      image
      weight
      moves {
        move {
          name
          url
        }
      }
      forms {
        name
        url
      }
      abilities {
        is_hidden
        slot
        ability {
          name
          url
        }
      }
    }
  }
`;

const exported = {
  GET_POKEMON_LIST,
  GET_POKEMON,
};

export default exported;
