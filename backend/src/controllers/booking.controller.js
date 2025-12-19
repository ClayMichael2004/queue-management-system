const db = require("../config/db");
const sendSMS = require("../services/sms.service");

// Helper to pad queue numbers
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
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const customer_id = customerResult.insertId;
      const today = new Date().toISOString().slice(0, 10);

      // 2. Count today's queues
      db.query(
        "SELECT COUNT(*) AS count FROM queues WHERE service_id = ? AND DATE(created_at) = ?",
        [service_id, today],
        (err, countResult) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          const queueNum = countResult[0].count + 1;

          // 3. Get service info
          db.query(
            "SELECT code, name FROM services WHERE id = ?",
            [service_id],
            (err, serviceResult) => {
              if (err || serviceResult.length === 0) {
                return res.status(500).json({ message: "Service not found" });
              }

              const service_code = serviceResult[0].code;
              const service_name = serviceResult[0].name;

              // 4. Get till
              db.query(
                "SELECT id, till_number FROM tills WHERE service_id = ? LIMIT 1",
                [service_id],
                (err, tillResult) => {
                  if (err || tillResult.length === 0) {
                    return res.status(500).json({ message: "Till not found" });
                  }

                  const till_id = tillResult[0].id;
                  const till_number = tillResult[0].till_number;
                  const queue_number = service_code + pad(queueNum, 3);

                  // 5. Insert queue
                  db.query(
                    "INSERT INTO queues (queue_number, customer_id, service_id, till_id) VALUES (?, ?, ?, ?)",
                    [queue_number, customer_id, service_id, till_id],
                    (err) => {
                      if (err) {
                        return res.status(500).json({ message: err.message });
                      }

                      // 6. Send SMS
                      const message = `Hello ${name}, your queue number is ${queue_number}. Please proceed to Till ${till_number}.`;

                      sendSMS(phone, message)
                        .then(() => console.log("✅ SMS sent"))
                        .catch(() => console.log("⚠️ SMS failed"));

                      // 🔥 7. REAL-TIME UPDATE (DISPLAY BOARD)
                      const io = req.app.get("io");

                      if (io) {
                        io.emit("queue_updated", {
                          queue_number,
                          till_number,
                          service_id,
                          service_name,
                          created_at: new Date(),
                        });
                      }

                      // 8. Return receipt
                      res.json({
                        queue_number,
                        till_number,
                        service: {
                          id: service_id,
                          name: service_name,
                        },
                        customer: {
                          id: customer_id,
                          name,
                          phone,
                        },
                        created_at: new Date().toISOString(),
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
