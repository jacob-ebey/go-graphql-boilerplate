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
          text
          completed
        }
      }
    `,
    {
      variables: {
        id,
        completed: !completed
      },
      update(
        cache,
        {
          data: { __typename, markTodo: newTodo }
        }
      ) {
        const query = gql`
          {
            todosLeft
            todosTotal
          }
        `;
        const { todosLeft, todosTotal } = cache.readQuery({ query });

        let newLeft = newTodo.completed ? todosLeft - 1 : todosLeft + 1;
        newLeft = newLeft > 0 ? newLeft : 0;

        cache.writeData({
          query,
          data: {
            todosLeft: newLeft,
            todosTotal
          }
        });

        let activeTodos, completeTodos;
        let activeFromCache = false,
          completeFromCache = false;
        try {
          const { todos: tempActiveTodos } = cache.readQuery({
            query: TODOS_QUERY,
            variables: { filter: "ACTIVE" }
          });
          activeTodos = tempActiveTodos;
          activeFromCache = true;
        } catch (err) {
          activeTodos = [];
        }

        try {
          const { todos: tempCompleteTodos } = cache.readQuery({
            query: TODOS_QUERY,
            variables: { filter: "COMPLETE" }
          });
          completeTodos = tempCompleteTodos;
          completeFromCache = true;
        } catch (err) {
          completeTodos = [];
        }

        if (newTodo.completed) {
          if (activeFromCache) {
            cache.writeQuery({
              query: TODOS_QUERY,
              variables: { filter: "ACTIVE" },
              data: {
                todos: activeTodos.filter(todo => todo.id !== newTodo.id),
                todosLeft: newLeft,
                todosTotal
              }
            });
          }
          if (completeFromCache) {
            cache.writeQuery({
              query: TODOS_QUERY,
              variables: { filter: "COMPLETE" },
              data: {
                todos: [newTodo].concat(completeTodos),
                todosLeft: newLeft,
                todosTotal
              }
            });
          }
        } else {
          if (activeFromCache) {
            cache.writeQuery({
              query: TODOS_QUERY,
              variables: { filter: "ACTIVE" },
              data: {
                todos: [newTodo].concat(activeTodos),
                todosLeft: newLeft,
                todosTotal
              }
            });
          }
          if (completeFromCache) {
            cache.writeQuery({
              query: TODOS_QUERY,
              variables: { filter: "COMPLETE" },
              data: {
                todos: completeTodos.filter(todo => todo.id !== newTodo.id),
                todosLeft: newLeft,
                todosTotal
              }
            });
          }
        }
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
        const update = filter => {
          try {
            const { todos, ...rest } = cache.readQuery({
              query: TODOS_QUERY,
              variables: { filter }
            });

            cache.writeQuery({
              query: TODOS_QUERY,
              variables: { filter },
              data: {
                ...rest,
                todos: todos.filter(todo => todo.id !== id)
              }
            });
          } catch (err) {}
        };

        update("ALL");
        update("ACTIVE");
        update("COMPLETE");
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
          disabled={disabled || completed || loading}
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
            disabled={disabled || loading}
            onClick={onDelete}
          ></button>
        </div>
      )}
    </li>
  );
}

export default TodoItem;
