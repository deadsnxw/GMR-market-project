const db = require('../config/database');
const tagList = require('../config/tags');

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', err => reject(err));
  });
}

async function buy(req, res, id) {
  try {
    const body = await getRequestBody(req);
    const { userId } = JSON.parse(body);
    const productId = parseInt(id);

    const sqlPrice = `SELECT price FROM products WHERE id = ?`;
    const sqlAmount = 'UPDATE products SET amount = amount - 1 WHERE id = ?';
    const sqlChangeBalance = 'UPDATE users SET balance = balance - ? WHERE id = ?';
    const sqlStory = 'UPDATE users SET purchase_story = CONCAT(purchase_story, ?) WHERE id = ?';
    const sqlNewBalance = 'SELECT balance FROM users WHERE id = ?';

    const [[result]] = await db.query(sqlPrice, [productId]);

    if (!result) {
      res.statusCode = 404;
      return res.end('Product Not Found');
    }

    const price = result.price;

    await db.query(sqlAmount, [productId]);
    await db.query(sqlChangeBalance, [price, userId]);
    await db.query(sqlStory, [`:${productId}`, userId]);

    const [[balance]] = await db.query(sqlNewBalance, [userId]);
     
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( balance ));

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function check(req, res, id) {
  try {
    const body = await getRequestBody(req);
    const { userId } = JSON.parse(body);
    const productId = parseInt(id);

    const sql = 'SELECT user_id FROM products WHERE id = ?';

    const [[result]] = await db.query(sql, [productId]);

    if (!result) {
      res.statusCode = 404;
      return res.end('Product Not Found');
    }

    const isOwner = result.user_id === userId;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ isOwner: isOwner }));

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function onEdit(req, res) {
  try {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( tagList ));

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

module.exports = {
  buy,
  check,
  onEdit
};
