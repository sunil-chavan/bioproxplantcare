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
import blogService from "../../services/blogService";

const BlogList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author_name: "",
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
                title: "",
                content: "",
                author_name: "",
                status: "Active",
                image: ""
            });
            setImagePreview(null);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await blogService.getAll();
            if (res.success) {
                setBlogs(res.data);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            Toast.fire({
                icon: 'error',
                title: 'Failed to load blogs'
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
                res = await blogService.update(formData.id, data);
            } else {
                res = await blogService.create(data);
            }

            if (res.success) {
                Toast.fire({
                    icon: 'success',
                    title: `Blog ${formData.id ? 'updated' : 'created'} successfully!`
                });
                fetchData();
                toggle();
            }
        } catch (error) {
            console.error("Error saving blog:", error);
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
                    title: error.response?.data?.message || "Failed to save blog"
                });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            title: item.title,
            content: item.content || "",
            author_name: item.author_name || "",
            status: item.status || "Active",
            image: item.image || ""
        });
        setImagePreview(item.image);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const data = await blogService.delete(id);
                if (data.success) {
                    fetchData();
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
                alert(error.message || "Failed to delete blog");
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
            try {
                const data = await blogService.updateStatus(id, newStatus);
                if (data.success) {
                    fetchData();
                }
            } catch (error) {
                console.error("Error updating status:", error);
                alert(error.message || "Failed to update status");
            }
        }
    };

    const filteredData = blogs.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                                        <h3 className="mb-0">Blogs</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button color="info" onClick={toggle} size="sm">
                                            Add Blog
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md="4">
                                        <Input
                                            placeholder="Search blogs..."
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
                                    <p className="mt-2 text-muted">Loading blogs...</p>
                                </div>
                            ) : (
                                <>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Title</th>
                                                <th scope="col">Author</th>
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
                                                                    alt={item.title}
                                                                    src={item.image || require("assets/img/theme/bootstrap.jpg")}
                                                                />
                                                            </a>
                                                            <Media body>
                                                                <span className="mb-0 text-sm font-weight-bold">
                                                                    {item.title}
                                                                </span>
                                                            </Media>
                                                        </Media>
                                                    </th>
                                                    <td>{item.author_name || "Admin"}</td>
                                                    <td>
                                                        <Badge color="" className="badge-dot mr-4">
                                                            <i className={item.status === "Active" ? "bg-success" : (item.status === 'Draft' ? 'bg-secondary' : "bg-warning")} />
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
                                                    <td colSpan="4" className="text-center py-4">
                                                        No blogs found
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

            {/* Add Blog Modal */}
            <Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>{formData.id ? 'Edit Blog' : 'Add Blog'}</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="title">Title <span className="text-danger">*</span></Label>
                                    <Input
                                        type="text"
                                        id="title"
                                        placeholder="Blog Title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="author_name">Author Name</Label>
                                    <Input
                                        type="text"
                                        id="author_name"
                                        placeholder="Author Name"
                                        value={formData.author_name}
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
                                        <option value="Draft">Draft</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label for="content">Content <span className="text-danger">*</span></Label>
                            <Input
                                type="textarea"
                                id="content"
                                rows="8"
                                placeholder="Blog content..."
                                value={formData.content}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="image">Featured Image</Label>
                            <Input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', border: '1px solid #ddd' }}
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

export default BlogList;
