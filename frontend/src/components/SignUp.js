import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Link, Redirect } from "react-router-dom";

import Input from "./Input";
import "./SignUp.css";

export default function SignUp({ onSignUp, loggedIn }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const createOnChange = React.useCallback(set => event =>
    set(event.target.value)
  );

  const [signUp, { loading, error }] = useMutation(
    gql`
      mutation SignUp(
        $email: String!
        $password: String!
        $confirmPassword: String!
      ) {
        signUp(
          email: $email
          password: $password
          confirmPassword: $confirmPassword
        ) {
          token
          refreshToken
          user {
            email
            id
          }
        }
      }
    `,
    {
      variables: { email, password, confirmPassword }
    }
  );

  const onSubmit = React.useCallback(
    event => {
      event.preventDefault();

      if (loading) {
        return;
      }

      signUp({
        variables: { email, password }
      }).then(({ data }) => {
        if (data && data.signUp && data.signUp.token && data.signUp.user) {
          onSignUp && onSignUp(data.signUp);
        }
      });
    },
    [signUp, loading, email, password, confirmPassword]
  );

  return loggedIn ? (
    <Redirect to="/"  />
  ) : (
    <form className="main" onSubmit={onSubmit}>
      <ul className="todo-list">
        <Input
          placeholder="Email"
          disabled={loading}
          value={email}
          onChange={createOnChange(setEmail)}
        />
        <Input
          placeholder="Password"
          type="password"
          disabled={loading}
          value={password}
          onChange={createOnChange(setPassword)}
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          disabled={loading}
          value={confirmPassword}
          onChange={createOnChange(setConfirmPassword)}
        />
        <li className="SignUpButtons">
          <button className="SignUpButton" type="submit">
            Sign Up
          </button>
          <Link className="SignInButton" to="/">
            Sign In
          </Link>
        </li>
      </ul>
      {error && (
        <p className="SignUpError">
          {(error.graphQLErrors &&
            error.graphQLErrors[0] &&
            error.graphQLErrors[0].message) ||
            error.message}
        </p>
      )}
    </form>
  );
}
