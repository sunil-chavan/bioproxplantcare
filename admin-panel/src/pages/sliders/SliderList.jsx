import React, { useState } from "react";
// reactstrap components
import {
    Card,
    CardHeader,
    Table,
    Container,
    Row,
    Col,
    Button,
    Badge,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

const SliderList = () => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const sliders = [
        { id: 1, title: "Summer Plant Sale", subtitle: "Up to 50% Off", link: "/shop", order: 1, status: "Active", image: "https://via.placeholder.com/150x50" },
        { id: 2, title: "New Indoor Collection", subtitle: "Breathe Fresh Air", link: "/categories/indoor", order: 2, status: "Active", image: "https://via.placeholder.com/150x50" },
        { id: 3, title: "Organic Fertilizers", subtitle: "Nutrients for your garden", link: "/products/neem-fertilizer", order: 3, status: "Inactive", image: "https://via.placeholder.com/150x50" },
    ];

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
                                        <h3 className="mb-0">Website Sliders</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button color="success" onClick={toggle} size="sm">
                                            Add Slider
                                        </Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Preview</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Link</th>
                                        <th scope="col">Order</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sliders.map((slider) => (
                                        <tr key={slider.id}>
                                            <td>
                                                <img src={slider.image} alt={slider.title} style={{ width: '100px', borderRadius: '4px' }} />
                                            </td>
                                            <td>
                                                <span className="mb-0 text-sm font-weight-bold">{slider.title}</span>
                                                <br />
                                                <small className="text-muted">{slider.subtitle}</small>
                                            </td>
                                            <td>{slider.link}</td>
                                            <td>{slider.order}</td>
                                            <td>
                                                <Badge color={slider.status === "Active" ? "success" : "danger"} pill>
                                                    {slider.status}
                                                </Badge>
                                            </td>
                                            <td className="text-right">
                                                <Button color="link" size="sm" className="text-info">Edit</Button>
                                                <Button color="link" size="sm" className="text-danger">Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                </Row>
            </Container>

            {/* Add Slider Modal */}
            <Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>Add New Slider</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="sliderTitle">Slider Title</Label>
                                    <Input type="text" id="sliderTitle" placeholder="Main heading" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="sliderSubtitle">Subtitle</Label>
                                    <Input type="text" id="sliderSubtitle" placeholder="Small sub-heading" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="sliderLink">Redirect Link</Label>
                                    <Input type="text" id="sliderLink" placeholder="/shop or https://..." />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="sliderOrder">Display Order</Label>
                                    <Input type="number" id="sliderOrder" placeholder="1" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label for="sliderImage">Image URL</Label>
                            <Input type="text" id="sliderImage" placeholder="https://example.com/banner.jpg" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="sliderStatus">Status</Label>
                            <Input type="select" id="sliderStatus">
                                <option>Active</option>
                                <option>Inactive</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={toggle}>Save Slider</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default SliderList;
