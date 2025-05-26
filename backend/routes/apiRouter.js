const productsController = require('../controllers/productsController');
const usersController = require('../controllers/usersController');

const staticRoutes = {
  '/api/login': usersController.login,
  '/api/registration': usersController.registration,
  '/api/balance': usersController.balance,
  '/api/main': productsController.getAllProducts,
  '/api/new': productsController.create,
};

const staticRoutesMethods = {
  '/api/login': ['POST'],
  '/api/registration': ['POST'],
  '/api/balance': ['PATCH'],
  '/api/main': ['GET'],
  '/api/new': ['POST'],
};

const dynamicRoutes = [
  {
    method: 'GET',
    regex: /^\/api\/user\/([^/]+)$/,
    handler: (req, res, params) => usersController.getProfile(req, res, params[0])
  },
  {
    method: 'PATCH',
    regex: /^\/api\/user\/([^/]+)$/,
    handler: (req, res, params) => usersController.patch(req, res, params[0])
  },
  {
    method: 'GET',
    regex: /^\/api\/product\/([^/]+)$/,
    handler: (req, res, params) => productsController.getProductById(req, res, params[0])
  },
  {
    method: 'POST',
    regex: /^\/api\/product\/([^/]+)$/,
    handler: (req, res, params) => productsController.buy_check(req, res, params[0])
  },
  {
    method: 'DELETE',
    regex: /^\/api\/product\/([^/]+)$/,
    handler: (req, res, params) => productsController.remove(req, res, params[0])
  },
  {
    method: 'PATCH',
    regex: /^\/api\/product\/([^/]+)$/,
    handler: (req, res, params) => productsController.patch(req, res, params[0])
  }
];

function apiRouter(req, res) {
  const method = req.method;
  const url = req.url;

  if (staticRoutes[url]) {
    if (staticRoutesMethods[url].includes(method)) {
      return staticRoutes[url](req, res);
    }
  }

  for (const route of dynamicRoutes) {
    if (route.method === method) {
      const match = url.match(route.regex);
      if (match) {
        return route.handler(req, res, match.slice(1));
      }
    }
  }

  res.statusCode = 404;
  res.end('Not Found');
}

module.exports = apiRouter;
