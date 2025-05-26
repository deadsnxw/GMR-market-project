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

function getCustomerStory(req, res, id) {
  const sqlUser = 'SELECT purchase_story FROM users WHERE id = ?';

  db.query(sqlUser, [id], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    if (results.length === 0) {
      res.statusCode = 404;
      return res.end('User not found');
    }

    const purchaseStory = results[0].purchase_story;

    if (!purchaseStory) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify( [] ));
    }

    const purchaseIds = purchaseStory
      .split(':')
      .map(strNum => parseInt(strNum, 10));

    if (purchaseIds.length === 0) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify( [] ));
    }

    const placeholders = purchaseIds.map(() => '?').join(',');
    const sqlProducts = `SELECT * FROM products WHERE id IN (${placeholders})`;

    db.query(sqlProducts, purchaseIds, (err2, products) => {
      if (err2) {
        res.statusCode = 500;
        return res.end('Database error on products');
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( products ));
    });
  });
}

function getShopItems(req, res, id) {
  const sql = 'SELECT * FROM products WHERE user_id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( results ));
  });
}

function getProfile(req, res, id) {
  const sql = 'SELECT is_shop FROM users WHERE id = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    if (results.length === 0) {
      res.statusCode = 404;
      return res.end('User not found');
    }

    const role = results[0].is_shop;

    if (role === 0) {
      return getCustomerStory(req, res, id);
    } 
    else if (role === 1) {
      return getShopItems(req, res, id);
    }
  });
}

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

function patch(req, res, id) {
  const updates = req.body;
  const keys = Object.keys(updates);

  if (keys.length === 0) {
    res.statusCode = 400;
    return res.end('No fields to update');
  }

  const sqlSet = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => updates[key]);
  
  values.push(id);

  const sql = `UPDATE users SET ${sqlSet} WHERE id = ?`;

  db.query(sql, values, (err) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    res.statusCode = 200;
    res.end('Product updated');
  });
}

module.exports = {
  login,
  getProfile,
  balance,
  registration,
  patch
};
