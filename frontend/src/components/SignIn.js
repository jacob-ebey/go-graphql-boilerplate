import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import Input from "./Input";
import "./SignIn.css";

export default function SignIn({ onSignIn }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const createOnChange = React.useCallback(set => event =>
    set(event.target.value)
  );

  const [signIn, { loading }] = useMutation(gql`
    mutation SignIn($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        token
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
          onSignIn && onSignIn(data.signIn)
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
        <li>
          <button class="SignInButton" type="submit">Sign In</button>
        </li>
      </ul>
    </form>
  );
}
