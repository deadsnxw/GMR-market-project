const db = require('../config/database');

function buy_check(req, res, id) {
  const productId = parseInt(id);
  const userId = req.body.id;
  const sql = 'SELECT is_shop FROM users WHERE id = ?'

  db.query(sql, [userId], (err, results) => {
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
      return buy(req, res, productId, userId);
    }

    else if (role === 1) {
      return check(req, res, productId, userId);
    }
  });
}

function buy(req, res, productId, userId) {
  const sqlPrice = `SELECT price FROM products WHERE id = ?`;
  const sqlAmount = 'UPDATE products SET amount = amount - 1 WHERE id = ?'
  const sqlBalance = 'UPDATE users SET balance = balance - ? WHERE id = ?'
  const sqlStory = 'UPDATE users SET purchase_story = CONCAT(purchase_story, ?) WHERE id = ?'

  db.query(sqlPrice, [productId], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    if (results.length === 0) {
      res.statusCode = 404;
      return res.end('Product not found');
    }

    const price = results[0].price;

    db.query(sqlAmount, [productId], (err, results) => {
      if (err) {
        res.statusCode = 500;
        return res.end('Database error');
      }

      if (results.length === 0) {
        res.statusCode = 404;
        return res.end('Product not found');
      }
    
      db.query(sqlBalance, [price, userId], (err, results) => {
        if (err) {
          res.statusCode = 500;
          return res.end('Database error');
        }

        if (results.length === 0) {
          res.statusCode = 404;
          return res.end('User not found');
        }

        db.query(sqlStory, [`:${productId}`, userId], (err, results) => {
          if (err) {
            res.statusCode = 500;
            return res.end('Database error');
          }

          if (results.length === 0) {
            res.statusCode = 404;
            return res.end('User not found');
          }

          res.statusCode = 200;
          res.end();
        });
      });
    });
  });
}

function check(req, res, productId, userId) {
  const sql = 'SELECT user_id FROM products WHERE id = ?';

  db.query(sql, [productId], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    if (results.length === 0) {
      res.statusCode = 404;
      return res.end('Product not found');
    }

    const isOwner = userId === results[0].user_id;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({isOwner: isOwner}));
  });
}

module.exports = {
  buy_check
};
