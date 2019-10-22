import { gql } from "apollo-boost";

export const TODOS_QUERY = gql`
  query Todos($skip: Int, $limit: Int) {
    todos(skip: $skip, limit: $limit) {
      id
      text
      completed
    }
    todosLeft
  }
`;
