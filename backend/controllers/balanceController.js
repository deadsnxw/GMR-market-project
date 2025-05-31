const db = require('../config/database');

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

async function balance(req, res, id) {
  try {
    const body = await getRequestBody(req);
    const { earn } = JSON.parse(body);
    const userId = parseInt(id);

    const sqlUpdate = 'UPDATE users SET balance = balance + ? WHERE id = ?';
    const sqlGet = 'SELECT balance from users WHERE id = ?';

    await db.query(sqlUpdate, [earn, userId]);

    const [[result]] = await db.query(sqlGet, [userId])

    const newBalance = result.balance;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ newBalance: newBalance }));

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

module.exports = {
  balance
};
