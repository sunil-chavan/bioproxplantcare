import React, { useState, useEffect } from "react";
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
    Spinner
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import api from "../../services/axios";
import Swal from 'sweetalert2';

const SliderList = () => {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        link: '',
        order: 0,
        status: true,
        image: null
    });

    const toggle = () => {
        if (modal) {
            setEditingId(null);
            setFormData({
                title: '',
                subtitle: '',
                link: '',
                order: 0,
                status: true,
                image: null
            });
        }
        setModal(!modal);
    };

    const fetchSliders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/sliders');
            setSliders(response.data.data);
        } catch (error) {
            console.error("Error fetching sliders:", error);
            Swal.fire('Error', 'Failed to load sliders', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (name === 'status' ? checked : value) : value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleEdit = (slider) => {
        setEditingId(slider.id);
        setFormData({
            title: slider.title,
            subtitle: slider.subtitle || '',
            link: slider.link || '',
            order: slider.order || 0,
            status: Boolean(slider.status),
            image: null // Keep null unless changing
        });
        setModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('link', formData.link);
        data.append('order', formData.order);
        data.append('status', formData.status ? 1 : 0);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (editingId) {
                // Laravel requirement: when sending images in PUT, we often use POST with _method=PUT
                // Or just use POST if the controller handles it, but here api.put might work if not using multipart/form-data
                // For multipart + PUT, it's safer to use this:
                const putData = new FormData();
                putData.append('_method', 'PUT');
                putData.append('title', formData.title);
                putData.append('subtitle', formData.subtitle);
                putData.append('link', formData.link);
                putData.append('order', formData.order);
                putData.append('status', formData.status ? 1 : 0);
                if (formData.image) {
                    putData.append('image', formData.image);
                }

                await api.post(`/admin/sliders/${editingId}`, putData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('Updated', 'Slider updated successfully', 'success');
            } else {
                await api.post('/admin/sliders', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('Created', 'Slider created successfully', 'success');
            }
            toggle();
            fetchSliders();
        } catch (error) {
            console.error("Error saving slider:", error);
            const msg = error.response?.data?.message || 'Failed to save slider';
            Swal.fire('Error', msg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/sliders/${id}`);
                Swal.fire('Deleted!', 'Slider has been deleted.', 'success');
                fetchSliders();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete slider', 'error');
            }
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
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5">
                                                <Spinner color="primary" />
                                            </td>
                                        </tr>
                                    ) : sliders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">No sliders found</td>
                                        </tr>
                                    ) : sliders.map((slider) => (
                                        <tr key={slider.id}>
                                            <td>
                                                <img src={slider.image} alt={slider.title} style={{ width: '100px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                            </td>
                                            <td>
                                                <span className="mb-0 text-sm font-weight-bold">{slider.title}</span>
                                                <br />
                                                <small className="text-muted">{slider.subtitle}</small>
                                            </td>
                                            <td>{slider.link}</td>
                                            <td>{slider.order}</td>
                                            <td>
                                                <Badge color={slider.status ? "success" : "danger"} pill>
                                                    {slider.status ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="text-right">
                                                <Button color="link" size="sm" className="text-info" onClick={() => handleEdit(slider)}>Edit</Button>
                                                <Button color="link" size="sm" className="text-danger" onClick={() => handleDelete(slider.id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                </Row>
            </Container>

            {/* Add/Edit Slider Modal */}
            <Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>{editingId ? 'Edit Slider' : 'Add New Slider'}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="title">Slider Title</Label>
                                    <Input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Main heading"
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="subtitle">Subtitle</Label>
                                    <Input
                                        type="text"
                                        name="subtitle"
                                        id="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        placeholder="Small sub-heading"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="link">Redirect Link</Label>
                                    <Input
                                        type="text"
                                        name="link"
                                        id="link"
                                        value={formData.link}
                                        onChange={handleInputChange}
                                        placeholder="/shop or https://..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="order">Display Order</Label>
                                    <Input
                                        type="number"
                                        name="order"
                                        id="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label for="image">Slider Image {editingId && '(Leave blank to keep current)'}</Label>
                            <Input
                                type="file"
                                name="image"
                                id="image"
                                onChange={handleFileChange}
                                accept="image/*"
                                required={!editingId}
                            />
                        </FormGroup>
                        <FormGroup check className="mb-3">
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleInputChange}
                                />{' '}
                                Active Status
                            </Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save Slider'}
                    </Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default SliderList;
