import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

import Input from "./Input";
import "./SignIn.css";

export default function SignIn({ onSignIn }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const createOnChange = React.useCallback(set => event =>
    set(event.target.value)
  );

  const [signIn, { loading, error }] = useMutation(gql`
    mutation SignIn($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        token
        refreshToken
        user {
          email
          id
        }
      }
    }
  `);

  const onSubmit = React.useCallback(
    event => {
      event.preventDefault();

      if (loading) {
        return;
      }

      signIn({
        variables: { email, password }
      }).then(({ data }) => {
        if (data && data.signIn && data.signIn.token && data.signIn.user) {
          onSignIn && onSignIn(data.signIn);
        }
      });
    },
    [signIn, loading, email, password]
  );

  return (
    <form className="main" onSubmit={onSubmit}>
      <ul className="todo-list">
        <Input
          placeholder="Email"
          disabled={loading}
          onChange={createOnChange(setEmail)}
        />
        <Input
          placeholder="Password"
          type="password"
          disabled={loading}
          onChange={createOnChange(setPassword)}
        />
        <li className="SignInButtons">
          <button className="SignInButton" type="submit">
            Sign In
          </button>
          <Link className="SignInButton" to="/signup">
            Sign Up
          </Link>
        </li>
      </ul>
      {error && (
        <p className="SignInError">
          {(error.graphQLErrors &&
            error.graphQLErrors[0] &&
            error.graphQLErrors[0].message) ||
            error.message}
        </p>
      )}
    </form>
  );
}
