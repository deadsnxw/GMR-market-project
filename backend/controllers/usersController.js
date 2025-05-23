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
      res.end(JSON.stringify({user: { id: user.id, name: user.username, main: user.email, balance: user.balance, is_shop: user.is_shop }}));
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

    const purchaseIds = purchaseStory
      .split(':')
      .map(strNum => parseInt(strNum, 10));

    if (purchaseIds.length === 0) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ id, purchase_story: [] }));
    }

    const placeholders = purchaseIds.map(() => '?').join(','); // "?, ?, ?, ..."
    const sqlProducts = `SELECT * FROM products WHERE id IN (${placeholders})`;

    db.query(sqlProducts, purchaseIds, (err2, products) => {
      if (err2) {
        res.statusCode = 500;
        return res.end('Database error on products');
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ id, purchase_story: products }));
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
    res.end(JSON.stringify({ seller_id: id, products: results }));
  });
}

function getProfile(res, req, id) {
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

module.exports = {
  login,
  getProfile
};
