import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient, { gql } from "apollo-boost";
import { HashRouter as Router } from "react-router-dom";
import "todomvc-app-css/index.css";
import decode from "jwt-decode";

import "../src/styles/index.css";
import App from "../src/components/App";

const refreshClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "/graphql",
  request: async operation => {
    const auth = JSON.parse(
      localStorage.getItem("auth") || JSON.stringify(null)
    );

    const Authorization =
      auth && auth.refreshToken ? `Bearer ${auth.refreshToken}` : undefined;

    operation.setContext({
      headers: {
        Authorization
      }
    });
  }
});

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "/graphql",
  request: async operation => {
    const auth = JSON.parse(
      localStorage.getItem("auth") || JSON.stringify(null)
    );

    let token = auth && auth.token;

    if (token) {
      const decoded = decode(token);

      if (decoded && Date.now() >= decoded.exp * 1000) {
        const decodedRefreshToken = decode(auth.refreshToken);

        if (decodedRefreshToken && Date.now() < decodedRefreshToken.exp * 1000) {
          const { data } = await refreshClient.mutate({
            mutation: gql`
              mutation RefreshToken {
                refreshToken {
                  token
                  refreshToken
                  user {
                    email
                    id
                  }
                }
              }
            `
          });

          if (data && data.refreshToken) {
            localStorage.setItem("auth", JSON.stringify(data.refreshToken));
            token = data.refreshToken.token;
          } else {
            localStorage.removeItem("auth");
            token = undefined
          }
        } else {
          localStorage.removeItem("auth");
          token = undefined
        }
      }
    }

    const Authorization = token ? `Bearer ${token}` : undefined;

    operation.setContext({
      headers: {
        Authorization
      }
    });
  }
});

//Apollo Client
ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
