const Command = require('../command/Command');

const productController = require('../controllers/productController');
const presentController = require('../controllers/presentController');
const interactController = require('../controllers/interactController');
const balanceController = require('../controllers/balanceController');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const middlewareG = require('../middleware/globalMW')

function routeWithMW(handler, localMW = [], localAW = []) {
  const globalMW = [middlewareG.loggingMW];
  const globalAW = [middlewareG.loggingAW];

  return new Command(handler, [...globalMW, ...localMW], [...globalAW, ...localAW]);
}

const staticRoutes = [
  {
    method: 'POST',
    regexp: /^\/api\/login$/,
    command: routeWithMW(authController.login)
  },
  {
    method: 'POST',
    regexp: /^\/api\/registration$/,
    command: routeWithMW(authController.registration)
  },
  {
    method: 'PATCH',
    regexp: /^\/api\/balance$/,
    command: routeWithMW(balanceController.balance)
  },
  {
    method: 'GET',
    regexp: /^\/api\/main$/,
    command: routeWithMW(presentController.getAllProducts)
  },
  {
    method: 'POST',
    regexp: /^\/api\/create$/,
    command: routeWithMW(productController.create)
  }
];

const dynamicRoutes = [
  {
    method: 'GET',
    regexp: /^\/api\/user\/([^/]+)$/,
    command: routeWithMW(profileController.getProfile)
  },
  {
    method: 'PATCH',
    regexp: /^\/api\/user\/([^/]+)$/,
    command: routeWithMW(profileController.patch)
  },
  {
    method: 'GET',
    regexp: /^\/api\/product\/([^/]+)$/,
    command: routeWithMW(presentController.getProductById)
  },
  {
    method: 'POST',
    regexp: /^\/api\/product\/([^/]+)$/,
    command: routeWithMW(interactController.buy_check)
  },
  {
    method: 'DELETE',
    regexp: /^\/api\/product\/([^/]+)$/,
    command: routeWithMW(productController.remove)
  },
  {
    method: 'PATCH',
    regexp: /^\/api\/product\/([^/]+)$/,
    command: routeWithMW(productController.patch)
  }
];

const allRoutes = [...staticRoutes, ...dynamicRoutes];

function apiRouter(req, res) {
  const method = req.method;
  const url = req.url;
    
  for (const { method: routeMethod, regexp, command } of allRoutes) {
    if (routeMethod === method) {
      const match = url.match(regexp);
      if (match) {
        return command.execute(req, res, match.slice(1));
      }
    }
  }

  res.statusCode = 404;
  res.end('Not Found');
}

module.exports = apiRouter;
