import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    Button,
    Spinner,
    Alert,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import orderService from "../../services/orderService";
import Swal from 'sweetalert2';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrderById(id);
            setOrder(data.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
            setError("Failed to load order details");
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (newStatus === 'cancelled') {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You want to cancel this order? This action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, cancel it!'
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        setUpdating(true);
        try {
            await orderService.updateOrderStatus(id, newStatus);
            setOrder({ ...order, status: newStatus });
            Swal.fire('Updated!', `Order status changed to ${newStatus}`, 'success');
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const toggleStatusDropdown = () => setStatusDropdownOpen(!statusDropdownOpen);

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered": return "success";
            case "shipped": return "info";
            case "processing": return "warning";
            case "cancelled": return "danger";
            case "pending": return "primary";
            case "confirmed": return "primary";
            default: return "secondary";
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container className="mt--7" fluid>
                    <div className="text-center py-5">
                        <Spinner color="primary" />
                    </div>
                </Container>
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Header />
                <Container className="mt--7" fluid>
                    <Alert color="danger">{error || "Order not found"}</Alert>
                    <Button color="secondary" onClick={() => navigate("/admin/orders")}>Back to Orders</Button>
                </Container>
            </>
        );
    }

    let shippingAddress = {};
    let isAddressString = false;
    try {
        shippingAddress = order.shipping_address ? JSON.parse(order.shipping_address) : {};
        // logical check: if it's a number (which is valid JSON) or not an object, treat as string? 
        // actually if it parses, it might be a string if "string" was JSONified. But here "pune" is raw string.
        if (typeof shippingAddress === 'string') {
            // If JSON.parse returns a string (e.g. valid json string '"pune"'), OR if we want to handle non-object.
            // But the error was SyntaxError, so it wasn't valid JSON.
            // This catch block handles the raw string case.
            isAddressString = true;
            shippingAddress = order.shipping_address;
        }
    } catch (e) {
        // SyntaxError means it's a plain string (not JSON formatted)
        isAddressString = true;
        shippingAddress = order.shipping_address;
    }

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0" xl="8">
                        {/* Status Journey / Management */}
                        <Card className="shadow mb-4">
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Order Details - {order.order_number}</h3>
                                    </div>
                                    <div className="col text-right d-flex justify-content-end align-items-center gap-2">
                                        <Button color="info" size="sm" onClick={() => window.print()} className="mr-2 no-print">
                                            <i className="ni ni-cloud-download-95 mr-2" />
                                            Print Invoice
                                        </Button>
                                        <Dropdown isOpen={statusDropdownOpen} toggle={toggleStatusDropdown} className="no-print">
                                            <DropdownToggle caret color={getStatusColor(order.status)}>
                                                {updating ? <Spinner size="sm" /> : order.status}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => handleStatusUpdate('pending')}>Pending</DropdownItem>
                                                <DropdownItem onClick={() => handleStatusUpdate('confirmed')}>Confirmed</DropdownItem>
                                                <DropdownItem onClick={() => handleStatusUpdate('processing')}>Processing</DropdownItem>
                                                <DropdownItem onClick={() => handleStatusUpdate('shipped')}>Shipped</DropdownItem>
                                                <DropdownItem onClick={() => handleStatusUpdate('delivered')}>Delivered</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => handleStatusUpdate('cancelled')} className="text-danger">Cancelled</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <div className="d-flex justify-content-around position-relative no-print">
                                    {/* Simple Status Steps */}
                                    {['pending', 'confirmed', 'shipped', 'delivered'].map((step, index) => {
                                        const isCompleted = ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(order.status) >= index;
                                        return (
                                            <div key={step} className="text-center" style={{ zIndex: 2 }}>
                                                <div style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    background: isCompleted ? '#2dce89' : '#e9ecef',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 10px'
                                                }}>
                                                    {isCompleted ? <i className="fas fa-check" /> : (index + 1)}
                                                </div>
                                                <div className="text-xs font-weight-bold text-uppercase">{step}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Printable Invoice Header (Hidden on screen) */}
                                <div className="print-only mb-4">
                                    <Row className="mb-4">
                                        <Col xs="6">
                                            <h1 className="text-primary mb-0">BioProx Plant Care</h1>
                                            <p className="text-muted text-sm">
                                                Your Green Partner<br />
                                                pune, Maharashtra, India<br />
                                                Contact: +91 1234567890
                                            </p>
                                        </Col>
                                        <Col xs="6" className="text-right">
                                            <h2 className="mb-0">INVOICE</h2>
                                            <p className="text-muted text-sm">
                                                Invoice #: {order.order_number}<br />
                                                Date: {new Date(order.created_at).toLocaleDateString()}<br />
                                                Status: {order.status.toUpperCase()}
                                            </p>
                                        </Col>
                                    </Row>
                                    <hr />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Order Items */}
                        <Card className="shadow invoice-card">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Order Items</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Product</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Qty</th>
                                        <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <th scope="row">
                                                <div className="media align-items-center">
                                                    <div className="avatar rounded-circle mr-3 no-print">
                                                        <img
                                                            alt={item.product?.name || "Product"}
                                                            src={item.product?.image || require("assets/img/theme/bootstrap.jpg")}
                                                        />
                                                    </div>
                                                    <div className="media-body">
                                                        <span className="mb-0 text-sm">
                                                            {item.product?.name || "Product Deleted"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </th>
                                            <td>₹{parseFloat(item.price).toLocaleString()}</td>
                                            <td>{item.quantity}</td>
                                            <td>₹{parseFloat(item.total).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <CardBody className="border-top">
                                <Row className="justify-content-end text-right">
                                    <Col md="5">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Subtotal:</span>
                                            <span className="font-weight-bold">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Shipping:</span>
                                            <span>₹0.00</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between">
                                            <h4 className="mb-0">Total:</h4>
                                            <h4 className="mb-0 text-success">₹{parseFloat(order.total_amount).toLocaleString()}</h4>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xl="4">
                        {/* Customer Info */}
                        <Card className="shadow mb-4">
                            <CardHeader className="bg-transparent">
                                <h3 className="mb-0">Customer Details</h3>
                            </CardHeader>
                            <CardBody>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar avatar-sm rounded-circle bg-success mr-3 no-print">
                                        <i className="ni ni-single-02 text-white" />
                                    </div>
                                    <div>
                                        <h5 className="mb-0">{order.user ? order.user.name : 'Guest User'}</h5>
                                        <small className="text-muted">{order.user ? order.user.email : 'No email'}</small>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Addresses */}
                        <Card className="shadow mb-4">
                            <CardHeader className="bg-transparent">
                                <h3 className="mb-0">Shipping Address</h3>
                            </CardHeader>
                            <CardBody>
                                {isAddressString ? (
                                    <p className="text-sm mb-0">
                                        {shippingAddress || "No shipping address provided."}
                                    </p>
                                ) : shippingAddress.street || shippingAddress.city ? (
                                    <p className="text-sm mb-0">
                                        {shippingAddress.street || ''},<br />
                                        {shippingAddress.city || ''}, {shippingAddress.state || ''} {shippingAddress.zipCode ? `- ${shippingAddress.zipCode}` : ''}<br />
                                        {shippingAddress.country || ''}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted">No shipping address provided.</p>
                                )}
                            </CardBody>
                        </Card>

                        {/* Payment Info */}
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">Payment Info</h3>
                                <Badge color={order.payment_status === 'paid' ? 'success' : 'warning'}>{order.payment_status}</Badge>
                            </CardHeader>
                            <CardBody className="pt-0">
                                <div className="text-sm mb-3">
                                    <strong>Method:</strong> {order.payment_method}
                                </div>
                                {/* <Button color="success" size="sm" block outline>Download Receipt</Button> */}
                            </CardBody>
                        </Card>

                        <div className="mt-4 no-print">
                            <Button color="secondary" size="sm" block onClick={() => navigate("/admin/orders")}>
                                <i className="ni ni-bold-left mr-2" />
                                Back to Orders
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            <style>
                {`
                @media screen {
                    .print-only { display: none; }
                }
                @media print {
                    .no-print { display: none !important; }
                    .main-content { padding-top: 0 !important; }
                    .header { display: none !important; }
                    .navbar { display: none !important; }
                    .mt--7 { margin-top: 0 !important; }
                    .shadow { box-shadow: none !important; }
                    .card { border: none !important; }
                    .invoice-card { width: 100% !important; margin-top: 20px !important; }
                    body { background: white !important; }
                    .container-fluid { padding: 0 !important; }
                    .print-only { display: block !important; }
                    .invoice-card thead th { background-color: #f6f9fc !important; -webkit-print-color-adjust: exact; }
                }
                `}
            </style>
        </>
    );
};

export default OrderDetail;
