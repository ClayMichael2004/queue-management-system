import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./DisplayBoard.css";

const socket = io("http://localhost:5000");

const DisplayBoard = () => {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    socket.on("queue_updated", (data) => {
      setCurrent(data);
    });

    return () => socket.off("queue_updated");
  }, []);

  return (
    <div className="board">
      <h1 className="title">NOW SERVING</h1>

      {current ? (
        <div className="card">
          <div className="queue">{current.queue_number}</div>
          <div className="till">TILL {current.till_number}</div>
        </div>
      ) : (
        <p className="waiting">Waiting for next customer…</p>
      )}
    </div>
  );
};

export default DisplayBoard;
