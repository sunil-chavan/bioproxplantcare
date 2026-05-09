import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import Swal from "sweetalert2";
import Header from "components/Headers/Header.js";
import categoryService from "../../services/categoryService";

const CategoryList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        status: "Active",
        isFeatured: false,
        image: "",
        description: ""
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
        if (!modal) { // If modal is closing, reset form data
            setFormData({
                name: "",
                slug: "",
                status: "Active",
                isFeatured: false,
                image: "",
                description: ""
            });
            setImagePreview(null);
        }
    };

    const fetchCategories = async (page = 1) => {
        try {
            setLoading(true);
            const data = await categoryService.getAll({ page });
            if (data.success) {
                if (data.data.data) {
                    setCategories(data.data.data);
                    setPagination({
                        current_page: data.data.current_page || 1,
                        last_page: data.data.last_page || 1,
                        per_page: data.data.per_page || 10,
                        total: data.data.total || 0
                    });
                } else {
                    setCategories(data.data);
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            Toast.fire({
                icon: 'error',
                title: 'Failed to load categories'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchCategories(newPage);
        }
    };

    useEffect(() => {
        fetchCategories();
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
                data.append(key, formData[key] === true ? 1 : (formData[key] === false ? 0 : formData[key]));
            });

            let res;
            if (formData.id) {
                data.append('_method', 'PUT');
                res = await categoryService.update(formData.id, data);
            } else {
                res = await categoryService.create(data);
            }

            if (res.success) {
                Toast.fire({
                    icon: 'success',
                    title: `Category ${formData.id ? 'updated' : 'created'} successfully!`
                });
                fetchCategories(pagination.current_page);
                toggle();
            }
        } catch (error) {
            console.error("Error saving category:", error);
            const errors = error.response?.data?.errors;
            if (errors) {
                // Show each validation error one by one
                Object.values(errors).forEach((errArr, index) => {
                    setTimeout(() => {
                        Toast.fire({
                            icon: 'error',
                            title: errArr[0]
                        });
                    }, index * 500);
                });
            } else {
                const message = error.response?.data?.message || "Failed to save category";
                Toast.fire({
                    icon: 'error',
                    title: message
                });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category) => {
        setFormData({
            id: category.id,
            name: category.name,
            slug: category.slug,
            status: category.status,
            isFeatured: category.is_featured,
            description: category.description,
            image: category.image
        });
        setImagePreview(category.image);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                const data = await categoryService.delete(id);
                if (data.success) {
                    fetchCategories(pagination.current_page);
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                alert(error.message || "Failed to delete category");
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
            try {
                const data = await categoryService.updateStatus(id, newStatus);
                if (data.success) {
                    fetchCategories(pagination.current_page);
                }
            } catch (error) {
                console.error("Error updating category status:", error);
                alert(error.message || "Failed to update category status");
            }
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                                        <h3 className="mb-0">Categories</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button color="primary" onClick={toggle} size="sm">
                                            <i className="fas fa-plus mr-2" /> Add Category
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md="4">
                                        <Input
                                            placeholder="Search categories..."
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
                                    <p className="mt-2 text-muted">Loading categories...</p>
                                </div>
                            ) : (
                                <>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Image</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Featured</th>
                                                <th scope="col" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCategories.map((category, index) => (
                                                <tr key={category.id}>
                                                    <td>{(pagination.current_page - 1) * pagination.per_page + index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }}
                                                        />
                                                    </td>
                                                    <th scope="row">
                                                        <span className="mb-0 text-sm font-weight-bold">
                                                            {category.name}
                                                        </span>
                                                    </th>
                                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {category.description}
                                                    </td>
                                                    <td>
                                                        <Badge
                                                            color={category.status === "Active" ? "success" : "danger"}
                                                            pill
                                                        >
                                                            {category.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        {category.isFeatured ? (
                                                            <Badge color="info" pill>Featured</Badge>
                                                        ) : (
                                                            <span className="text-muted text-xs">No</span>
                                                        )}
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
                                                                <DropdownItem onClick={() => handleEdit(category)}>
                                                                    <i className="fas fa-edit text-info mr-2" /> Edit
                                                                </DropdownItem>
                                                                <DropdownItem onClick={() => handleDelete(category.id)}>
                                                                    <i className="fas fa-trash text-danger mr-2" /> Delete
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredCategories.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4">
                                                        No categories found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>

                                    <CardFooter className="py-4">
                                        <nav aria-label="...">
                                            <Pagination
                                                className="pagination justify-content-end mb-0"
                                                listClassName="justify-content-end mb-0"
                                            >
                                                <PaginationItem disabled={pagination.current_page <= 1}>
                                                    <PaginationLink
                                                        href="#pablo"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(pagination.current_page - 1); }}
                                                        tabIndex="-1"
                                                    >
                                                        <i className="fas fa-angle-left" />
                                                        <span className="sr-only">Previous</span>
                                                    </PaginationLink>
                                                </PaginationItem>

                                                {[...Array(pagination.last_page)].map((_, i) => (
                                                    <PaginationItem active={i + 1 === pagination.current_page} key={i}>
                                                        <PaginationLink
                                                            href="#pablo"
                                                            onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                                        >
                                                            {i + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}

                                                <PaginationItem disabled={pagination.current_page >= pagination.last_page}>
                                                    <PaginationLink
                                                        href="#pablo"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(pagination.current_page + 1); }}
                                                    >
                                                        <i className="fas fa-angle-right" />
                                                        <span className="sr-only">Next</span>
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </Pagination>
                                        </nav>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    </div>
                </Row>
            </Container>

            {/* Add Category Modal */}
            <Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>Add New Category</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="name">Category Name <span className="text-danger">*</span></Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="Enter category name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="slug">Slug</Label>
                                    <Input
                                        type="text"
                                        id="slug"
                                        placeholder="e.g. indoor-plants (Optional)"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
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
                            <Col md="6" className="d-flex align-items-center mt-4">
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            id="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleInputChange}
                                        />{' '}
                                        Featured Category
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label for="image">Category Image</Label>
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
                                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', border: '1px dashed #ddd' }}
                                    />
                                    <br />
                                    <small className="text-muted">Image Preview</small>
                                </div>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="textarea"
                                id="description"
                                rows="4"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2" /> Save Category
                            </>
                        )}
                    </Button>
                    <Button color="secondary" onClick={toggle} disabled={saving}>
                        <i className="fas fa-times mr-2" /> Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default CategoryList;
