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

async function getProductsByTags(req, res) {
  try {
    const body = await getRequestBody(req);
    const { tags: requestedTags } = JSON.parse(body);
    
    const sql = `
      SELECT 
        p.id AS product_id,
        p.name,
        p.price,
        p.amount,
        p.tags,
        i.id AS image_id,
        i.img AS image_url
      FROM products p
      LEFT JOIN images i ON p.id = i.product_id
    `;

    const [results] = await db.query(sql);

    const productsMap = {};

    for (const result of results) {
      if (!productsMap[result.product_id]) {
        productsMap[result.product_id] = {
          id: result.product_id,
          name: result.name,
          price: parseFloat(result.price),
          amount: result.amount,
          tags: result.tags ? result.tags.split(':') : [],
          image: null
        };
      }

      if (result.image_id && !productsMap[result.product_id].image) {
        productsMap[result.product_id].image = result.image_url;
      }
    }

    let products = Object.values(productsMap);

    

    if (requestedTags.length > 0) {
      products = products.filter(product =>
        requestedTags.every(tag => product.tags.includes(tag))
      );
    }

    const response = products
      .slice(0, 16)
      .map(({ tags, ...p }) => p);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ products: response, tagList: tagList }));

  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function getProductById(req, res, id) {
  const productId = parseInt(id);

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

  try {
    const [results] = await db.query(sql, [productId]);

    if (results.length === 0) {
      res.statusCode = 404;
      return res.end('Product Not Found');
    }

    const response = {
      id: results[0].product_id,
      name: results[0].name,
      price: parseFloat(results[0].price),
      amount: results[0].amount,
      description: results[0].description,
      tags: results[0].tags ? results[0].tags.split(':') : [],
      creatorId: results[0].user_id,
      images: []
    };

    for (const row of results) {
      if (row.image_id) {
        response.images.push(row.image_url);
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));

  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

module.exports = {
  getProductById,
  getProductsByTags
};
