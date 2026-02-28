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
    Media,
} from "reactstrap";
import Swal from "sweetalert2";
import Header from "components/Headers/Header.js";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

const ProductList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category_id: "",
        price: "",
        sale_price: "",
        sku: "",
        stock: "",
        botanical_name: "",
        short_description: "",
        description: "",
        image: "",
        is_featured: false,
        status: "Active",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        multiple_images: []
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
                category_id: "",
                price: "",
                sale_price: "",
                sku: "",
                stock: "",
                botanical_name: "",
                short_description: "",
                description: "",
                image: "",
                is_featured: false,
                status: "Active",
                meta_title: "",
                meta_description: "",
                meta_keywords: "",
                multiple_images: []
            });
            setImagePreview(null);
        }
    };

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                productService.getAll({ page }),
                categoryService.getAll() // categories for dropdown, keeping all
            ]);

            if (prodRes.success) {
                // Check if paged
                if (prodRes.data.data) {
                    setProducts(prodRes.data.data);
                    setPagination({
                        current_page: prodRes.data.current_page || 1,
                        last_page: prodRes.data.last_page || 1,
                        per_page: prodRes.data.per_page || 10,
                        total: prodRes.data.total || 0
                    });
                } else {
                    setProducts(prodRes.data); // Fallback
                }
            }
            if (catRes.success) {
                // Check if paged (since we updated CategoryController too)
                // But for dropdown we need ALL categories.
                // Ideally we should have a separate 'list' endpoint or large page size.
                // For now, let's assume valid data or just use the first page.
                if (catRes.data.data) {
                    setCategories(catRes.data.data);
                } else {
                    setCategories(catRes.data);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Toast.fire({
                icon: 'error',
                title: 'Failed to load data'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchData(newPage);
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

    const handleMultipleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            multiple_images: [...(prev.multiple_images || []), ...files]
        }));
    };

    const removeMultipleImage = (index) => {
        setFormData(prev => ({
            ...prev,
            multiple_images: prev.multiple_images.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'multiple_images') {
                    if (formData.multiple_images && formData.multiple_images.length > 0) {
                        formData.multiple_images.forEach(file => {
                            data.append('multiple_images[]', file);
                        });
                    }
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key] === true ? 1 : (formData[key] === false ? 0 : formData[key]));
                }
            });

            let res;
            if (formData.id) {
                data.append('_method', 'PUT');
                res = await productService.update(formData.id, data);
            } else {
                res = await productService.create(data);
            }

            if (res.success) {
                Toast.fire({
                    icon: 'success',
                    title: `Product ${formData.id ? 'updated' : 'created'} successfully!`
                });
                fetchData();
                toggle();
            }
        } catch (error) {
            console.error("Error saving product:", error);
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
                const message = error.response?.data?.message || "Failed to save product";
                Toast.fire({
                    icon: 'error',
                    title: message
                });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            id: product.id,
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            sale_price: product.sale_price,
            sku: product.sku,
            stock: product.stock,
            botanical_name: product.botanical_name,
            short_description: product.short_description,
            description: product.description,
            image: product.image,
            is_featured: product.is_featured,
            status: product.status,
            meta_title: product.meta_title || "",
            meta_description: product.meta_description || "",
            meta_keywords: product.meta_keywords || "",
            multiple_images: product.multiple_images || []
        });
        setImagePreview(product.image);
        setModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const data = await productService.delete(id);
                if (data.success) {
                    fetchData();
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                alert(error.message || "Failed to delete product");
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
            try {
                const data = await productService.updateStatus(id, newStatus);
                if (data.success) {
                    fetchData();
                }
            } catch (error) {
                console.error("Error updating status:", error);
                alert(error.message || "Failed to update status");
            }
        }
    };

    const filteredProducts = products.filter((prod) =>
        prod.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                                        <h3 className="mb-0">Products</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button color="info" onClick={toggle} size="sm">
                                            Add Product
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md="4">
                                        <Input
                                            placeholder="Search products..."
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
                                    <p className="mt-2 text-muted">Loading products...</p>
                                </div>
                            ) : (
                                <>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Product Name</th>
                                                <th scope="col">SKU</th>
                                                <th scope="col">Category</th>
                                                <th scope="col">Price (Regular/Sale)</th>
                                                <th scope="col">Stock</th>
                                                <th scope="col">Status</th>
                                                <th scope="col" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map((product, index) => (
                                                <tr key={product.id}>
                                                    <td>{(pagination.current_page - 1) * pagination.per_page + index + 1}</td>
                                                    <th scope="row">
                                                        <Media className="align-items-center">
                                                            <a className="avatar rounded-circle mr-3" href="#pablo" onClick={e => e.preventDefault()}>
                                                                <img
                                                                    alt={product.name}
                                                                    src={product.image || require("assets/img/theme/bootstrap.jpg")}
                                                                />
                                                            </a>
                                                            <Media body>
                                                                <span className="mb-0 text-sm font-weight-bold">
                                                                    {product.name}
                                                                </span>
                                                                <br />
                                                                <small className="text-muted italic">{product.botanical_name}</small>
                                                            </Media>
                                                        </Media>
                                                    </th>
                                                    <td>{product.sku}</td>
                                                    <td>{product.category?.name || "N/A"}</td>
                                                    <td>
                                                        <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '5px' }}>₹{product.price}</span>
                                                        <span className="text-success font-weight-bold">₹{product.sale_price}</span>
                                                    </td>
                                                    <td>{product.stock}</td>
                                                    <td>
                                                        <Badge color="" className="badge-dot mr-4">
                                                            <i className={product.status === "Active" ? "bg-success" : "bg-warning"} />
                                                            {product.status}
                                                        </Badge>
                                                        {product.is_featured && <Badge color="info" className="ml-2">Featured</Badge>}
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
                                                                <DropdownItem onClick={() => handleEdit(product)}>
                                                                    Edit
                                                                </DropdownItem>
                                                                <DropdownItem onClick={() => handleDelete(product.id)}>
                                                                    Delete
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredProducts.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-4">
                                                        No products found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>

                                    {/* Pagination Controls */}
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
                            )
                            }
                        </Card>
                    </div>
                </Row>
            </Container>

            {/* Add Product Modal */}
            <Modal isOpen={modal} toggle={toggle} size="xl">
                <ModalHeader toggle={toggle}>Add New Product</ModalHeader>
                <ModalBody>
                    <Form>
                        <h6 className="heading-small text-muted mb-4">Product Information</h6>
                        <Row>
                            <Col md="4">
                                <FormGroup>
                                    <Label for="name">Product Name <span className="text-danger">*</span></Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="Enter product name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4">
                                <FormGroup>
                                    <Label for="botanical_name">Botanical Name (Optional)</Label>
                                    <Input
                                        type="text"
                                        id="botanical_name"
                                        placeholder="e.g. Sansevieria trifasciata"
                                        value={formData.botanical_name}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4">
                                <FormGroup>
                                    <Label for="category_id">Category <span className="text-danger">*</span></Label>
                                    <Input
                                        type="select"
                                        id="category_id"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr className="my-4" />
                        <h6 className="heading-small text-muted mb-4">Pricing & Inventory</h6>
                        <Row>
                            <Col md="3">
                                <FormGroup>
                                    <Label for="price">Regular Price (₹) <span className="text-danger">*</span></Label>
                                    <Input
                                        type="number"
                                        id="price"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <Label for="sale_price">Sale Price (₹)</Label>
                                    <Input
                                        type="number"
                                        id="sale_price"
                                        placeholder="0.00"
                                        value={formData.sale_price}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <Label for="sku">SKU <span className="text-danger">*</span></Label>
                                    <Input
                                        type="text"
                                        id="sku"
                                        placeholder="e.g. IND-SNP-01"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <Label for="stock">Stock Quantity <span className="text-danger">*</span></Label>
                                    <Input
                                        type="number"
                                        id="stock"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr className="my-4" />
                        <h6 className="heading-small text-muted mb-4">Description & Media</h6>
                        <FormGroup>
                            <Label for="short_description">Short Description</Label>
                            <Input
                                type="text"
                                id="short_description"
                                placeholder="Brief summary for list views"
                                value={formData.short_description}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Full Description</Label>
                            <Input
                                type="textarea"
                                id="description"
                                rows="4"
                                placeholder="Detailed product description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="image">Product Main Image</Label>
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
                                            <small className="text-muted">Main Image Preview</small>
                                        </div>
                                    )}
                                </FormGroup>
                                <FormGroup className="mt-4">
                                    <Label for="multiple_images">Product Gallery (Multiple Images)</Label>
                                    <Input
                                        type="file"
                                        id="multiple_images"
                                        multiple
                                        onChange={handleMultipleImagesChange}
                                        accept="image/*"
                                    />
                                    {formData.multiple_images && formData.multiple_images.length > 0 && (
                                        <div className="mt-2 d-flex flex-wrap gap-2">
                                            {formData.multiple_images.map((img, idx) => (
                                                <div key={idx} className="position-relative m-1" style={{ display: "inline-block" }}>
                                                    <img
                                                        src={img instanceof File ? URL.createObjectURL(img) : img}
                                                        alt="Gallery preview"
                                                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMultipleImage(idx)}
                                                        className="btn btn-sm btn-danger position-absolute"
                                                        style={{ top: "-5px", right: "-5px", padding: "0 5px", borderRadius: "50%" }}
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" className="d-flex align-items-center mb-4">
                                <FormGroup check inline>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={formData.is_featured}
                                            onChange={handleInputChange}
                                        />{' '}
                                        Featured Product
                                    </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            id="status"
                                            checked={formData.status === 'Active'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'Active' : 'Draft' }))}
                                        />{' '}
                                        Active
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr className="my-4" />
                        <h6 className="heading-small text-muted mb-4">SEO Details</h6>
                        <FormGroup>
                            <Label for="meta_title">Meta Title</Label>
                            <Input
                                type="text"
                                id="meta_title"
                                placeholder="SEO Title"
                                value={formData.meta_title}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="meta_description">Meta Description</Label>
                            <Input
                                type="textarea"
                                id="meta_description"
                                placeholder="SEO Meta Description"
                                value={formData.meta_description}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="meta_keywords">Meta Keywords</Label>
                            <Input
                                type="text"
                                id="meta_keywords"
                                placeholder="e.g. plants, nursery, green"
                                value={formData.meta_keywords}
                                onChange={handleInputChange}
                            />
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
                        ) : "Save Product"}
                    </Button>
                    <Button color="secondary" onClick={toggle} disabled={saving}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default ProductList;
