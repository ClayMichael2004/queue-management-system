import React, { useState, useEffect, useRef } from "react";
import { API } from "../api";
import "./Booking.css";

const Booking = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [receipt, setReceipt] = useState(null);
  const receiptRef = useRef(null);

  useEffect(() => {
    API.get("/services")
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post("/bookings", {
      name,
      phone,
      service_id: serviceId,
    });

    setReceipt(res.data);
  };

  const handlePrint = () => {
    window.print();

    // Clear screen after printing
    setTimeout(() => {
      setReceipt(null);
      setName("");
      setPhone("");
      setServiceId("");
    }, 300);
  };

  return (
    <div className="booking-shell">
      <div className="booking-card">
        {!receipt ? (
          <>
            <h1 className="title">Queue Booking</h1>
            <p className="subtitle">Please enter your details below</p>

            <form onSubmit={handleSubmit} className="booking-form">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />

              <select
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                required
              >
                <option value="">Select Service</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button type="submit">Generate Queue</button>
            </form>
          </>
        ) : (
          <div className="receipt" ref={receiptRef}>
            <h2 className="receipt-title">Queue Receipt</h2>

            <div className="receipt-row">
              <span>Name</span>
              <strong>{receipt.customer.name}</strong>
            </div>

            <div className="receipt-row">
              <span>Phone</span>
              <strong>{receipt.customer.phone}</strong>
            </div>

            <div className="receipt-row">
              <span>Service</span>
              <strong>{receipt.service.name}</strong>
            </div>

            <div className="queue-box">
              <span>Queue Number</span>
              <h1>{receipt.queue_number}</h1>
            </div>

            <div className="receipt-row">
              <span>Till</span>
              <strong>{receipt.till_number}</strong>
            </div>

            <button className="print-btn" onClick={handlePrint}>
              Print Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
