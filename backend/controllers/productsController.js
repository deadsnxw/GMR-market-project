const db = require('../config/database');

function getAllProducts(req, res) {
  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,
      p.price,
      p.amount,
      p.description,
      p.tags,
      p.user_id,
      i.id AS image_id,
      i.img AS image_url
    FROM products p
    LEFT JOIN images i ON p.id = i.product_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Помилка запиту до БД');
    }

    const productsMap = {};

    results.forEach(row => {
      if (!productsMap[row.product_id]) {
        productsMap[row.product_id] = {
          id: row.product_id,
          name: row.name,
          price: row.price,
          amount: row.amount,
          description: row.description,
          tags: row.tags ? row.tags.split(':') : [],
          user_id: row.user_id,
          images: []
        };
      }

      if (row.image_id) {
        productsMap[row.product_id].images.push({
          id: row.image_id,
          url: row.image_url
        });
      }
    });

    const products = Object.values(productsMap);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(products));
  });
}

function getProductById(req, res, id) {
  const productId = parseInt(id);

  if (isNaN(productId)) {
    res.statusCode = 400;
    return res.end('Некоректний ID товару');
  }

  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,
      p.price,
      p.amount,
      p.description,
      p.tags,
      p.user_id,
      i.id AS image_id,
      i.img AS image_url
    FROM products p
    LEFT JOIN images i ON p.id = i.product_id
    WHERE p.id = ?
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) {
      res.statusCode = 500;
      return res.end('Помилка запиту до БД');
    }

    if (results.length === 0) {
      res.statusCode = 404;
      return res.end('Товар не знайдено');
    }

    const product = {
      id: results[0].product_id,
      name: results[0].name,
      price: parseFloat(results[0].price),
      amount: results[0].amount,
      description: results[0].description,
      tags: results[0].tags.split(':'),
      user_id: results[0].user_id,
      images: []
    };

    results.forEach(row => {
      if (row.image_id) {
          product.images.push(row.image_url);
      }
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(product));
  });
}

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
  getAllProducts,
  getProductById,
  buy_check,
  remove,
  create,
  patch
};
