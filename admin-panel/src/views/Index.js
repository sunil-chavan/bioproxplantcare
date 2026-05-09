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
import { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import dashboardService from "services/dashboardService";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getStats();
        if (res.success) {
           setDashboardData(res.data);
        }
      } catch (err) {
         console.error(err);
      }
    };
    fetchData();
  }, []);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  return (
    <>
      <Header showCards={true} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={{
                      labels: dashboardData?.chart_labels || ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
                      datasets: [
                        {
                          label: "Sales",
                          data: dashboardData?.sales_data || [0, 0, 0, 0, 0, 0],
                        },
                      ],
                    }}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={{
                      labels: dashboardData?.chart_labels || ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                      datasets: [
                        {
                          label: "Orders",
                          data: dashboardData?.orders_data || [0, 0, 0, 0, 0, 0],
                          maxBarThickness: 10,
                        },
                      ],
                    }}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Recent Orders</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="/admin/orders"
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Order #</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recent_orders?.map((order, idx) => (
                    <tr key={idx}>
                      <th scope="row">{order.order_number}</th>
                      <td>{order.customer_name}</td>
                      <td>${order.net_amount}</td>
                      <td>
                        <span className="badge badge-dot mr-4">
                          <i className={order.status === 'completed' || order.status === 'delivered' ? 'bg-success' : 'bg-warning'} />
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!dashboardData?.recent_orders || dashboardData.recent_orders.length === 0) && (
                    <tr>
                      <td colSpan="4" className="text-center">No recent orders</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Top Selling Products</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="/admin/products"
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Product Name</th>
                    <th scope="col">Sales</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.top_products?.map((product, idx) => (
                    <tr key={idx}>
                      <th scope="row">{product.name}</th>
                      <td>{product.sales}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">{Math.min(product.sales, 100)}%</span>
                          <div>
                            <Progress
                              max="100"
                              value={Math.min(product.sales, 100)}
                              barClassName="bg-gradient-success"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!dashboardData?.top_products || dashboardData.top_products.length === 0) && (
                    <tr>
                      <td colSpan="3" className="text-center">No products sold yet</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
