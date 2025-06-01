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

async function getCustomerStory(req, res, id) {
  try {
    const [[result]] = await db.query('SELECT purchase_story FROM users WHERE id = ?', [id]);

    if (!result) {
      res.statusCode = 404;
      return res.end('User Not Found');
    }

    const purchaseStory = result.purchase_story;

    if (!purchaseStory) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify([]));
    }

    const purchaseIds = purchaseStory
      .split(':')      
      .map(id => parseInt(id))
      .filter(id => !isNaN(id));

    if (purchaseIds.length === 0) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify([]));
    }

    const placeholders = purchaseIds.map(() => '?').join(',');
    const sql = `
    SELECT 
      p.id AS product_id,
      p.name,
      p.price,
      p.amount,
      i.id AS image_id,
      i.img AS image_url
    FROM products p
    LEFT JOIN images i ON p.id = i.product_id
    WHERE p.id IN (${placeholders})
    `;

    const [products] = await db.query(sql, purchaseIds);

    const productsMap = {};

    for (const product of products) {
      if (!productsMap[product.product_id]) {
        productsMap[product.product_id] = {
          id: product.product_id,
          name: product.name,
          price: parseFloat(product.price),
          amount: product.amount,
          image: null
        };
      }

      if (product.image_id && !productsMap[product.product_id].image) {
        productsMap[product.product_id].image = product.image_url;
      }
    }

    const story = Object.values(productsMap);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(story));

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function getShopItems(req, res, id) {
  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,
      p.price,
      p.amount,
      i.id AS image_id,
      i.img AS image_url
    FROM products p
    LEFT JOIN images i ON p.id = i.product_id
    WHERE p.user_id = ?
  `;

  try {
    const [products] = await db.query(sql, [id]);

    const productsMap = {};

    for (const product of products) {
      if (!productsMap[product.product_id]) {
        productsMap[product.product_id] = {
          id: product.product_id,
          name: product.name,
          price: parseFloat(product.price),
          amount: product.amount,
          image: null
        };
      }

      if (product.image_id && !productsMap[product.product_id].image) {
        productsMap[product.product_id].image = product.image_url;
      }
    }

    const shopItems = Object.values(productsMap);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(shopItems));

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function getProfile(req, res, id) {
  const sql = 'SELECT is_shop FROM users WHERE id = ?';

  try {
    const [[result]] = await db.query(sql, [id]);

    if (!result) {
      res.statusCode = 404;
      return res.end('User Not Found');
    }

    const role = result.is_shop;

    return role === 1
      ? await getShopItems(req, res, id)
      : await getCustomerStory(req, res, id);

  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
async function patch(req, res, id) {
  const userId = parseInt(id);
  const body = await getRequestBody(req);
  const updates = JSON.parse(body);

  if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
    res.statusCode = 400;
    return res.end('No Input');
  }

  try {
    if (updates.password && updates.newPassword) {
      const [[user]] = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId]);

      if (!user) {
        res.statusCode = 404;
        return res.end('User Not Found');
      }

      if (updates.password !== user.password_hash) {
        res.statusCode = 403;
        return res.end('Incorrect Password');
      }

      updates.password_hash = updates.newPassword;
    }

    const keys = Object.keys(updates).filter(key => key !== 'password' && key !== 'newPassword');
    if (keys.length === 0) {
      res.statusCode = 400;
      return res.end('No valid fields to update');
    }

    const values = keys.map(k => updates[k]);
    const sqlSet = keys.map(k => `${k} = ?`).join(', ');
    values.push(userId);

    const sql = `UPDATE users SET ${sqlSet} WHERE id = ?`;
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      res.statusCode = 404;
      return res.end('User Not Found');
    }

    res.statusCode = 200;
    res.end('User Updated');

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}


module.exports = {
  getProfile,
  patch
};
