import React from "react";
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    Table,
    Badge,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

const RevenueDashboard = () => {
    const salesHistory = [
        { id: "ORD-001", customer: "John Doe", date: "2024-02-14", amount: 1540, status: "Completed" },
        { id: "ORD-002", customer: "Jane Smith", date: "2024-02-13", amount: 2200, status: "Pending" },
        { id: "ORD-003", customer: "Mike Johnson", date: "2024-02-13", amount: 850, status: "Completed" },
        { id: "ORD-004", customer: "Sarah Williams", date: "2024-02-12", amount: 3100, status: "Cancelled" },
        { id: "ORD-005", customer: "Robert Brown", date: "2024-02-11", amount: 450, status: "Completed" },
    ];

    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0" xl="8">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h6 className="text-uppercase text-light ls-1 mb-1">
                                            Overview
                                        </h6>
                                        <h2 className="mb-0">Sales Value</h2>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {/* Chart wrapper */}
                                <div className="chart" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fe', borderRadius: '5px' }}>
                                    <div className="text-muted">Sales Chart Visualization (Chart.js Placeholder)</div>
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
                                        <h2 className="mb-0">Total Orders</h2>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {/* Chart wrapper */}
                                <div className="chart" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fe', borderRadius: '5px' }}>
                                    <div className="text-muted">Orders Chart Visualization Placeholder</div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0" xl="12">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Recent Transactions</h3>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesHistory.map((sale) => (
                                        <tr key={sale.id}>
                                            <th scope="row">{sale.id}</th>
                                            <td>{sale.customer}</td>
                                            <td>{sale.date}</td>
                                            <td>₹{sale.amount.toLocaleString()}</td>
                                            <td>
                                                <Badge color="" className="badge-dot mr-4">
                                                    <i className={
                                                        sale.status === "Completed" ? "bg-success" :
                                                            sale.status === "Pending" ? "bg-warning" : "bg-danger"
                                                    } />
                                                    {sale.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RevenueDashboard;
