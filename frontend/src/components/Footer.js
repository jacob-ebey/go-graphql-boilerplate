import React from "react";

export default function Footer({ loggedIn, onSignOut }) {
  return (
    <footer className="info">
      {loggedIn && <p>Click to edit a todo</p>}
      
      <p>
        Created by <a href="https://jacob-ebey.js.org">Jacob Ebey</a>
      </p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>

      {loggedIn && <button onClick={onSignOut}>Sign Out</button>}
    </footer>
  );
}
