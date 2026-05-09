import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// reactstrap components
import {
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Row,
    Col,
    Badge,
    Input,
    Spinner,
    Alert,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import orderService from "../../services/orderService";

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderService.getAllOrders();
            console.log("getAllOrders--->", response)
            // Handle both paginated and non-paginated responses
            let orderData = [];
            if (Array.isArray(response.data)) {
                orderData = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                orderData = response.data.data;
                setTotalPages(response.data.last_page || 1);
            }

            setOrders(orderData);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError("Failed to load orders");
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered": return "success";
            case "shipped": return "info";
            case "processing": return "warning";
            case "cancelled": return "danger";
            case "pending": return "primary";
            default: return "secondary";
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Implement debounced search here if backend supports it, 
        // or filter locally if dataset is small. For now filtering locally.
    };

    const filteredOrders = orders.filter((order) =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">All Orders</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Input
                                            placeholder="Search Order ID or Customer..."
                                            type="text"
                                            className="form-control-alternative"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </Col>
                                </Row>
                            </CardHeader>
                            {error && <Alert color="danger" className="m-3">{error}</Alert>}

                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Total Amount</th>
                                        <th scope="col">Payment</th>
                                        <th scope="col">Order Status</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5">
                                                <Spinner color="primary" />
                                            </td>
                                        </tr>
                                    ) : filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                No orders found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id}>
                                                <th scope="row">
                                                    <span className="mb-0 text-sm font-weight-bold">
                                                        {order.order_number}
                                                    </span>
                                                </th>
                                                <td>{order.user ? order.user.name : 'Unknown User'}</td>
                                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td>₹{parseFloat(order.total_amount).toLocaleString()}</td>
                                                <td>
                                                    <Badge color={order.payment_status === "paid" ? "success" : "warning"} pill>
                                                        {order.payment_status}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge color={getStatusColor(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td className="text-right">
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle
                                                            className="btn-icon-only text-light"
                                                            role="button"
                                                            size="sm"
                                                        >
                                                            <i className="fas fa-ellipsis-v" />
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                                            <DropdownItem onClick={() => navigate(`/admin/order-details/${order.id}`)}>
                                                                <i className="fas fa-eye text-primary mr-2" /> View Details
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                            <CardFooter className="py-4">
                                <nav aria-label="...">
                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        <PaginationItem className={currentPage === 1 ? "disabled" : ""}>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                                tabIndex="-1"
                                            >
                                                <i className="fas fa-angle-left" />
                                                <span className="sr-only">Previous</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <PaginationItem key={i} className={currentPage === i + 1 ? "active" : ""}>
                                                <PaginationLink
                                                    href="#pablo"
                                                    onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem className={currentPage === totalPages ? "disabled" : ""}>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                            >
                                                <i className="fas fa-angle-right" />
                                                <span className="sr-only">Next</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                </nav>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default OrderList;
