import React from "react";
import { Switch, Route } from "react-router-dom";
import decode from "jwt-decode";
import { useApolloClient } from "@apollo/react-hooks"

import Footer from "./Footer";
import Header from "./Header";
import HomePage from "./HomePage";
import SignUp from "./SignUp";

export default function App() {
  const initialLoggedIn = React.useMemo(() => {
    const auth = JSON.parse(
      localStorage.getItem("auth") || JSON.stringify(null)
    );

    if (auth && auth.refreshToken) {
      const decoded = decode(auth.refreshToken);

      if (decoded && Date.now() < decoded.exp * 1000) {
        return true;
      }
    }

    return false;
  }, []);

  const [loggedIn, setLoggedIn] = React.useState(initialLoggedIn);

  const client = useApolloClient();

  const onSignIn = React.useCallback(payload => {
    setLoggedIn(!!payload);
    localStorage.setItem("auth", JSON.stringify(payload));
  });

  const onSignOut = React.useCallback(() => {
    setLoggedIn(false);
    localStorage.removeItem("auth");
    client.resetStore();
  });

  const WrappedHome = props => (
    <HomePage loggedIn={loggedIn} onSignIn={onSignIn} {...props} />
  );

  const WrappedSignUp = props => <SignUp loggedIn={loggedIn} onSignUp={onSignIn} {...props} />;

  return (
    <React.Fragment>
      <section className="todoapp">
        <Header loggedIn={loggedIn} />
        <Switch>
          <Route path="/signup" component={WrappedSignUp} />
          <Route path="/:filter" component={WrappedHome} />
          <Route path="/" component={WrappedHome} />
        </Switch>
      </section>
      <Footer loggedIn={loggedIn} onSignOut={onSignOut} />
    </React.Fragment>
  );
}
