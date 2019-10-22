import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import { TODOS_QUERY } from "../queries/todos";

function TodoItem({ completed, id, text, disabled }) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(text);

  const [markTodo, { loading: markingTodo }] = useMutation(
    gql`
      mutation MarkTodo($id: Int!, $completed: Boolean!) {
        markTodo(id: $id, completed: $completed) {
          id
          completed
        }
      }
    `,
    {
      variables: {
        id,
        completed: !completed
      },
      optimisticResponse: {
        __typename: "Mutation",
        markTodo: {
          __typename: "Todo",
          id,
          completed: !completed
        }
      },
      update(cache, { data }) {
        if (data.__typename) {
          return;
        }

        const query = gql`
          {
            todosLeft
          }
        `;
        const { todosLeft } = cache.readQuery({ query });

        const newLeft = data.markTodo.completed ? todosLeft - 1 : todosLeft + 1;

        cache.writeQuery({
          query,
          data: {
            todosLeft: newLeft > 0 ? newLeft : 0
          }
        });
      }
    }
  );

  const [editTodo, { loading: savingTodo }] = useMutation(
    gql`
      mutation EditTodo($id: Int!, $text: String!) {
        editTodo(id: $id, text: $text) {
          id
          text
        }
      }
    `,
    {
      variables: {
        id,
        text: value
      },
      optimisticResponse: {
        __typename: "Mutation",
        editTodo: {
          __typename: "Todo",
          id,
          text: value
        }
      }
    }
  );

  const [deleteTodo, { loading: deletingTodo }] = useMutation(
    gql`
      mutation DeleteTodo($id: Int!) {
        deleteTodo(id: $id) {
          id
        }
      }
    `,
    {
      variables: {
        id
      },
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
            todos: todos.filter(todo => todo.id !== id)
          }
        });
      }
    }
  );

  const loading = React.useMemo(
    () => markingTodo || savingTodo || deletingTodo,
    [markingTodo, savingTodo, deletingTodo]
  );

  const onChange = React.useCallback(event => setValue(event.target.value), [
    setValue
  ]);
  const onFocus = React.useCallback(() => !completed && setEditing(true), [
    completed,
    setEditing
  ]);

  const onBlur = React.useCallback(() => {
    setEditing(false);
    editTodo();
  }, [setEditing]);

  const onCompletedChanged = React.useCallback(() => !loading && markTodo(), [
    markTodo,
    loading
  ]);

  const onDelete = React.useCallback(() => !loading && deleteTodo(), [
    loading,
    deleteTodo
  ]);

  return (
    <li
      className={`${completed ? "completed" : ""} ${
        !disabled && editing ? "editing" : ""
      }`}
    >
      {!disabled && editing ? (
        <input
          className="edit"
          disabled={completed || loading}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          autoFocus
        />
      ) : (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={onCompletedChanged}
          />
          <label onClick={onFocus}>{text}</label>
          <button
            className="destroy"
            disabled={loading}
            onClick={onDelete}
          ></button>
        </div>
      )}
    </li>
  );
}

export default TodoItem;
