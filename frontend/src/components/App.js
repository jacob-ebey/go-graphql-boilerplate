import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { TODOS_QUERY } from "../queries/todos";
import Footer from "./Footer";
import Header from "./Header";
import TodoItem from "./TodoItem";
import ListFooter from "./ListFooter";

export default function App() {
  const { data, loading } = useQuery(TODOS_QUERY);

  const hasCompleted = React.useMemo(
    () => data && data.todos && data.todos.some(todo => todo.completed),
    [data]
  );

  return (
    <React.Fragment>
      <section className="todoapp">
        <Header disabled={loading} />

        {data && data.todos && data.todos.length > 0 && (
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

      <Footer />
    </React.Fragment>
  );
}
