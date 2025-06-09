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

async function create(req, res) {
  const body = await getRequestBody(req);
  const { name, price, amount, description, tags, userId: user_id, images: image_urls } = JSON.parse(body);

  const sqlProduct = 'INSERT INTO products (name, price, amount, description, tags, user_id) VALUES (?,?,?,?,?,?)';
  const sqlImages = 'INSERT INTO images (img, product_id) VALUES (?,?)';
  
  try {
    const [result] = await db.query(sqlProduct, [name, price, amount, description, tags.join(':'), user_id]);

    const productId = result.insertId;

    for (const image_url of image_urls) {
      await db.query(sqlImages, [image_url, productId]);
    }

    res.statusCode = 200;
    res.end('Product Created');

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function remove(req, res, id) {
  const productId = parseInt(id);

  const sql = 'DELETE FROM products WHERE id = ?';

  try {
    const [result] = await db.query(sql, [productId]);

    if (result.affectedRows === 0) {
      res.statusCode = 404;
      return res.end('Nothing Deleted');
    }

    res.statusCode = 200;
    res.end('Product Deleted');

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function patch(req, res, id) {
  const productId = parseInt(id);
  const body = await getRequestBody(req);
  const updates = JSON.parse(body);

  if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
    res.statusCode = 400;
    return res.end('No Input');
  }

  try {
    if (Array.isArray(updates.tags)) {
      updates.tags = updates.tags.join(':');
    }

    const productKeys = Object.keys(updates).filter(key => key !== 'images' && key !== 'creatorId');

    if (productKeys.length > 0) {
      const productSqlSet = productKeys.map(key => `${key} = ?`).join(', ');
      const productValues = productKeys.map(key => updates[key]);
      productValues.push(productId);

      const updateProductSql = `UPDATE products SET ${productSqlSet} WHERE id = ?`;
      const [productResult] = await db.query(updateProductSql, productValues);

      if (productResult.affectedRows === 0) {
        res.statusCode = 404;
        return res.end('Product Not Found');
      }
    }

    if ('images' in updates) {
      const imagesValue = updates.images;

      await db.query('DELETE FROM images WHERE product_id = ?', [productId]);

      for (const image of imagesValue) {
        await db.query('INSERT INTO images (product_id, img) VALUES (?, ?)', [productId, image]);
      }
    }


    res.statusCode = 200;
    res.end('Product Updated');

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

module.exports = {
  create,
  remove,
  patch
};
