const express = require("express");

const userRoute = require("./user.route");
const categoryRoute = require("./category.route");
const subCategoryRoute = require("./subcategory.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin",
    route: typePlaceRoute,
  },
  {
    path: "/product",
    route: tourRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/order-detail",
    route: ticketRoute,
  },
  {
    path: "/provider",
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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
