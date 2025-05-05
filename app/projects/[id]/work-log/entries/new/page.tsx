"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import Link from "next/link";
import {
  Project,
  WorkLog,
  WorkLogProduct,
  WorkLogEntry,
  Engineer,
  Gang,
  GangEngineer,
  CustomerRateCardProduct,
} from "@/types";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * NewWorkLogEntryPage component for creating new work log entries
 */
export default function NewWorkLogEntryPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.id as string);

  // State for data and UI controls
  const [project, setProject] = useState<Project | null>(null);
  const [workLog, setWorkLog] = useState<WorkLog | null>(null);
  const [workLogProducts, setWorkLogProducts] = useState<WorkLogProduct[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [gangEngineers, setGangEngineers] = useState<GangEngineer[]>([]);
  const [customerRateCardProducts, setCustomerRateCardProducts] = useState<
    CustomerRateCardProduct[]
  >([]);
  const [formData, setFormData] = useState<{
    name: string;
    date: string;
    engineer_id: number;
    gang_engineer_id: number;
    customer_rate_card_product: number;
    unit_sale: number;
    unit_wage: number;
    is_approved: boolean;
  }>({
    name: "",
    date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    engineer_id: 0,
    gang_engineer_id: 0,
    customer_rate_card_product: 0,
    unit_sale: 0,
    unit_wage: 0,
    is_approved: false,
  });

  /**
   * Load mock data on component mount
   * In a real application, this would fetch data from an API
   */
  useEffect(() => {
    // Mock projects data
    const projects: Project[] = [
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
      {
        id: 3,
        name: "Office Relocation",
        status: "completed",
        work_log_id: 3,
        is_deleted: false,
        created_at: "2023-01-07T00:00:00Z",
        modified_at: "2023-01-07T00:00:00Z",
      },
    ];

    // Find the current project
    const currentProject = projects.find((p) => p.id === projectId);
    if (currentProject) {
      setProject(currentProject);
    } else {
      // Handle project not found
      router.push("/projects");
      return;
    }

    // Mock work logs data
    const workLogs: WorkLog[] = [
      {
        id: 1,
        name: "Acme Corp - Alpha Team",
        customer_rate_card_id: 1,
        gang_id: 1,
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Globex - Beta Squad",
        customer_rate_card_id: 2,
        gang_id: 2,
        is_deleted: false,
        created_at: "2023-01-02T00:00:00Z",
        modified_at: "2023-01-02T00:00:00Z",
      },
      {
        id: 3,
        name: "Initech - Gamma Group",
        customer_rate_card_id: 3,
        gang_id: 3,
        is_deleted: false,
        created_at: "2023-01-03T00:00:00Z",
        modified_at: "2023-01-03T00:00:00Z",
      },
    ];

    // Find the work log for this project
    const currentWorkLog = workLogs.find(
      (wl) => wl.id === currentProject.work_log_id
    );
    if (currentWorkLog) {
      setWorkLog(currentWorkLog);
    }

    // Mock work log products data
    const mockWorkLogProducts: WorkLogProduct[] = [
      {
        id: 1,
        name: "Basic Installation",
        worklog_id: 1,
        customer_rate_card_product_id: 1,
        is_deleted: false,
        created_at: "2023-01-10T00:00:00Z",
        modified_at: "2023-01-10T00:00:00Z",
      },
      {
        id: 2,
        name: "Premium Support",
        worklog_id: 1,
        customer_rate_card_product_id: 2,
        is_deleted: false,
        created_at: "2023-01-11T00:00:00Z",
        modified_at: "2023-01-11T00:00:00Z",
      },
      {
        id: 3,
        name: "System Maintenance",
        worklog_id: 2,
        customer_rate_card_product_id: 3,
        is_deleted: false,
        created_at: "2023-01-12T00:00:00Z",
        modified_at: "2023-01-12T00:00:00Z",
      },
    ];

    // Filter work log products for the current work log
    const filteredWorkLogProducts = mockWorkLogProducts.filter(
      (wlp) => wlp.worklog_id === currentProject.work_log_id
    );
    setWorkLogProducts(filteredWorkLogProducts);

    // Mock customer rate card products data
    const mockCustomerRateCardProducts: CustomerRateCardProduct[] = [
      {
        id: 1,
        name: "Basic Installation",
        customer_rate_card_id: 1,
        product_id: 1,
        product_name: "Basic Installation",
        cass_rate: 50.0,
        engineer_rate: 25.0,
        reference_1: "INST-001",
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Premium Support",
        customer_rate_card_id: 1,
        product_id: 2,
        product_name: "Premium Support",
        cass_rate: 75.0,
        engineer_rate: 35.0,
        reference_1: "SUPP-002",
        is_deleted: false,
        created_at: "2023-01-02T00:00:00Z",
        modified_at: "2023-01-02T00:00:00Z",
      },
      {
        id: 3,
        name: "System Maintenance",
        customer_rate_card_id: 2,
        product_id: 3,
        product_name: "System Maintenance",
        cass_rate: 60.0,
        engineer_rate: 30.0,
        reference_1: "MAINT-003",
        is_deleted: false,
        created_at: "2023-01-03T00:00:00Z",
        modified_at: "2023-01-03T00:00:00Z",
      },
    ];
    setCustomerRateCardProducts(mockCustomerRateCardProducts);

    // Mock engineers data
    const mockEngineers: Engineer[] = [
      {
        id: 1,
        name: "Alex Johnson",
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Maria Garcia",
        is_deleted: false,
        created_at: "2023-01-02T00:00:00Z",
        modified_at: "2023-01-02T00:00:00Z",
      },
      {
        id: 3,
        name: "David Kim",
        is_deleted: false,
        created_at: "2023-01-03T00:00:00Z",
        modified_at: "2023-01-03T00:00:00Z",
      },
    ];
    setEngineers(mockEngineers);

    // Mock gang engineers data
    const mockGangEngineers: GangEngineer[] = [
      {
        id: 1,
        name: "Lead Engineer",
        gang_id: 1,
        engineer_id: 1,
        engineer_share: 1.2,
        is_deleted: false,
        created_at: "2023-01-10T00:00:00Z",
        modified_at: "2023-01-10T00:00:00Z",
        engineer: mockEngineers.find((e) => e.id === 1),
      },
      {
        id: 2,
        name: "Senior Engineer",
        gang_id: 1,
        engineer_id: 2,
        engineer_share: 1.0,
        is_deleted: false,
        created_at: "2023-01-11T00:00:00Z",
        modified_at: "2023-01-11T00:00:00Z",
        engineer: mockEngineers.find((e) => e.id === 2),
      },
      {
        id: 3,
        name: "Junior Engineer",
        gang_id: 2,
        engineer_id: 3,
        engineer_share: 0.8,
        is_deleted: false,
        created_at: "2023-01-12T00:00:00Z",
        modified_at: "2023-01-12T00:00:00Z",
        engineer: mockEngineers.find((e) => e.id === 3),
      },
    ];

    // Filter gang engineers for the current work log's gang
    if (currentWorkLog) {
      const filteredGangEngineers = mockGangEngineers.filter(
        (ge) => ge.gang_id === currentWorkLog.gang_id
      );
      setGangEngineers(filteredGangEngineers);
    }
  }, [projectId, router]);

  /**
   * Handle form input changes
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Handle numeric inputs
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  /**
   * Handle select changes
   * @param name - Field name
   * @param value - Selected value
   */
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: parseInt(value),
    });

    // If engineer is selected, auto-select their gang engineer role if available
    if (name === "engineer_id") {
      const engineerId = parseInt(value);
      const matchingGangEngineer = gangEngineers.find(
        (ge) => ge.engineer_id === engineerId
      );

      if (matchingGangEngineer) {
        setFormData((prev) => ({
          ...prev,
          gang_engineer_id: matchingGangEngineer.id,
        }));
      }
    }

    // If product is selected, set default unit values
    if (name === "customer_rate_card_product") {
      const productId = parseInt(value);
      const product = customerRateCardProducts.find((p) => p.id === productId);

      if (product) {
        setFormData((prev) => ({
          ...prev,
          unit_sale: product.cass_rate,
          unit_wage: product.engineer_rate,
        }));
      }
    }
  };

  /**
   * Handle checkbox changes
   * @param checked - Checkbox state
   */
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_approved: checked,
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      alert("Please enter a name for this entry.");
      return;
    }

    if (!formData.date) {
      alert("Please select a date.");
      return;
    }

    if (!formData.engineer_id) {
      alert("Please select an engineer.");
      return;
    }

    if (!formData.customer_rate_card_product) {
      alert("Please select a product.");
      return;
    }

    // In a real application, this would send data to an API
    console.log("Creating work log entry:", {
      ...formData,
      worklog_id: workLog?.id,
      gang_id: workLog?.gang_id,
    });

    // Navigate back to the work log page
    router.push(`/projects/${projectId}/work-log`);
  };

  /**
   * Get customer rate card product by ID
   * @param id - Product ID
   * @returns CustomerRateCardProduct or undefined
   */
  const getCustomerRateCardProduct = (
    id: number
  ): CustomerRateCardProduct | undefined => {
    return customerRateCardProducts.find((p) => p.id === id);
  };

  /**
   * Get gang engineer by ID
   * @param id - Gang engineer ID
   * @returns GangEngineer or undefined
   */
  const getGangEngineer = (id: number): GangEngineer | undefined => {
    return gangEngineers.find((ge) => ge.id === id);
  };

  if (!project || !workLog) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${projectId}/work-log`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Work Log
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Work Log Entry</CardTitle>
          <CardDescription>
            Record work completed for {project.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Entry Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engineer_id">Engineer</Label>
                  <Select
                    value={formData.engineer_id.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("engineer_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineers.map((engineer) => (
                        <SelectItem
                          key={engineer.id}
                          value={engineer.id.toString()}
                        >
                          {engineer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gang_engineer_id">Engineer Role</Label>
                  <Select
                    value={formData.gang_engineer_id.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("gang_engineer_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {gangEngineers.map((gangEngineer) => (
                        <SelectItem
                          key={gangEngineer.id}
                          value={gangEngineer.id.toString()}
                        >
                          {gangEngineer.name} ({gangEngineer.engineer?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_rate_card_product">Product</Label>
                  <Select
                    value={formData.customer_rate_card_product.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("customer_rate_card_product", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {workLogProducts.map((product) => {
                        const rateCardProduct = getCustomerRateCardProduct(
                          product.customer_rate_card_product_id
                        );
                        return (
                          <SelectItem
                            key={product.id}
                            value={rateCardProduct?.id.toString() || ""}
                          >
                            {product.name} - £
                            {rateCardProduct?.cass_rate.toFixed(2)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_sale">Unit Sale Rate (£)</Label>
                  <Input
                    id="unit_sale"
                    name="unit_sale"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_sale}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_wage">Unit Wage Rate (£)</Label>
                  <Input
                    id="unit_wage"
                    name="unit_wage"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_wage}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox
                    id="is_approved"
                    checked={formData.is_approved}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="is_approved">Mark as approved</Label>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${projectId}/work-log`)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Entry
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
