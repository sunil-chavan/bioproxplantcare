import React from "react";
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
    Button,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

const SettingsPage = () => {
    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-1" xl="8">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Website Settings</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button
                                            color="success"
                                            onClick={(e) => e.preventDefault()}
                                            size="sm"
                                        >
                                            Save All
                                        </Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <h6 className="heading-small text-muted mb-4">
                                        Store Information
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <Label className="form-control-label" for="storeName">
                                                        Store Name
                                                    </Label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        defaultValue="bioProx Plant Care"
                                                        id="storeName"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <Label className="form-control-label" for="storeEmail">
                                                        Store Email
                                                    </Label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        defaultValue="contact@bioprox.com"
                                                        id="storeEmail"
                                                        type="email"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <FormGroup>
                                                    <Label className="form-control-label" for="storeAddress">
                                                        Store Address
                                                    </Label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        defaultValue="123 Green Lane, Nursery District, India"
                                                        id="storeAddress"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                    <h6 className="heading-small text-muted mb-4">
                                        Social & Contact Links
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label className="form-control-label" for="instagram">
                                                        Instagram URL
                                                    </Label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        defaultValue="https://instagram.com/bioprox"
                                                        id="instagram"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label className="form-control-label" for="facebook">
                                                        Facebook URL
                                                    </Label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        defaultValue="https://facebook.com/bioprox"
                                                        id="facebook"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                    <h6 className="heading-small text-muted mb-4">
                                        E-commerce Configurations
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <Label className="form-control-label" for="currency">
                                                        Currency Symbol
                                                    </Label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        defaultValue="₹"
                                                        id="currency"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <Label className="form-control-label" for="tax">
                                                        Tax Rate (%)
                                                    </Label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        defaultValue="18"
                                                        id="tax"
                                                        type="number"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <Label className="form-control-label" for="shipping">
                                                        Flat Shipping Charge (₹)
                                                    </Label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        defaultValue="50"
                                                        id="shipping"
                                                        type="number"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="4">
                        <Card className="shadow">
                            <CardHeader className="bg-white border-0">
                                <h3 className="mb-0">Theme Branding</h3>
                            </CardHeader>
                            <CardBody className="text-center">
                                <div className="avatar avatar-xl rounded-circle shadow mb-4" style={{ width: '100px', height: '100px', margin: '0 auto', background: '#f8f9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img alt="..." src={require("../../assets/img/bioproxlogo.jpeg")} style={{ maxWidth: '80%' }} />
                                </div>
                                <h4>Brand Logo</h4>
                                <Button color="success" size="sm" className="mt-3">Change Logo</Button>
                                <hr className="my-4" />
                                <h5>Primary Brand Color</h5>
                                <div style={{ width: '50px', height: '50px', background: '#006432', margin: '15px auto', borderRadius: '50%', border: '2px solid #eee' }}></div>
                                <p className="text-muted small">#006432 (bioProx Green)</p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

const Label = ({ children, className, for: id }) => (
    <label className={className} htmlFor={id}>
        {children}
    </label>
);

export default SettingsPage;
