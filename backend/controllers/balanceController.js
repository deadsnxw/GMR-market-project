const db = require('../config/database');

function balance(req, res, id) {
  const sql = 'UPDATE users SET balance = balance + ? WHERE id = ?'

  const userId = parseInt(id);

  const earn = req.body.earn;

  db.query(sql, [earn, userId], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    res.statusCode = 500;
    res.end();
  });
}

module.exports = {
  balance
};
