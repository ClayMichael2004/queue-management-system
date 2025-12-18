import React, { useState, useEffect } from "react";
import { API } from "../api";

const Booking = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    API.get("/services").then(res => setServices(res.data)).catch(err => console.error(err));
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


  return (
    <div>
      <h2>Book a Queue</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <select value={serviceId} onChange={e => setServiceId(e.target.value)}>
          <option value="">Select Service</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button type="submit">Book</button>
      </form>

      {receipt && (
        <div>
          <h3>Receipt</h3>
          <p>Name: {receipt.customer.name}</p>
          <p>Phone: {receipt.customer.phone}</p>
          <p>Service: {receipt.service.name}</p>
          <p>Queue Number: {receipt.queue_number}</p>
          <p>Till Number: {receipt.till_number}</p>
          <button onClick={() => window.print()}>Print Receipt</button>
        </div>
      )}
    </div>
  );
};

export default Booking;
