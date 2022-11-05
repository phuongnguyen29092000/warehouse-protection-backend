const express = require("express");

const userRoute = require("./user.route");
const categoryRoute = require("./category.route");
const subCategoryRoute = require("./subcategory.route");
const productRote = require('./product.route')
const authRoute = require('./auth.route')

const router = express.Router();

const defaultRoutes = [
  // {
  //   path: "/admin",
  //   route: '',
  // },
  {
    path: "/product",
    route: productRote,
  },
  {
    path: "/user",
    route: userRoute,
  },
  // {
  //   path: "/order-detail",
  //   route: '',
  // },
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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
