import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import { TODOS_QUERY } from "../queries/todos";

export default function ListFooter({ todosLeft, hasCompleted }) {
  const [deleteCompletedTodos, { loading: deleting }] = useMutation(
    gql`
      mutation DeleteCompletedTodos {
        deleteCompletedTodos
      }
    `,
    {
      update(
        cache,
        {
          data: { deleteCompletedTodos }
        }
      ) {
        const { todos, ...rest } = cache.readQuery({ query: TODOS_QUERY });

        cache.writeQuery({
          query: TODOS_QUERY,
          data: {
            ...rest,
            todos: todos.filter(todo => !todo.completed)
          }
        });
      }
    }
  );

  const deleteAll = React.useCallback(
    () => !deleting && deleteCompletedTodos(),
    [deleting, deleteCompletedTodos]
  );

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{todosLeft}</strong> items left
      </span>
      <ul className="filters">
        <li>
          <a className="selected" href="#/">
            All
          </a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
        </li>
      </ul>
      {hasCompleted && (
        <button className="clear-completed" onClick={deleteAll}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
