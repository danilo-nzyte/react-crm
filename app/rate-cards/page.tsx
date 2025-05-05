"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Pencil,
  Trash2,
  ChevronRight,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Customer interface
 */
interface Customer {
  id: string;
  name: string;
}

/**
 * Product interface
 */
interface Product {
  id: string;
  name: string;
  basePrice: number;
}

/**
 * Rate Card Product interface
 */
interface RateCardProduct {
  id: string;
  productId: string;
  productName: string;
  basePrice: number;
  rate: number;
}

/**
 * Rate Card interface
 */
interface RateCard {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  effectiveDate: string;
  expirationDate: string;
  products: RateCardProduct[];
  createdAt: string;
  updatedAt: string;
}

/**
 * RateCardsPage component for managing rate cards
 * Provides CRUD functionality for rate cards and their products
 */
export default function RateCardsPage() {
  // State for rate card data and UI controls
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] =
    useState<boolean>(false);
  const [currentRateCard, setCurrentRateCard] = useState<RateCard | null>(null);
  const [selectedRateCard, setSelectedRateCard] = useState<RateCard | null>(
    null
  );
  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    effectiveDate: "",
    expirationDate: "",
  });
  const [productFormData, setProductFormData] = useState({
    productId: "",
    rate: "",
  });

  /**
   * Load mock data on component mount
   * In a real application, this would fetch data from an API
   */
  useEffect(() => {
    // Mock customers data
    setCustomers([
      { id: "1", name: "Acme Corporation" },
      { id: "2", name: "Globex Corporation" },
      { id: "3", name: "Initech" },
    ]);

    // Mock products data
    setProducts([
      { id: "1", name: "Basic Consultation", basePrice: 150 },
      { id: "2", name: "Advanced Implementation", basePrice: 2500 },
      { id: "3", name: "Maintenance Package", basePrice: 500 },
    ]);

    // Mock rate cards data
    setRateCards([
      {
        id: "1",
        customerId: "1",
        customerName: "Acme Corporation",
        name: "Acme Standard Rate Card",
        effectiveDate: "2023-01-01",
        expirationDate: "2023-12-31",
        products: [
          {
            id: "101",
            productId: "1",
            productName: "Basic Consultation",
            basePrice: 150,
            rate: 125,
          },
          {
            id: "102",
            productId: "2",
            productName: "Advanced Implementation",
            basePrice: 2500,
            rate: 2250,
          },
        ],
        createdAt: "2022-12-15T00:00:00Z",
        updatedAt: "2022-12-15T00:00:00Z",
      },
      {
        id: "2",
        customerId: "2",
        customerName: "Globex Corporation",
        name: "Globex Premium Rate Card",
        effectiveDate: "2023-02-01",
        expirationDate: "2024-01-31",
        products: [
          {
            id: "201",
            productId: "1",
            productName: "Basic Consultation",
            basePrice: 150,
            rate: 140,
          },
          {
            id: "202",
            productId: "3",
            productName: "Maintenance Package",
            basePrice: 500,
            rate: 450,
          },
        ],
        createdAt: "2023-01-15T00:00:00Z",
        updatedAt: "2023-01-15T00:00:00Z",
      },
    ]);
  }, []);

  /**
   * Handle form input changes
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handle product form input changes
   * @param e - Input change event
   */
  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: value,
    });
  };

  /**
   * Handle select changes for customer
   * @param value - Selected value
   */
  const handleCustomerSelectChange = (value: string) => {
    setFormData({
      ...formData,
      customerId: value,
    });
  };

  /**
   * Handle select changes for product
   * @param value - Selected value
   */
  const handleProductSelectChange = (value: string) => {
    const selectedProduct = products.find((p) => p.id === value);

    setProductFormData({
      productId: value,
      // Pre-fill with the base price as a starting point
      rate: selectedProduct ? selectedProduct.basePrice.toString() : "",
    });
  };

  /**
   * Validate rate card form data
   * @returns Object with validation result and error message
   */
  const validateRateCardForm = (): {
    isValid: boolean;
    errorMessage: string;
  } => {
    if (!formData.customerId) {
      return { isValid: false, errorMessage: "Please select a customer." };
    }

    if (!formData.name) {
      return { isValid: false, errorMessage: "Rate card name is required." };
    }

    if (!formData.effectiveDate) {
      return { isValid: false, errorMessage: "Effective date is required." };
    }

    if (
      formData.effectiveDate &&
      formData.expirationDate &&
      new Date(formData.effectiveDate) > new Date(formData.expirationDate)
    ) {
      return {
        isValid: false,
        errorMessage: "Effective date must be before expiration date.",
      };
    }

    return { isValid: true, errorMessage: "" };
  };

  /**
   * Validate product form data
   * @returns Object with validation result and error message
   */
  const validateProductForm = (): {
    isValid: boolean;
    errorMessage: string;
  } => {
    if (!productFormData.productId) {
      return { isValid: false, errorMessage: "Please select a product." };
    }

    const rate = parseFloat(productFormData.rate);
    if (isNaN(rate) || rate < 0) {
      return { isValid: false, errorMessage: "Please enter a valid rate." };
    }

    if (
      selectedRateCard?.products.some(
        (p) => p.productId === productFormData.productId
      )
    ) {
      return {
        isValid: false,
        errorMessage: "This product is already in the rate card.",
      };
    }

    return { isValid: true, errorMessage: "" };
  };

  /**
   * Handle adding a new rate card
   */
  const handleAddRateCard = () => {
    const validation = validateRateCardForm();
    if (!validation.isValid) {
      // In a real app, you would show the error message to the user
      console.error(validation.errorMessage);
      return;
    }

    const customer = customers.find((c) => c.id === formData.customerId);
    if (!customer) return;

    // Create new rate card
    const newRateCard: RateCard = {
      id: Math.random().toString(36).substring(7),
      customerId: formData.customerId,
      customerName: customer.name,
      name: formData.name,
      effectiveDate: formData.effectiveDate,
      expirationDate: formData.expirationDate,
      products: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to rate cards list
    setRateCards([...rateCards, newRateCard]);

    // Reset form and close dialog
    setFormData({
      customerId: "",
      name: "",
      effectiveDate: "",
      expirationDate: "",
    });
    setIsAddDialogOpen(false);
  };

  /**
   * Open the edit dialog for a rate card
   * @param rateCard - The rate card to edit
   */
  const openEditDialog = (rateCard: RateCard) => {
    setCurrentRateCard(rateCard);
    setFormData({
      customerId: rateCard.customerId,
      name: rateCard.name,
      effectiveDate: rateCard.effectiveDate,
      expirationDate: rateCard.expirationDate || "",
    });
    setIsEditDialogOpen(true);
  };

  /**
   * Handle editing an existing rate card
   */
  const handleEditRateCard = () => {
    if (!currentRateCard) return;

    const validation = validateRateCardForm();
    if (!validation.isValid) {
      // In a real app, you would show the error message to the user
      console.error(validation.errorMessage);
      return;
    }

    const customer = customers.find((c) => c.id === formData.customerId);
    if (!customer) return;

    // Update rate card in the list
    const updatedRateCards = rateCards.map((rateCard) =>
      rateCard.id === currentRateCard.id
        ? {
            ...rateCard,
            customerId: formData.customerId,
            customerName: customer.name,
            name: formData.name,
            effectiveDate: formData.effectiveDate,
            expirationDate: formData.expirationDate,
            updatedAt: new Date().toISOString(),
          }
        : rateCard
    );

    setRateCards(updatedRateCards);

    // If the edited rate card is the selected one, update it
    if (selectedRateCard && selectedRateCard.id === currentRateCard.id) {
      const updatedRateCard = updatedRateCards.find(
        (rc) => rc.id === currentRateCard.id
      );
      if (updatedRateCard) {
        setSelectedRateCard(updatedRateCard);
      }
    }

    setIsEditDialogOpen(false);
  };

  /**
   * Open the delete confirmation dialog for a rate card
   * @param rateCard - The rate card to delete
   */
  const openDeleteDialog = (rateCard: RateCard) => {
    setCurrentRateCard(rateCard);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Handle deleting a rate card
   */
  const handleDeleteRateCard = () => {
    if (!currentRateCard) return;

    // Filter out the rate card to delete
    const filteredRateCards = rateCards.filter(
      (rateCard) => rateCard.id !== currentRateCard.id
    );
    setRateCards(filteredRateCards);

    // If the deleted rate card is the selected one, clear selection
    if (selectedRateCard && selectedRateCard.id === currentRateCard.id) {
      setSelectedRateCard(null);
    }

    setIsDeleteDialogOpen(false);
  };

  /**
   * Handle adding a product to a rate card
   */
  const handleAddProductToRateCard = () => {
    if (!selectedRateCard) return;

    const validation = validateProductForm();
    if (!validation.isValid) {
      // In a real app, you would show the error message to the user
      console.error(validation.errorMessage);
      return;
    }

    const product = products.find((p) => p.id === productFormData.productId);
    if (!product) return;

    // Create new rate card product
    const newProduct: RateCardProduct = {
      id: Math.random().toString(36).substring(7),
      productId: product.id,
      productName: product.name,
      basePrice: product.basePrice,
      rate: parseFloat(productFormData.rate),
    };

    // Add product to rate card
    const updatedRateCard = {
      ...selectedRateCard,
      products: [...selectedRateCard.products, newProduct],
      updatedAt: new Date().toISOString(),
    };

    // Update rate cards list
    const updatedRateCards = rateCards.map((rateCard) =>
      rateCard.id === selectedRateCard.id ? updatedRateCard : rateCard
    );

    setRateCards(updatedRateCards);
    setSelectedRateCard(updatedRateCard);

    // Reset form and close dialog
    setProductFormData({
      productId: "",
      rate: "",
    });
    setIsAddProductDialogOpen(false);
  };

  /**
   * Handle removing a product from a rate card
   * @param productId - ID of the product to remove
   */
  const handleRemoveProductFromRateCard = (productId: string) => {
    if (!selectedRateCard) return;

    // Filter out the product to remove
    const updatedProducts = selectedRateCard.products.filter(
      (product) => product.id !== productId
    );

    // Update rate card
    const updatedRateCard = {
      ...selectedRateCard,
      products: updatedProducts,
      updatedAt: new Date().toISOString(),
    };

    // Update rate cards list
    const updatedRateCards = rateCards.map((rateCard) =>
      rateCard.id === selectedRateCard.id ? updatedRateCard : rateCard
    );

    setRateCards(updatedRateCards);
    setSelectedRateCard(updatedRateCard);
  };

  /**
   * Calculate discount percentage between two prices
   * @param original - Original price
   * @param discounted - Discounted price
   * @returns Discount percentage
   */
  const calculateDiscount = (original: number, discounted: number): number => {
    return ((original - discounted) / original) * 100;
  };

  /**
   * Format date string to a more readable format
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * View rate card details
   * @param rateCard - Rate card to view
   */
  const viewRateCardDetails = (rateCard: RateCard) => {
    setSelectedRateCard(rateCard);
  };

  /**
   * Go back to rate card list
   */
  const backToList = () => {
    setSelectedRateCard(null);
  };

  return (
    <div className="container mx-auto py-10">
      {!selectedRateCard ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Rate Cards</CardTitle>
            <CardDescription>
              Manage customer-specific pricing for products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Rate Card
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Rate Card</DialogTitle>
                    <DialogDescription>
                      Create a new rate card for a customer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="customer" className="text-right">
                        Customer
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={formData.customerId}
                          onValueChange={handleCustomerSelectChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Rate Card Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="effectiveDate" className="text-right">
                        Effective Date
                      </Label>
                      <Input
                        id="effectiveDate"
                        name="effectiveDate"
                        type="date"
                        value={formData.effectiveDate}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expirationDate" className="text-right">
                        Expiration Date
                      </Label>
                      <Input
                        id="expirationDate"
                        name="expirationDate"
                        type="date"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddRateCard}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rate Card Name</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateCards.map((rateCard) => (
                  <TableRow key={rateCard.id}>
                    <TableCell className="font-medium">
                      {rateCard.customerName}
                    </TableCell>
                    <TableCell>{rateCard.name}</TableCell>
                    <TableCell>{formatDate(rateCard.effectiveDate)}</TableCell>
                    <TableCell>{formatDate(rateCard.expirationDate)}</TableCell>
                    <TableCell>{rateCard.products.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => viewRateCardDetails(rateCard)}
                        >
                          View
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(rateCard)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => openDeleteDialog(rateCard)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rateCards.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No rate cards found. Add a rate card to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-2 flex items-center gap-1"
                  onClick={backToList}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Rate Cards
                </Button>
                <CardTitle className="text-2xl font-bold">
                  {selectedRateCard.name}
                </CardTitle>
                <CardDescription>
                  Customer: {selectedRateCard.customerName}
                </CardDescription>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>
                    Effective: {formatDate(selectedRateCard.effectiveDate)}
                  </span>
                  {selectedRateCard.expirationDate && (
                    <span className="ml-4">
                      Expires: {formatDate(selectedRateCard.expirationDate)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(selectedRateCard)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteDialog(selectedRateCard)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Product Button */}
            <div className="flex justify-end mb-4">
              <Dialog
                open={isAddProductDialogOpen}
                onOpenChange={setIsAddProductDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Product to Rate Card</DialogTitle>
                    <DialogDescription>
                      Add a product with a custom rate to this rate card.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="product" className="text-right">
                        Product
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={productFormData.productId}
                          onValueChange={handleProductSelectChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products
                              .filter(
                                (product) =>
                                  !selectedRateCard.products.some(
                                    (p) => p.productId === product.id
                                  )
                              )
                              .map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ($
                                  {product.basePrice.toFixed(2)})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rate" className="text-right">
                        Custom Rate ($)
                      </Label>
                      <Input
                        id="rate"
                        name="rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={productFormData.rate}
                        onChange={handleProductInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddProductDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddProductToRateCard}>
                      Add Product
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Custom Rate</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedRateCard.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.productName}
                    </TableCell>
                    <TableCell>${product.basePrice.toFixed(2)}</TableCell>
                    <TableCell>${product.rate.toFixed(2)}</TableCell>
                    <TableCell
                      className={cn(
                        "font-medium",
                        product.rate < product.basePrice
                          ? "text-green-600"
                          : product.rate > product.basePrice
                          ? "text-red-600"
                          : ""
                      )}
                    >
                      {product.rate < product.basePrice
                        ? `-${calculateDiscount(
                            product.basePrice,
                            product.rate
                          ).toFixed(2)}%`
                        : product.rate > product.basePrice
                        ? `+${calculateDiscount(
                            product.rate,
                            product.basePrice
                          ).toFixed(2)}%`
                        : "0%"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleRemoveProductFromRateCard(product.id)
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {selectedRateCard.products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No products in this rate card. Add a product to get
                      started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Rate Card Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rate Card</DialogTitle>
            <DialogDescription>
              Update the rate card information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-customer" className="text-right">
                Customer
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.customerId}
                  onValueChange={handleCustomerSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Rate Card Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-effectiveDate" className="text-right">
                Effective Date
              </Label>
              <Input
                id="edit-effectiveDate"
                name="effectiveDate"
                type="date"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-expirationDate" className="text-right">
                Expiration Date
              </Label>
              <Input
                id="edit-expirationDate"
                name="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditRateCard}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentRateCard?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRateCard}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
