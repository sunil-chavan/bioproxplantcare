/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Login from "views/examples/Login.js";
import CategoryList from "pages/categories/CategoryList";
import ProductList from "pages/products/ProductList";
import ReportList from "pages/reports/ReportList";
import TestimonialList from "pages/testimonials/TestimonialList";
import BlogList from "pages/blogs/BlogList";
import RevenueDashboard from "pages/revenue/RevenueDashboard";
import SliderList from "pages/sliders/SliderList";
import SettingsPage from "pages/settings/SettingsPage";
import OrderList from "pages/orders/OrderList";
import OrderDetail from "pages/orders/OrderDetail";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/revenue",
    name: "Revenue",
    icon: "ni ni-money-coins text-success",
    component: <RevenueDashboard />,
    layout: "/admin",
  },
  {
    path: "/categories",
    name: "Categories",
    icon: "ni ni-bullet-list-67 text-success",
    component: <CategoryList />,
    layout: "/admin",
  },
  {
    path: "/products",
    name: "Products",
    icon: "ni ni-bag-17 text-info",
    component: <ProductList />,
    layout: "/admin",
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "ni ni-delivery-fast text-danger",
    component: <OrderList />,
    layout: "/admin",
  },
  {
    path: "/order-details/:id",
    name: "Order Details",
    icon: "ni ni-bullet-list-67 text-muted",
    component: <OrderDetail />,
    layout: "/admin",
    invisible: true, // Custom flag to hide from sidebar if sidebar logic supports it
  },
  {
    path: "/sliders",
    name: "Sliders",
    icon: "ni ni-image text-warning",
    component: <SliderList />,
    layout: "/admin",
  },
  {
    path: "/blogs",
    name: "Blogs",
    icon: "ni ni-align-left-2 text-primary",
    component: <BlogList />,
    layout: "/admin",
  },
  {
    path: "/testimonials",
    name: "Testimonials",
    icon: "ni ni-chat-round text-primary",
    component: <TestimonialList />,
    layout: "/admin",
  },
  {
    path: "/reports",
    name: "Reports",
    icon: "ni ni-chart-bar-32 text-warning",
    component: <ReportList />,
    layout: "/admin",
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "ni ni-settings-gear-65 text-info",
    component: <SettingsPage />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
];
export default routes;
