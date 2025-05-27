const db = require('../config/database');

function create(req, res) {
  const sqlProduct = 'INSERT INTO products (name, price, amount, description, tags, user_id) VALUES (?,?,?,?,?,?)';
  const sqlImages = 'INSERT INTO images (image_url, product_id) VALUES (?,?)';
  const name = req.body.name;
  const price = req.body.price;
  const amount = req.body.amount;
  const description = req.body.description;
  const tags = req.body.tags.join(':');
  const user_id = req.body.user_id;
  const image_urls = req.body.image_url;
  let completed = 0;

  db.query(sqlProduct, [name, price, amount, description, tags, user_id], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    const productId = results.insertId;

    image_urls.forEach(image_url => {
      db.query(sqlImages, [image_url, productId], (err, results) => {
        if (err) {
          res.statusCode = 500;
          return res.end('Database error');
        }
      
        completed++;

        if (completed === image_urls.length) {
          res.statusCode = 200;
          res.end();
        }
      });      
    });
  });
}

function remove(req, res, id) {
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Database error');
    }

    if (results.length === 0) {
      res.statusCode = 404;
      return res.end('Product not found');
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

  const sql = `UPDATE products SET ${sqlSet} WHERE id = ?`;

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
  create,
  remove,
  patch
};
