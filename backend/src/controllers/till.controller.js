const db = require("../config/db");
const sendSMS = require("../services/sms.service");

exports.completeQueue = (req, res) => {
  const { queue_id } = req.params;

  if (!queue_id) return res.status(400).json({ message: "Queue ID is required" });

  // 1. Get queue info (customer + till)
  db.query(
    `SELECT q.queue_number, q.till_id, q.customer_id, c.name AS customer_name, c.phone AS customer_phone, t.till_number
     FROM queues q
     JOIN customers c ON q.customer_id = c.id
     JOIN tills t ON q.till_id = t.id
     WHERE q.id = ?`,
    [queue_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Queue not found" });

      const queue = results[0];

      // 2. Update queue status to COMPLETED
      db.query(
        "UPDATE queues SET status = 'COMPLETED' WHERE id = ?",
        [queue_id],
        (err) => {
          if (err) return res.status(500).json({ message: err.message });

          // 3. Send "Thank you" SMS
          const message = `Hello ${queue.customer_name}, your service at Till ${queue.till_number} is completed. Thank you!`;
          sendSMS(queue.customer_phone, message)
            .then((response) => {
              console.log("Thank you SMS sent:", response);
            })
            .catch((err) => {
              console.error("Thank you SMS failed:", err);
            });

          // 4. Return success
          res.json({
            message: `Queue ${queue.queue_number} marked as completed.`,
            queue_id,
            customer: {
              id: queue.customer_id,
              name: queue.customer_name,
              phone: queue.customer_phone,
            },
          });
        }
      );
    }
  );
};

exports.getTillById = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT t.id, t.till_number, s.name AS service_name
     FROM tills t
     JOIN services s ON t.service_id = s.id
     WHERE t.id = ?`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Till not found" });
      res.json(results[0]);
    }
  );
};
