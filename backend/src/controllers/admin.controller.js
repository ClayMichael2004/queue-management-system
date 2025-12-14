const db = require("../config/db");

// Get all queues (optionally filter by service_id, till_id, date)
exports.getQueues = (req, res) => {
  const { service_id, till_id, date } = req.query;

  let sql = `SELECT q.id, q.queue_number, q.status, q.created_at, 
                    c.name AS customer_name, c.phone AS customer_phone,
                    s.name AS service_name, t.till_number
             FROM queues q
             JOIN customers c ON q.customer_id = c.id
             JOIN services s ON q.service_id = s.id
             JOIN tills t ON q.till_id = t.id
             WHERE 1=1`;
  
  const params = [];

  if (service_id) {
    sql += " AND q.service_id = ?";
    params.push(service_id);
  }

  if (till_id) {
    sql += " AND q.till_id = ?";
    params.push(till_id);
  }

  if (date) {
    sql += " AND DATE(q.created_at) = ?";
    params.push(date);
  }

  sql += " ORDER BY q.created_at ASC";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
