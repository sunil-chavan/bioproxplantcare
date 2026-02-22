import React from "react";
import {
    Card,
    CardHeader,
    Table,
    Container,
    Row,
    Col,
    CardBody,
    CardTitle,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const ReportList = () => {
    const reports = [
        { id: 1, type: "Sales Report", date: "2024-02-14", status: "Completed", amount: "₹15,400" },
        { id: 2, type: "Inventory Report", date: "2024-02-13", status: "Pending", amount: "-" },
        { id: 3, type: "Customer Growth", date: "2024-02-12", status: "Completed", amount: "150 New Users" },
        { id: 4, type: "Product Performance", date: "2024-02-11", status: "Completed", amount: "Top: Snake Plant" },
    ];

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0 border-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">Total Sales</CardTitle>
                                        <span className="h2 font-weight-bold mb-0">₹45,230</span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="fas fa-chart-bar" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0 border-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">New Users</CardTitle>
                                        <span className="h2 font-weight-bold mb-0">2,356</span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                            <i className="fas fa-chart-pie" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0 border-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">Orders</CardTitle>
                                        <span className="h2 font-weight-bold mb-0">924</span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                            <i className="fas fa-users" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0 border-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">Performance</CardTitle>
                                        <span className="h2 font-weight-bold mb-0">49,65%</span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                            <i className="fas fa-percent" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Recent Reports</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Report Type</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Result/Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <th scope="row">{report.type}</th>
                                            <td>{report.date}</td>
                                            <td>{report.status}</td>
                                            <td>{report.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default ReportList;
