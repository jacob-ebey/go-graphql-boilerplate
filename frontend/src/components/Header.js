import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import { TODOS_QUERY } from "../queries/todos";

export default function Header({ disabled, loggedIn }) {
  const [value, setValue] = React.useState("");

  const [createTodo, { loading }] = useMutation(
    gql`
      mutation CreateTodo($text: String!) {
        createTodo(text: $text) {
          id
          text
          completed
        }
      }
    `,
    {
      variables: {
        text: value
      },
      update(
        cache,
        {
          data: { createTodo: createdTodo }
        }
      ) {
        const { todos, todosLeft } = cache.readQuery({ query: TODOS_QUERY });

        cache.writeQuery({
          query: TODOS_QUERY,
          data: {
            todos: [createdTodo].concat(todos),
            todosLeft: todosLeft + 1
          }
        });

        setValue("");
      }
    }
  );

  const onKeyDown = React.useCallback(
    e => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (!loading) {
          createTodo();
        }
      }
    },
    [loading, createTodo, setValue]
  );

  const onChange = React.useCallback(event => setValue(event.target.value), [
    setValue
  ]);

  return (
    <header className="header">
      <h1>todos</h1>
      {loggedIn && (
        <input
          disabled={disabled || loading}
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      )}
    </header>
  );
}
