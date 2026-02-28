import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Table,
    Container,
    Row,
    Col,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Badge,
    Media,
} from "reactstrap";
import Swal from "sweetalert2";
import Header from "components/Headers/Header.js";
import testimonialService from "../../services/testimonialService";

const TestimonialList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [testimonials, setTestimonials] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        message: "",
        rating: 5,
        status: "Active",
        image: ""
    });

    const [imagePreview, setImagePreview] = useState(null);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const toggle = () => {
        setModal(!modal);
        if (!modal) {
            setFormData({
                name: "",
                designation: "",
                message: "",
                rating: 5,
                status: "Active",
                image: ""
            });
            setImagePreview(null);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await testimonialService.getAll();
            if (res.success) {
                setTestimonials(res.data);
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            Toast.fire({
                icon: 'error',
                title: 'Failed to load testimonials'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key] === true ? 1 : (formData[key] === false ? 0 : formData[key]));
                }
            });

            let res;
            if (formData.id) {
                data.append('_method', 'PUT');
                res = await testimonialService.update(formData.id, data);
            } else {
                res = await testimonialService.create(data);
            }

            if (res.success) {
                Toast.fire({
                    icon: 'success',
                    title: `Testimonial ${formData.id ? 'updated' : 'created'} successfully!`
                });
                fetchData();
                toggle();
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
            const errors = error.response?.data?.errors;
            if (errors) {
                // Handle both object of arrays (Laravel default) and flat array of strings
                const errorList = Array.isArray(errors) ? errors : Object.values(errors).flat();
                errorList.forEach((err, index) => {
                    setTimeout(() => {
                        Toast.fire({
                            icon: 'error',
                            title: err
                        });
                    }, index * 500);
                });
            } else {
                Toast.fire({
                    icon: 'error',
                    title: error.response?.data?.message || "Failed to save testimonial"
                });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            name: item.name,
            designation: item.designation || "",
            message: item.message || "",
            rating: item.rating || 5,
            status: item.status || "Active",
            image: item.image || ""
        });
        setImagePreview(item.image);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this testimonial?")) {
            try {
                const data = await testimonialService.delete(id);
                if (data.success) {
                    fetchData();
                }
            } catch (error) {
                console.error("Error deleting testimonial:", error);
                alert(error.message || "Failed to delete testimonial");
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
            try {
                const data = await testimonialService.updateStatus(id, newStatus);
                if (data.success) {
                    fetchData();
                }
            } catch (error) {
                console.error("Error updating status:", error);
                alert(error.message || "Failed to update status");
            }
        }
    };

    const filteredData = testimonials.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                        <h3 className="mb-0">Testimonials</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button color="info" onClick={toggle} size="sm">
                                            Add Testimonial
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md="4">
                                        <Input
                                            placeholder="Search testimonials..."
                                            type="text"
                                            className="form-control-alternative"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </CardHeader>

                            {loading ? (
                                <div className="text-center py-5">
                                    <span className="spinner-border spinner-border-lg text-primary" role="status" aria-hidden="true"></span>
                                    <p className="mt-2 text-muted">Loading testimonials...</p>
                                </div>
                            ) : (
                                <>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Designation</th>
                                                <th scope="col">Message</th>
                                                <th scope="col">Rating</th>
                                                <th scope="col">Status</th>
                                                <th scope="col" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.map((item) => (
                                                <tr key={item.id}>
                                                    <th scope="row">
                                                        <Media className="align-items-center">
                                                            <a className="avatar rounded-circle mr-3" href="#pablo" onClick={e => e.preventDefault()}>
                                                                <img
                                                                    alt={item.name}
                                                                    src={item.image || require("assets/img/theme/bootstrap.jpg")}
                                                                />
                                                            </a>
                                                            <Media body>
                                                                <span className="mb-0 text-sm font-weight-bold">
                                                                    {item.name}
                                                                </span>
                                                            </Media>
                                                        </Media>
                                                    </th>
                                                    <td>{item.designation}</td>
                                                    <td>
                                                        <div style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {item.message}
                                                        </div>
                                                    </td>
                                                    <td>{item.rating} / 5</td>
                                                    <td>
                                                        <Badge color="" className="badge-dot mr-4">
                                                            <i className={item.status === "Active" ? "bg-success" : "bg-warning"} />
                                                            {item.status}
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
                                                                <DropdownItem onClick={() => handleEdit(item)}>
                                                                    Edit
                                                                </DropdownItem>
                                                                <DropdownItem onClick={() => handleDelete(item.id)}>
                                                                    Delete
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredData.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        No testimonials found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </Card>
                    </div>
                </Row>
            </Container>

            {/* Add Testimonial Modal */}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{formData.id ? 'Edit Testimonial' : 'Add Testimonial'}</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="name">Name <span className="text-danger">*</span></Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="Author Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="designation">Designation / Company</Label>
                                    <Input
                                        type="text"
                                        id="designation"
                                        placeholder="e.g. CEO, Company"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label for="message">Message <span className="text-danger">*</span></Label>
                            <Input
                                type="textarea"
                                id="message"
                                rows="4"
                                placeholder="Testimonial content"
                                value={formData.message}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="rating">Rating (1 to 5)</Label>
                                    <Input
                                        type="number"
                                        id="rating"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="status">Status</Label>
                                    <Input
                                        type="select"
                                        id="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label for="image">Author Image</Label>
                            <Input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            {imagePreview && (
                                <div className="mt-2 text-center">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover', width: '100px', height: '100px', border: '1px solid #ddd' }}
                                    />
                                </div>
                            )}
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="info" onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : "Save"}
                    </Button>
                    <Button color="secondary" onClick={toggle} disabled={saving}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default TestimonialList;
