// src/pages/Secretary.js
import React, { useState, useEffect } from "react";
import { API } from "../api";
import io from "socket.io-client";
import "./Secretary.css";

const socket = io("http://localhost:5000"); // backend port

const Secretary = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const secretaryTillId = user?.till_id;

  const [queues, setQueues] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [notification, setNotification] = useState(null); // ✅ NEW

  useEffect(() => {
    if (!secretaryTillId) return;

    // Fetch till info
    API.get(`/tills/${secretaryTillId}`)
      .then(res => setServiceName(res.data.service_name))
      .catch(err => console.error(err));

    fetchQueues();

    // Real-time updates
    socket.on("queue_called", (queue) => {
      if (queue.till_id === secretaryTillId) fetchQueues();
    });

    socket.on("queue_served", ({ queue_id }) => {
      setQueues(prev => prev.filter(q => q.id !== queue_id));
    });

    return () => {
      socket.off("queue_called");
      socket.off("queue_served");
    };
  }, [secretaryTillId]);

  const fetchQueues = () => {
    API.get(`/queues?till_id=${secretaryTillId}`)
      .then(res => setQueues(res.data))
      .catch(err => console.error(err));
  };

  const handleCallNext = (queueId) => {
    API.post("/queues/serve", { queue_id: queueId })
      .then(res => {
        // ✅ SHOW SUCCESS NOTIFICATION
        setNotification({
          type: "success",
          text: res.data.message,
          customer: res.data.customer?.name,
        });

        // auto-dismiss after 4 seconds
        setTimeout(() => setNotification(null), 4000);
      })
      .catch(err => {
        setNotification({
          type: "error",
          text: "Failed to mark queue as completed",
        });

        setTimeout(() => setNotification(null), 4000);
        console.error(err);
      });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="secretary-container">
      <header className="secretary-header">
        <h2>Secretary Dashboard</h2>
        <p>
          Till {secretaryTillId} — {serviceName}
        </p>
      </header>

      {/* ✅ NOTIFICATION / TOAST */}
      {notification && (
        <div className={`toast ${notification.type}`}>
          <strong>{notification.text}</strong>
          {notification.customer && (
            <p>Customer: {notification.customer}</p>
          )}
        </div>
      )}

      {queues.length === 0 ? (
        <div className="no-queues">No waiting customers</div>
      ) : (
        <div className="queue-list">
          {queues.map(q => (
            <div className="queue-card" key={q.id}>
              <div className="queue-info">
                <p><strong>Queue:</strong> {q.queue_number}</p>
                <p><strong>Name:</strong> {q.customer_name}</p>
                <p><strong>Status:</strong> {q.status}</p>
              </div>
              <button onClick={() => handleCallNext(q.id)}>
                Mark Completed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Secretary;
