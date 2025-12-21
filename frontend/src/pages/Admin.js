import React, { useEffect, useState } from "react";
import { API } from "../api";
import io from "socket.io-client";
import "./Admin.css";

const socket = io("http://localhost:5000");

const Admin = () => {
  const [tills, setTills] = useState([]);
  const [queues, setQueues] = useState([]);
  const [selectedTill, setSelectedTill] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchTills();

    socket.on("queue_called", () => fetchQueues(selectedTill));
    socket.on("queue_served", () => fetchQueues(selectedTill));

    return () => {
      socket.off("queue_called");
      socket.off("queue_served");
    };
  }, [selectedTill]);

  const fetchTills = () => {
    API.get("/tills")
      .then(res => setTills(res.data))
      .catch(err => console.error(err));
  };

  const fetchQueues = (tillId) => {
    if (!tillId) return;

    API.get(`/queues?till_id=${tillId}`)
      .then(res => setQueues(res.data))
      .catch(err => console.error(err));
  };

  const handleSelectTill = (till) => {
    setSelectedTill(till);
    fetchQueues(till.id);
  };

  const handleCallNext = (serviceId) => {
    API.post("/queues/call-next", { service_id: serviceId })
      .then(res => {
        setNotification({
          type: "success",
          text: `Queue ${res.data.queue_number} sent to till`,
        });

        setTimeout(() => setNotification(null), 4000);
      })
      .catch(() => {
        setNotification({
          type: "error",
          text: "No waiting customers",
        });

        setTimeout(() => setNotification(null), 4000);
      });
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Queue Management Control Panel</p>
      </header>

      {/* NOTIFICATION */}
      {notification && (
        <div className={`toast ${notification.type}`}>
          {notification.text}
        </div>
      )}

      <div className="admin-layout">
        {/* LEFT – TILLS */}
        <aside className="admin-sidebar">
          <h3>Tills</h3>
          {tills.map(till => (
            <div
              key={till.id}
              className={`till-item ${selectedTill?.id === till.id ? "active" : ""}`}
              onClick={() => handleSelectTill(till)}
            >
              <strong>Till {till.till_number}</strong>
              <span>{till.service_name}</span>
            </div>
          ))}
        </aside>

        {/* RIGHT – QUEUES */}
        <main className="admin-main">
          {!selectedTill ? (
            <div className="empty-state">Select a till to view queues</div>
          ) : (
            <>
              <h3>
                Till {selectedTill.till_number} — {selectedTill.service_name}
              </h3>

              <button
                className="call-next-btn"
                onClick={() => handleCallNext(selectedTill.service_id)}
              >
                Call Next Customer
              </button>

              {queues.length === 0 ? (
                <p className="no-queues">No active queues</p>
              ) : (
                <div className="queue-table">
                  {queues.map(q => (
                    <div className="queue-row" key={q.id}>
                      <span>{q.queue_number}</span>
                      <span>{q.customer_name}</span>
                      <span className={`status ${q.status.toLowerCase()}`}>
                        {q.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
