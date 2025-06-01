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

async function login(req, res) {
  try {
    const body = await getRequestBody(req);
    const { email, password } = JSON.parse(body);

    const sql = 'SELECT * FROM users WHERE email = ?';

    const [results] = await db.query(sql, [email]);
    
    if (results.length === 0) {
      res.statusCode = 401;
      return res.end('No Such Email');
    }

    const user = results[0];
    
    if (password !== user.password_hash) {
      res.statusCode = 401;
      return res.end('Incorrect Password');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      id: user.id,
      name: user.username,
      mail: user.email,
      balance: user.balance,
      isShop: user.is_shop
    }));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function registration(req, res) {
  try {
    const body = await getRequestBody(req);
    const data = JSON.parse(body);
    const { username, password, email, isShop } = data;

    const balance = isShop ? null : 0.0;
    const purchase_story = isShop ? null : '';
    const sql = 'INSERT INTO users (username, password_hash, email, is_shop, balance, purchase_story) VALUES (?,?,?,?,?,?)';

    await db.query(sql, [username, password, email, isShop, balance, purchase_story]);

    res.statusCode = 200;
    res.end('Registration Succeed');

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

module.exports = {
  login,
  registration
};
