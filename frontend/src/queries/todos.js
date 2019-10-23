import { gql } from "apollo-boost";

export const TODOS_QUERY = gql`
  query Todos($skip: Int, $limit: Int) {
    todos(skip: $skip, limit: $limit) @connection(key: "todos") {
      id
      text
      completed
    }
    todosLeft
  }
`;
