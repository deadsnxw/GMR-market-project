const db = require('../config/database');

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
  getProfile,
  patch
};
