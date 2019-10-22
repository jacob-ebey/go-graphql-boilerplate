import React from "react";
import ReactDOM from "react-dom";
import "../src/styles/index.css";
import App from "../src/components/App";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

import "todomvc-app-css/index.css"

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "/graphql"
});

//Apollo Client
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
