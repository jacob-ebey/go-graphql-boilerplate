import React from "react";
import { gql } from "apollo-boost";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { NavLink as Link } from "react-router-dom";

export default function ListFooter({ todosLeft, hasCompleted }) {
  const client = useApolloClient();

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
        client.resetStore();
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
          <Link exact activeClassName="selected" to="/">
            All
          </Link>
        </li>
        <li>
          <Link activeClassName="selected" to="/active">
            Active
          </Link>
        </li>
        <li>
          <Link activeClassName="selected" to="/complete">
            Completed
          </Link>
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
