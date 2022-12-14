const express = require("express");

const userRoute = require("./user.route");
const categoryRoute = require("./category.route");
const subCategoryRoute = require("./subcategory.route");
const productRote = require('./product.route')
const authRoute = require('./auth.route')
const orderRoute = require('./order.route')
const adminRoute = require('./admin.route')
const feedbackRoute  = require('./feedback.route')
const cartRoute  = require('./cart.route')
const router = express.Router();

const defaultRoutes = [
  {
    path: "/product",
    route: productRote,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/order",
    route: orderRoute,
  },
  {
    path: "/feedback",
    route: feedbackRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/sub-category",
    route: subCategoryRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/cart",
    route: cartRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
