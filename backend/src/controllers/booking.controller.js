const db = require("../config/db");

// Helper to pad numbers
function pad(num, size) {
  let s = "000" + num;
  return s.substr(s.length - size);
}

exports.createBooking = (req, res) => {
  const { name, phone, service_id } = req.body;
  if (!name || !phone || !service_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 1. Insert customer
  db.query(
    "INSERT INTO customers (name, phone) VALUES (?, ?)",
    [name, phone],
    (err, customerResult) => {
      if (err) return res.status(500).json({ message: err.message });

      const customer_id = customerResult.insertId;

      // 2. Count today’s queues for service
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      db.query(
        "SELECT COUNT(*) AS count FROM queues WHERE service_id = ? AND DATE(created_at) = ?",
        [service_id, today],
        (err, countResult) => {
          if (err) return res.status(500).json({ message: err.message });

          const queueNum = countResult[0].count + 1;

          // 3. Get service code and till
          db.query(
            "SELECT code FROM services WHERE id = ?",
            [service_id],
            (err, serviceResult) => {
              if (err) return res.status(500).json({ message: err.message });

              const service_code = serviceResult[0].code;

              db.query(
                "SELECT id, till_number FROM tills WHERE service_id = ?",
                [service_id],
                (err, tillResult) => {
                  if (err) return res.status(500).json({ message: err.message });

                  const till_id = tillResult[0].id;
                  const till_number = tillResult[0].till_number;

                  const queue_number = service_code + pad(queueNum, 3);

                  // 4. Insert queue
                  db.query(
                    "INSERT INTO queues (queue_number, customer_id, service_id, till_id) VALUES (?, ?, ?, ?)",
                    [queue_number, customer_id, service_id, till_id],
                    (err) => {
                      if (err) return res.status(500).json({ message: err.message });

                      // 5. Return receipt data
                      res.json({
                        queue_number,
                        till_number,
                        service: { id: service_id, name: serviceResult[0].name },
                        customer: { id: customer_id, name, phone },
                        created_at: new Date().toISOString()
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};
