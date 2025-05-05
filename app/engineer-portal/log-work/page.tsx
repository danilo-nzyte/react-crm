"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Calendar } from "lucide-react";
import {
  Project,
  Gang,
  WorkLog,
  WorkLogProduct,
  WorkLogEntry,
  Engineer,
  GangEngineer,
  CustomerRateCardProduct,
} from "@/types";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * LogWorkPage component for engineers to log work for their gang
 * Mobile-optimized for field use
 */
export default function LogWorkPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gangId = searchParams.get("gangId");

  // State for data
  const [gang, setGang] = useState<Gang | null>(null);
  const [workLog, setWorkLog] = useState<WorkLog | null>(null);
  const [workLogProducts, setWorkLogProducts] = useState<WorkLogProduct[]>([]);
  const [gangEngineers, setGangEngineers] = useState<GangEngineer[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [weekStart, setWeekStart] = useState<string>(
    getMonday(new Date()).toISOString().split("T")[0]
  );
  const [activeDay, setActiveDay] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [productQuantities, setProductQuantities] = useState<
    Record<string, Record<number, number>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<
    Record<string, Record<number, number>>
  >({});
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, Record<number, number>>
  >({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableProducts, setAvailableProducts] = useState<
    CustomerRateCardProduct[]
  >([]);

  /**
   * Get Monday of the current week
   * @param date - Current date
   * @returns Date object for Monday
   */
  function getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  /**
   * Format date as YYYY-MM-DD
   * @param date - Date to format
   * @returns Formatted date string
   */
  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  /**
   * Format date for display (e.g., "Mon, Jan 1")
   * @param dateStr - Date string in YYYY-MM-DD format
   * @returns Formatted date for display
   */
  function formatDateForDisplay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Generate array of dates for the week
   * @param start - Start date string
   * @returns Array of date strings
   */
  function generateWeekDays(start: string): string[] {
    const days: string[] = [];
    const startDate = new Date(start);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(formatDate(currentDate));
    }

    return days;
  }

  // Initialize week days when week range changes
  useEffect(() => {
    const days = generateWeekDays(weekStart);
    setWeekDays(days);

    // Initialize product quantities, selected projects and products for each day
    const initialQuantities: Record<string, Record<number, number>> = {};
    const initialSelectedProjects: Record<string, Record<number, number>> = {};
    const initialSelectedProducts: Record<string, Record<number, number>> = {};

    days.forEach((day) => {
      initialQuantities[day] = {};
      initialSelectedProjects[day] = {};
      initialSelectedProducts[day] = {};

      workLogProducts.forEach((product) => {
        initialQuantities[day][product.id] = 0;
        initialSelectedProjects[day][product.id] = 0;
        initialSelectedProducts[day][product.id] = 0;
      });
    });

    setProductQuantities(initialQuantities);
    setSelectedProjects(initialSelectedProjects);
    setSelectedProducts(initialSelectedProducts);
  }, [weekStart, workLogProducts]);

  // Load data based on URL parameters
  useEffect(() => {
    if (!gangId) {
      router.push("/engineer-portal");
      return;
    }

    // Mock data loading
    const mockProjects: Project[] = [
      {
        id: 1,
        name: "Network Infrastructure Upgrade",
        status: "planned",
        work_log_id: 1,
        is_deleted: false,
        created_at: "2023-01-05T00:00:00Z",
        modified_at: "2023-01-05T00:00:00Z",
      },
      {
        id: 2,
        name: "Server Migration Project",
        status: "started",
        work_log_id: 2,
        is_deleted: false,
        created_at: "2023-01-06T00:00:00Z",
        modified_at: "2023-01-06T00:00:00Z",
      },
    ];

    const mockCustomerRateCardProducts: CustomerRateCardProduct[] = [
      {
        id: 1,
        name: "Cable Installation",
        customer_rate_card_id: 1,
        product_id: 1,
        cass_rate: 60,
        engineer_rate: 45,
        reference_1: "CAB-001",
        reference_2: "",
        reference_3: "",
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Network Configuration",
        customer_rate_card_id: 1,
        product_id: 1,
        cass_rate: 65,
        engineer_rate: 50,
        reference_1: "NET-001",
        reference_2: "",
        reference_3: "",
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 3,
        name: "Server Setup",
        customer_rate_card_id: 2,
        product_id: 2,
        cass_rate: 70,
        engineer_rate: 55,
        reference_1: "SRV-001",
        reference_2: "",
        reference_3: "",
        is_deleted: false,
        created_at: "2023-01-02T00:00:00Z",
        modified_at: "2023-01-02T00:00:00Z",
      },
    ];

    const mockGangs: Gang[] = [
      {
        id: 1,
        name: "Alpha Team",
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Beta Squad",
        is_deleted: false,
        created_at: "2023-01-02T00:00:00Z",
        modified_at: "2023-01-02T00:00:00Z",
      },
    ];

    const mockWorkLogs: WorkLog[] = [
      {
        id: 1,
        name: "Network Infrastructure Upgrade Work Log",
        customer_rate_card_id: 1,
        gang_id: 1,
        is_deleted: false,
        created_at: "2023-01-05T00:00:00Z",
        modified_at: "2023-01-05T00:00:00Z",
      },
      {
        id: 2,
        name: "Server Migration Project Work Log",
        customer_rate_card_id: 2,
        gang_id: 1,
        is_deleted: false,
        created_at: "2023-01-06T00:00:00Z",
        modified_at: "2023-01-06T00:00:00Z",
      },
    ];

    const mockWorkLogProducts: WorkLogProduct[] = [
      {
        id: 1,
        name: "Work Item 1",
        worklog_id: 1,
        customer_rate_card_product_id: 1,
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Work Item 2",
        worklog_id: 1,
        customer_rate_card_product_id: 2,
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
    ];

    const mockEngineers: Engineer[] = [
      {
        id: 1,
        name: "Engineer 1",
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Engineer 2",
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
    ];

    const mockGangEngineers: GangEngineer[] = [
      {
        id: 1,
        gang_id: 1,
        engineer_id: 1,
        name: "Engineer 1",
        engineer_share: 50,
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        gang_id: 1,
        engineer_id: 2,
        name: "Engineer 2",
        engineer_share: 50,
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
    ];

    // Find the current gang
    const currentGang = mockGangs.find((g) => g.id === parseInt(gangId));

    if (currentGang) {
      setGang(currentGang);
    }

    // Set work log
    setWorkLog(mockWorkLogs[0]);

    // Filter gang engineers for the current gang
    const filteredGangEngineers = mockGangEngineers.filter(
      (ge) => ge.gang_id === parseInt(gangId)
    );
    setGangEngineers(filteredGangEngineers);

    // Set engineers
    setEngineers(mockEngineers);

    // Set projects
    setProjects(mockProjects);

    // Set available products
    setAvailableProducts(mockCustomerRateCardProducts);

    // Set work log products
    setWorkLogProducts(mockWorkLogProducts);

    // Initialize product quantities
    const initialQuantities: Record<string, Record<number, number>> = {};
    const initialSelectedProjects: Record<string, Record<number, number>> = {};
    const initialSelectedProducts: Record<string, Record<number, number>> = {};

    const days = generateWeekDays(weekStart);
    days.forEach((day) => {
      initialQuantities[day] = {};
      initialSelectedProjects[day] = {};
      initialSelectedProducts[day] = {};

      mockWorkLogProducts.forEach((product) => {
        initialQuantities[day][product.id] = 0;
        initialSelectedProjects[day][product.id] = 0;
        initialSelectedProducts[day][product.id] = 0;
      });
    });

    setProductQuantities(initialQuantities);
    setSelectedProjects(initialSelectedProjects);
    setSelectedProducts(initialSelectedProducts);
  }, [gangId, router, weekStart]);

  /**
   * Handle week start change
   */
  const handleWeekStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    // Ensure it's a Monday
    const monday = getMonday(newDate);
    setWeekStart(formatDate(monday));
  };

  /**
   * Handle quantity change for a product on a specific day
   */
  const handleQuantityChange = (
    day: string,
    productId: number,
    value: string
  ) => {
    const quantity = parseInt(value) || 0;
    setProductQuantities((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [productId]: quantity,
      },
    }));
  };

  /**
   * Handle project selection change
   */
  const handleProjectChange = (
    day: string,
    productId: number,
    projectIdStr: string
  ) => {
    const projectId = parseInt(projectIdStr);
    setSelectedProjects((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [productId]: projectId,
      },
    }));

    // Reset product selection when project changes
    setSelectedProducts((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [productId]: 0,
      },
    }));

    // Reset quantity when project changes
    setProductQuantities((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [productId]: 0,
      },
    }));
  };

  /**
   * Handle product selection change
   */
  const handleProductChange = (
    day: string,
    productId: number,
    productCodeIdStr: string
  ) => {
    const productCodeId = parseInt(productCodeIdStr);
    setSelectedProducts((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [productId]: productCodeId,
      },
    }));
  };

  /**
   * Get rate for a selected product
   */
  const getProductRate = (day: string, productId: number): number => {
    const selectedProductId = selectedProducts[day]?.[productId];
    if (!selectedProductId) return 0;

    const product = availableProducts.find((p) => p.id === selectedProductId);
    return product?.engineer_rate || 0;
  };

  /**
   * Calculate total for a product on a specific day
   */
  const calculateProductTotal = (day: string, productId: number): number => {
    const quantity = productQuantities[day]?.[productId] || 0;
    const selectedProductId = selectedProducts[day]?.[productId];

    if (!selectedProductId) return 0;

    const product = availableProducts.find((p) => p.id === selectedProductId);
    return quantity * (product?.engineer_rate || 0);
  };

  /**
   * Calculate total for a day
   */
  const calculateDayTotal = (day: string): number => {
    let total = 0;
    workLogProducts.forEach((product) => {
      total += calculateProductTotal(day, product.id);
    });
    return total;
  };

  /**
   * Calculate total for the week
   */
  const calculateWeekTotal = (): number => {
    return weekDays.reduce((total, day) => total + calculateDayTotal(day), 0);
  };

  /**
   * Calculate total for an engineer
   */
  const calculateEngineerTotal = (engineerId: number): number => {
    const gangEngineer = gangEngineers.find(
      (ge) => ge.engineer_id === engineerId
    );
    const share = gangEngineer?.engineer_share || 0;
    const grandTotal = calculateWeekTotal();
    return (share / 100) * grandTotal;
  };

  /**
   * Submit work log entries
   */
  const handleSubmit = () => {
    setIsSubmitting(true);

    // Validate that there's at least one quantity entered
    const hasEntries = weekDays.some((day) =>
      Object.values(productQuantities[day] || {}).some((q) => q > 0)
    );

    if (!hasEntries) {
      toast("Please enter at least one quantity", {
        description: "You need to log some work before submitting.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!gang || !workLog) {
      toast("Missing required data", {
        description: "Gang or work log data is missing.",
      });
      setIsSubmitting(false);
      return;
    }

    // Create entries array
    const entries: WorkLogEntry[] = [];

    // Create entries for each day, product, and engineer
    weekDays.forEach((day) => {
      workLogProducts.forEach((product) => {
        const quantity = productQuantities[day]?.[product.id] || 0;
        const selectedProductId = selectedProducts[day]?.[product.id];

        if (quantity > 0 && selectedProductId) {
          gangEngineers.forEach((gangEngineer) => {
            const engineerId = gangEngineer.engineer_id;
            const share = gangEngineer.engineer_share || 0;

            if (share > 0) {
              const engineerQuantity =
                Math.round(((quantity * share) / 100) * 100) / 100;

              const entry: WorkLogEntry = {
                id: Date.now() + Math.random(), // Temporary ID for mock
                name: `${engineers.find((e) => e.id === engineerId)?.name} - ${
                  product.name
                }`,
                date: day,
                engineer_id: engineerId,
                gang_id: gang.id,
                gang_engineer_id: gangEngineer.id,
                worklog_id: workLog.id,
                customer_rate_card_product:
                  product.customer_rate_card_product_id,
                unit_sale: engineerQuantity,
                unit_wage: engineerQuantity,
                is_approved: false,
                is_deleted: false,
                created_at: new Date().toISOString(),
                modified_at: new Date().toISOString(),
              };

              entries.push(entry);
            }
          });
        }
      });
    });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      // Show success toast
      toast("Work logged successfully", {
        description: `${entries.length} activities logged for the week`,
        action: {
          label: "Dashboard",
          onClick: () => router.push("/engineer-portal"),
        },
      });

      // Reset form
      const resetQuantities: Record<string, Record<number, number>> = {};
      const resetSelectedProjects: Record<string, Record<number, number>> = {};
      const resetSelectedProducts: Record<string, Record<number, number>> = {};

      weekDays.forEach((day) => {
        resetQuantities[day] = {};
        resetSelectedProjects[day] = {};
        resetSelectedProducts[day] = {};

        workLogProducts.forEach((product) => {
          resetQuantities[day][product.id] = 0;
          resetSelectedProjects[day][product.id] = 0;
          resetSelectedProducts[day][product.id] = 0;
        });
      });

      setProductQuantities(resetQuantities);
      setSelectedProjects(resetSelectedProjects);
      setSelectedProducts(resetSelectedProducts);
    }, 1000);
  };

  // Get day name only (e.g., "Mon", "Tue")
  function getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/engineer-portal")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-center flex-1">
              <CardTitle className="text-xl">Log Work</CardTitle>
              <CardDescription>
                {gang?.name} - Week Commencing {formatDateForDisplay(weekStart)}
              </CardDescription>
            </div>
            <div className="w-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label>Week Commencing</Label>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={weekStart}
                  onChange={handleWeekStartChange}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Engineer Shares</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Engineer</TableHead>
                      <TableHead>Engineer Share</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gangEngineers.map((ge) => {
                      const engineer = engineers.find(
                        (e) => e.id === ge.engineer_id
                      );
                      return (
                        <TableRow key={ge.id}>
                          <TableCell>{engineer?.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-medium">
                                {ge.engineer_share || 0}
                              </span>
                              <span className="ml-1">%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {calculateEngineerTotal(ge.engineer_id).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Work Activities</h3>

              <Tabs defaultValue={activeDay} onValueChange={setActiveDay}>
                <TabsList className="grid grid-cols-7 mb-2">
                  {weekDays.map((day) => (
                    <TabsTrigger key={day} value={day}>
                      {getDayName(day)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="text-center mb-4">
                  <span className="text-sm font-medium">
                    {activeDay ? formatDateForDisplay(activeDay) : ""}
                  </span>
                </div>

                {weekDays.map((day) => (
                  <TabsContent key={day} value={day}>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Project</TableHead>
                            <TableHead>Product Code</TableHead>
                            <TableHead>Engineer Rate</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workLogProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <Select
                                  value={
                                    selectedProjects[day]?.[
                                      product.id
                                    ]?.toString() || ""
                                  }
                                  onValueChange={(value) =>
                                    handleProjectChange(day, product.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select project" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {projects.map((proj) => (
                                      <SelectItem
                                        key={proj.id}
                                        value={proj.id.toString()}
                                      >
                                        {proj.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={
                                    selectedProducts[day]?.[
                                      product.id
                                    ]?.toString() || ""
                                  }
                                  onValueChange={(value) =>
                                    handleProductChange(day, product.id, value)
                                  }
                                  disabled={
                                    !selectedProjects[day]?.[product.id]
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableProducts
                                      .filter(
                                        (p) =>
                                          p.product_id ===
                                          parseInt(
                                            selectedProjects[day]?.[
                                              product.id
                                            ]?.toString() || "0"
                                          )
                                      )
                                      .map((prod) => (
                                        <SelectItem
                                          key={prod.id}
                                          value={prod.id.toString()}
                                        >
                                          {prod.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                {getProductRate(day, product.id)}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  value={
                                    productQuantities[day]?.[product.id] || 0
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      day,
                                      product.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-20"
                                  disabled={
                                    !selectedProducts[day]?.[product.id]
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {calculateProductTotal(day, product.id).toFixed(
                                  2
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-right font-bold"
                            >
                              Day Total:
                            </TableCell>
                            <TableCell className="font-bold">
                              {calculateDayTotal(day).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-4 text-right">
                <p className="text-lg font-bold">
                  Week Total: {calculateWeekTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              weekDays.every((day) =>
                Object.values(productQuantities[day] || {}).every(
                  (q) => q === 0
                )
              )
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Work Log"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
