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

module.exports = {
  getAllProducts,
  getProductById
};
