const db = require("../config/db");

exports.callNext = (req, res) => {
  const { service_id } = req.body;

  db.query(
    `SELECT q.id, q.queue_number, t.till_number
     FROM queues q
     JOIN tills t ON q.till_id = t.id
     WHERE q.service_id = ? AND q.status = 'WAITING'
     ORDER BY q.created_at ASC
     LIMIT 1`,
    [service_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      if (rows.length === 0)
        return res.status(404).json({ message: "No waiting customers" });

      const queue = rows[0];

      db.query(
        "UPDATE queues SET status = 'SERVING' WHERE id = ?",
        [queue.id]
      );

      // 🔴 REALTIME UPDATE
      const io = req.app.get("io");
      io.emit("queue_called", queue);

      res.json(queue);
    }
  );
};

exports.markServed = (req, res) => {
  const { queue_id } = req.body;

  if (!queue_id) {
    return res.status(400).json({ message: "queue_id is required" });
  }

  db.query(
    "UPDATE queues SET status = 'COMPLETED' WHERE id = ?",
    [queue_id],
    (err, result) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ message: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Queue not found" });
      }

      const io = req.app.get("io");
      io.emit("queue_served", { queue_id });

      res.json({ message: "Customer served successfully" });
    }
  );
};



// 🔹 NEW: get queues by till
exports.getQueuesByTill = (req, res) => {
  const till_id = req.query.till_id || req.user.till_id;

  if (!till_id) return res.status(400).json({ message: "till_id is required" });

  db.query(
    `SELECT q.id, q.queue_number, q.status, c.name AS customer_name, s.name AS service_name
     FROM queues q
     JOIN customers c ON q.customer_id = c.id
     JOIN services s ON q.service_id = s.id
     WHERE q.till_id = ? AND q.status != 'COMPLETED'
     ORDER BY q.created_at ASC`,
    [till_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
};
