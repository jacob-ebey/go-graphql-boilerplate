import { gql } from "apollo-boost";

export const TODOS_QUERY = gql`
  query Todos($skip: Int, $limit: Int, $filter: TodoFilter) {
    todos(skip: $skip, limit: $limit, filter: $filter)
      @connection(key: "todos", filter: ["filter"]) {
      id
      text
      completed
    }
    todosLeft
    todosTotal
  }
`;
