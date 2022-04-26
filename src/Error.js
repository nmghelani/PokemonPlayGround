import React from "react";
import { useLocation } from "react-router";

const Error = ({ code, message }) => {
  const location = useLocation();
  if (location.state && location.state.code != null) {
    code = location.state.code;
  }
  if (location.state && location.state.message != null) {
    message = location.state.message;
  }
  return (
    <div className="center-cropped-search">
      <main className="main-search">
        <h1 className="title-search">Error {code ? code : 500}</h1>
        <p className="text-left">
          {message ? message : "Something went wrong"}
        </p>
      </main>
    </div>
  );
};

export default Error;
