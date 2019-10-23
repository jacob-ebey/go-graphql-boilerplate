import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { TODOS_QUERY } from "../queries/todos";
import SignIn from "./SignIn";
import TodoItem from "./TodoItem";
import ListFooter from "./ListFooter";

export default function HomePage({
  loggedIn,
  onSignIn,
  onSignOut,
  match: {
    params: { filter }
  }
}) {
  filter = (filter && filter.toUpperCase()) || "ALL";

  const { data, loading } = useQuery(TODOS_QUERY, {
    skip: !loggedIn,
    variables: { filter }
  });

  const hasCompleted = React.useMemo(
    () => data && data.todosTotal > data.todosLeft
  );

  return (
    <React.Fragment>
      {!loggedIn && <SignIn onSignIn={onSignIn} />}

      {loggedIn && data && data.todos && data.todosTotal > 0 && (
        <React.Fragment>
          <section className="main">
            {/* <input id="toggle-all" className="toggle-all" type="checkbox" />
  <label htmlFor="toggle-all">Mark all as complete</label> */}
            <ul className="todo-list">
              {data.todos.map(todo => (
                <TodoItem key={todo.id} {...todo} disabled={loading} />
              ))}
            </ul>
          </section>
          <ListFooter hasCompleted={hasCompleted} todosLeft={data.todosLeft} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
