const db = require('../config/database');

function login(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const { email, password } = JSON.parse(body);

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        res.statusCode = 500;
        return res.end('DB error');
      }

      if (results.length === 0) {
        res.statusCode = 401;
        return res.end('No such email in database');
      }

      const user = results[0];

      if (password !== user.password_hash) {
        res.statusCode = 401;
        return res.end('Incorrect password');
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ id: user.id, name: user.username, mail: user.email, balance: user.balance, is_shop: user.is_shop }));
    });
  });
}

function registration(req, res) {
  const sql = 'INSERT INTO users (username, password, email, is_shop, balance, purchase_story) VALUES (?,?,?,?,?,?)';
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const is_shop = req.body.is_shop;
  const balance = is_shop ? null : 0.0;
  const purchase_story = null;

  db.query(sql, [username, password, email, is_shop, balance, purchase_story], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }
  
    res.statusCode = 200;
    res.end();
  });
}

module.exports = {
  login,
  registration
};
