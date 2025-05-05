"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CustomerRateCardProduct } from "@/types";

const WorkLogPage: React.FC = () => {
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] =
    useState(false);
  const [currentWorkLogProduct, setCurrentWorkLogProduct] =
    useState<CustomerRateCardProduct | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    customer_rate_card_product_id: "",
  });
  const [availableProducts, setAvailableProducts] = useState<
    CustomerRateCardProduct[]
  >([]);

  const handleProductInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductFormData({
      ...productFormData,
      name: event.target.value,
    });
  };

  const handleRateCardProductSelectChange = (value: string) => {
    setProductFormData({
      ...productFormData,
      customer_rate_card_product_id: value,
    });
  };

  const handleAddProduct = () => {
    // Implementation of adding a product
  };

  const handleDeleteProduct = () => {
    // Implementation of deleting a product
  };

  return (
    <div>
      {/* Add Product Dialog */}
      <Dialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product to Work Log</DialogTitle>
            <DialogDescription>
              Assign a product from the customer rate card to this work log.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={productFormData.name}
                onChange={handleProductInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="customer_rate_card_product_id"
                className="text-right"
              >
                Rate Card Product
              </Label>
              <div className="col-span-3">
                <Select
                  value={productFormData.customer_rate_card_product_id.toString()}
                  onValueChange={handleRateCardProductSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id.toString()}
                      >
                        {product.product_name} - £{product.cass_rate.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddProductDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Dialog */}
      <Dialog
        open={isDeleteProductDialogOpen}
        onOpenChange={setIsDeleteProductDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {currentWorkLogProduct?.name} from
              this work log? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteProductDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkLogPage;
