import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { TODOS_QUERY } from "../queries/todos";
import Footer from "./Footer";
import Header from "./Header";
import SignIn from "./SignIn";
import TodoItem from "./TodoItem";
import ListFooter from "./ListFooter";

const auth = JSON.parse(localStorage.getItem("auth") || JSON.stringify(null));

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(auth && auth.token);
  const { data, loading } = useQuery(TODOS_QUERY, {
    skip: !loggedIn
  });

  const hasCompleted = React.useMemo(
    () => data && data.todos && data.todos.some(todo => todo.completed),
    [data]
  );

  const onSignIn = React.useCallback(payload => {
    setLoggedIn(!!payload);
    localStorage.setItem("auth", JSON.stringify(payload));
  });

  const onSignOut = React.useCallback(() => {
    setLoggedIn(false);
    localStorage.removeItem("auth");
  });

  return (
    <React.Fragment>
      <section className="todoapp">
        <Header disabled={loading} loggedIn={loggedIn} />

        {!loggedIn && <SignIn onSignIn={onSignIn} />}

        {loggedIn && data && data.todos && data.todos.length > 0 && (
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
            <ListFooter
              hasCompleted={hasCompleted}
              todosLeft={data.todosLeft}
            />
          </React.Fragment>
        )}
      </section>

      <Footer loggedIn={loggedIn} onSignOut={onSignOut} />
    </React.Fragment>
  );
}
