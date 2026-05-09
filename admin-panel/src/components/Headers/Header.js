import { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import dashboardService from "services/dashboardService";

const Header = ({ showCards = false }) => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_categories: 0,
    total_blogs: 0,
    total_testimonials: 0,
    total_orders: 0
  });

  useEffect(() => {
    if (showCards) {
      const fetchStats = async () => {
        try {
          const res = await dashboardService.getStats();
          if (res.success) {
            setStats(res.data);
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }
      };
      fetchStats();
    }
  }, [showCards]);

  return (
    <>
      <div className={showCards ? "header bg-gradient-success pb-8 pt-5 pt-md-8" : "header bg-gradient-success pb-6 pt-5 pt-md-8"}>
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            {showCards && (
              <Row>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Products
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {stats.total_products}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-chart-bar" />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          Total items
                        </span>{" "}
                        <span className="text-nowrap">in catalog</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Categories
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {stats.total_categories}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i className="fas fa-chart-pie" />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          Product
                        </span>{" "}
                        <span className="text-nowrap">categories</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Blogs
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {stats.total_blogs}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                            <i className="fas fa-edit" />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-warning mr-2">
                          Published
                        </span>{" "}
                        <span className="text-nowrap">articles</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Testimonials
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {stats.total_testimonials}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fas fa-comment" />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          Customer
                        </span>{" "}
                        <span className="text-nowrap">reviews</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
