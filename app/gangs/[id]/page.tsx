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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Gang, Engineer, GangEngineer } from "@/types";

/**
 * GangDetailPage component for managing engineers in a gang
 */
export default function GangDetailPage() {
  const router = useRouter();
  const params = useParams();
  const gangId = parseInt(params.id as string);

  // State for gang data and UI controls
  const [gang, setGang] = useState<Gang | null>(null);
  const [gangEngineers, setGangEngineers] = useState<GangEngineer[]>([]);
  const [availableEngineers, setAvailableEngineers] = useState<Engineer[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentGangEngineer, setCurrentGangEngineer] =
    useState<GangEngineer | null>(null);
  const [formData, setFormData] = useState({
    engineerId: 0,
    name: "",
    engineer_share: 1.0,
  });

  /**
   * Load mock data on component mount
   * In a real application, this would fetch data from an API
   */
  useEffect(() => {
    // Mock gangs data
    const gangs: Gang[] = [
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
      {
        id: 3,
        name: "Gamma Group",
        is_deleted: false,
        created_at: "2023-01-03T00:00:00Z",
        modified_at: "2023-01-03T00:00:00Z",
      },
    ];

    // Find the current gang
    const currentGang = gangs.find((g) => g.id === gangId);
    if (currentGang) {
      setGang(currentGang);
    } else {
      // Handle gang not found
      router.push("/gangs");
      return;
    }

    // Mock engineers data
    const allEngineers: Engineer[] = [
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
      {
        id: 4,
        name: "Sarah Wilson",
        is_deleted: false,
        created_at: "2023-01-04T00:00:00Z",
        modified_at: "2023-01-04T00:00:00Z",
      },
      {
        id: 5,
        name: "James Brown",
        is_deleted: false,
        created_at: "2023-01-05T00:00:00Z",
        modified_at: "2023-01-05T00:00:00Z",
      },
    ];

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
        engineer: allEngineers.find((e) => e.id === 1),
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
        engineer: allEngineers.find((e) => e.id === 2),
      },
    ];

    // Filter gang engineers for the current gang
    const filteredGangEngineers = mockGangEngineers.filter(
      (ge) => ge.gang_id === gangId
    );
    setGangEngineers(filteredGangEngineers);

    // Filter available engineers (those not already in the gang)
    const assignedEngineerIds = filteredGangEngineers.map(
      (ge) => ge.engineer_id
    );
    const filteredAvailableEngineers = allEngineers.filter(
      (e) => !assignedEngineerIds.includes(e.id)
    );
    setAvailableEngineers(filteredAvailableEngineers);
  }, [gangId, router]);

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
   * Handle select changes for engineer
   * @param value - Selected engineer ID
   */
  const handleEngineerSelectChange = (value: string) => {
    const engineerId = parseInt(value);
    const engineer = availableEngineers.find((e) => e.id === engineerId);

    setFormData({
      ...formData,
      engineerId,
      name: engineer ? `${engineer.name}'s Role` : "",
    });
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
   * Validate gang engineer form data
   * @returns Object with validation result and error message
   */
  const validateGangEngineerForm = (): {
    isValid: boolean;
    errorMessage: string;
  } => {
    if (!formData.engineerId) {
      return { isValid: false, errorMessage: "Engineer is required." };
    }

    if (!formData.name.trim()) {
      return { isValid: false, errorMessage: "Role name is required." };
    }

    if (formData.engineer_share <= 0) {
      return {
        isValid: false,
        errorMessage: "Engineer share must be greater than 0.",
      };
    }

    return { isValid: true, errorMessage: "" };
  };

  /**
   * Handle adding an engineer to the gang
   */
  const handleAddEngineerToGang = () => {
    if (!gang) return;

    const validation = validateGangEngineerForm();
    if (!validation.isValid) {
      // In a real app, you would show the error message to the user
      console.error(validation.errorMessage);
      return;
    }

    // Find the selected engineer
    const selectedEngineer = availableEngineers.find(
      (e) => e.id === formData.engineerId
    );
    if (!selectedEngineer) {
      console.error("Selected engineer not found");
      return;
    }

    // Create new gang engineer
    const newGangEngineer: GangEngineer = {
      id: Math.floor(Math.random() * 1000), // In a real app, this would be generated by the backend
      name: formData.name,
      gang_id: gang.id,
      engineer_id: selectedEngineer.id,
      engineer_share: formData.engineer_share,
      is_deleted: false,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      engineer: selectedEngineer,
    };

    // Add to gang engineers list
    setGangEngineers([...gangEngineers, newGangEngineer]);

    // Remove from available engineers
    setAvailableEngineers(
      availableEngineers.filter((e) => e.id !== selectedEngineer.id)
    );

    // Reset form and close dialog
    setFormData({
      engineerId: 0,
      name: "",
      engineer_share: 1.0,
    });
    setIsAddDialogOpen(false);
  };

  /**
   * Open the delete dialog for a gang engineer
   * @param gangEngineer - The gang engineer to delete
   */
  const openDeleteDialog = (gangEngineer: GangEngineer) => {
    setCurrentGangEngineer(gangEngineer);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Handle removing an engineer from the gang
   */
  const handleRemoveEngineerFromGang = () => {
    if (!currentGangEngineer || !currentGangEngineer.engineer) return;

    // Remove from gang engineers list
    const updatedGangEngineers = gangEngineers.filter(
      (ge) => ge.id !== currentGangEngineer.id
    );
    setGangEngineers(updatedGangEngineers);

    // Add back to available engineers
    setAvailableEngineers([
      ...availableEngineers,
      currentGangEngineer.engineer,
    ]);

    setIsDeleteDialogOpen(false);
  };

  if (!gang) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Loading gang details...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/gangs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gangs
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{gang.name}</CardTitle>
              <CardDescription>
                Manage engineers assigned to this gang
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              disabled={availableEngineers.length === 0}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Assign Engineer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engineer Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Share</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gangEngineers.map((gangEngineer) => (
                <TableRow key={gangEngineer.id}>
                  <TableCell className="font-medium">
                    {gangEngineer.engineer?.name}
                  </TableCell>
                  <TableCell>{gangEngineer.name}</TableCell>
                  <TableCell>
                    {gangEngineer.engineer_share.toFixed(2)}
                  </TableCell>
                  <TableCell>{formatDate(gangEngineer.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(gangEngineer)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {gangEngineers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No engineers assigned to this gang. Assign engineers to get
                    started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Engineer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Engineer to Gang</DialogTitle>
            <DialogDescription>
              Add an engineer to {gang.name} with a specific role and share.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="engineerId" className="text-right">
                Engineer
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.engineerId.toString()}
                  onValueChange={handleEngineerSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEngineers.map((engineer) => (
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Role Name
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
              <Label htmlFor="engineer_share" className="text-right">
                Engineer Share
              </Label>
              <Input
                id="engineer_share"
                name="engineer_share"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.engineer_share}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEngineerToGang}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              {currentGangEngineer?.engineer?.name} from {gang.name}? This
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
            <Button
              variant="destructive"
              onClick={handleRemoveEngineerFromGang}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
