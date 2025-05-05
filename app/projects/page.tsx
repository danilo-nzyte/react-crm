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
  ClipboardList,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  Project,
  WorkLog,
  ProjectStatus,
  CustomerRateCard,
  Gang,
} from "@/types";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

/**
 * ProjectsPage component for managing project data
 * Provides CRUD functionality for projects
 */
export default function ProjectsPage() {
  // State for project data and UI controls
  const [projects, setProjects] = useState<Project[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "planned" as ProjectStatus,
    work_log_id: 0,
  });
  const [isCreateWorkLogDialogOpen, setIsCreateWorkLogDialogOpen] =
    useState<boolean>(false);
  const [workLogFormData, setWorkLogFormData] = useState({
    name: "",
    customer_rate_card_id: 0,
    gang_id: 0,
  });
  const [customerRateCards, setCustomerRateCards] = useState<
    CustomerRateCard[]
  >([]);
  const [gangs, setGangs] = useState<Gang[]>([]);
  const router = useRouter();

  /**
   * Load mock project data on component mount
   * In a real application, this would fetch data from an API
   */
  useEffect(() => {
    // Mock work logs data
    const mockWorkLogs: WorkLog[] = [
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
    setWorkLogs(mockWorkLogs);

    // Mock projects data
    setProjects([
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
      {
        id: 4,
        name: "Cloud Migration Initiative",
        status: "planned",
        work_log_id: 0,
        is_deleted: false,
        created_at: "2023-01-08T00:00:00Z",
        modified_at: "2023-01-08T00:00:00Z",
      },
    ]);

    // Mock customer rate cards data
    const mockCustomerRateCards: CustomerRateCard[] = [
      {
        id: 1,
        name: "Acme Corp Standard Rates",
        customer_id: 1,
        is_deleted: false,
        created_at: "2023-01-01T00:00:00Z",
        modified_at: "2023-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Globex Premium Rates",
        customer_id: 2,
        is_deleted: false,
        created_at: "2023-01-02T00:00:00Z",
        modified_at: "2023-01-02T00:00:00Z",
      },
      {
        id: 3,
        name: "Initech Basic Rates",
        customer_id: 3,
        is_deleted: false,
        created_at: "2023-01-03T00:00:00Z",
        modified_at: "2023-01-03T00:00:00Z",
      },
    ];
    setCustomerRateCards(mockCustomerRateCards);

    // Mock gangs data
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
      {
        id: 3,
        name: "Gamma Group",
        is_deleted: false,
        created_at: "2023-01-03T00:00:00Z",
        modified_at: "2023-01-03T00:00:00Z",
      },
    ];
    setGangs(mockGangs);
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
   * Handle status select change
   * @param value - Selected status value
   */
  const handleStatusSelectChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as ProjectStatus,
    });
  };

  /**
   * Handle work log select change
   * @param value - Selected work log ID
   */
  const handleWorkLogSelectChange = (value: string) => {
    setFormData({
      ...formData,
      work_log_id: parseInt(value),
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
   * Get the work log name for a given work log ID
   * @param workLogId - Work log ID
   * @returns Work log name or "N/A" if not found
   */
  const getWorkLogName = (workLogId: number): string => {
    const workLog = workLogs.find((wl) => wl.id === workLogId);
    return workLog ? workLog.name : "N/A";
  };

  /**
   * Get the appropriate badge variant based on project status
   * @param status - Project status
   * @returns Badge variant
   */
  const getStatusBadgeVariant = (
    status: ProjectStatus
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "planned":
        return "outline";
      case "started":
        return "secondary";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };

  /**
   * Validate project form data
   * @returns Object with validation result and error message
   */
  const validateProjectForm = (): {
    isValid: boolean;
    errorMessage: string;
  } => {
    if (!formData.name.trim()) {
      return { isValid: false, errorMessage: "Project name is required." };
    }

    if (!formData.work_log_id) {
      return { isValid: false, errorMessage: "Work log is required." };
    }

    return { isValid: true, errorMessage: "" };
  };

  /**
   * Handle adding a new project
   */
  const handleAddProject = () => {
    const validation = validateProjectForm();
    if (!validation.isValid) {
      // In a real app, you would show the error message to the user
      console.error(validation.errorMessage);
      return;
    }

    // Create new project
    const newProject: Project = {
      id: Math.floor(Math.random() * 1000), // In a real app, this would be generated by the backend
      name: formData.name,
      status: formData.status,
      work_log_id: formData.work_log_id,
      is_deleted: false,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };

    // Add to projects list
    setProjects([...projects, newProject]);

    // Reset form and close dialog
    setFormData({
      name: "",
      status: "planned",
      work_log_id: 0,
    });
    setIsAddDialogOpen(false);
  };

  /**
   * Open the edit dialog for a project
   * @param project - Project to edit
   */
  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      status: project.status,
      work_log_id: project.work_log_id,
    });
    setIsEditDialogOpen(true);
  };

  /**
   * Handle editing a project
   */
  const handleEditProject = () => {
    const validation = validateProjectForm();
    if (!validation.isValid || !currentProject) {
      console.error(validation.errorMessage);
      return;
    }

    // Update project in the list
    const updatedProjects = projects.map((project) =>
      project.id === currentProject.id
        ? {
            ...project,
            name: formData.name,
            status: formData.status,
            work_log_id: formData.work_log_id,
            modified_at: new Date().toISOString(),
          }
        : project
    );

    setProjects(updatedProjects);
    setIsEditDialogOpen(false);
  };

  /**
   * Open the delete dialog for a project
   * @param project - Project to delete
   */
  const openDeleteDialog = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Handle deleting a project
   */
  const handleDeleteProject = () => {
    if (!currentProject) return;

    // In a real app, you would call an API to delete the project
    // Here we're just filtering it out of our local state
    const updatedProjects = projects.filter(
      (project) => project.id !== currentProject.id
    );

    setProjects(updatedProjects);
    setIsDeleteDialogOpen(false);
  };

  /**
   * Renders a button to view or create a work log based on whether the project has one
   * @param project - The project to render the button for
   */
  const renderWorkLogButton = (project: Project) => {
    if (project.work_log_id) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          asChild
        >
          <Link href={`/projects/${project.id}/work-log`}>
            <ClipboardList className="h-4 w-4 mr-1" />
            View Work Log
          </Link>
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => openCreateWorkLogDialog(project)}
        >
          <FileText className="h-4 w-4 mr-1" />
          Create Work Log
        </Button>
      );
    }
  };

  /**
   * Opens the create work log dialog for a project
   * @param project - The project to create a work log for
   */
  const openCreateWorkLogDialog = (project: Project) => {
    setCurrentProject(project);
    setWorkLogFormData({
      name: `${project.name} Work Log`,
      customer_rate_card_id:
        customerRateCards.length > 0 ? customerRateCards[0].id : 0,
      gang_id: gangs.length > 0 ? gangs[0].id : 0,
    });
    setIsCreateWorkLogDialogOpen(true);
  };

  /**
   * Handles creating a new work log for a project
   */
  const handleCreateWorkLog = () => {
    if (!currentProject) return;

    // In a real app, this would be an API call
    const newWorkLog: WorkLog = {
      id: Math.floor(Math.random() * 1000) + 10, // Ensure unique ID
      name: workLogFormData.name,
      customer_rate_card_id: workLogFormData.customer_rate_card_id,
      gang_id: workLogFormData.gang_id,
      is_deleted: false,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };

    // Add the new work log to the list
    setWorkLogs([...workLogs, newWorkLog]);

    // Update the project with the new work log ID
    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? { ...p, work_log_id: newWorkLog.id } : p
    );

    setProjects(updatedProjects);
    setIsCreateWorkLogDialogOpen(false);

    // Navigate to the new work log page
    router.push(`/projects/${currentProject.id}/work-log`);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your projects and their status
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Project</DialogTitle>
                  <DialogDescription>
                    Create a new project with a work log.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Project Name
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
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={formData.status}
                        onValueChange={handleStatusSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="started">Started</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="work_log_id" className="text-right">
                      Work Log
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={
                          formData.work_log_id
                            ? formData.work_log_id.toString()
                            : ""
                        }
                        onValueChange={handleWorkLogSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select work log" />
                        </SelectTrigger>
                        <SelectContent>
                          {workLogs.map((workLog) => (
                            <SelectItem
                              key={workLog.id}
                              value={workLog.id.toString()}
                            >
                              {workLog.name}
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
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddProject}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Work Log</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getWorkLogName(project.work_log_id)}</TableCell>
                  <TableCell>{formatDate(project.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {renderWorkLogButton(project)}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => openDeleteDialog(project)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No projects found. Add a project to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Project Name
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
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.status}
                  onValueChange={handleStatusSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="started">Started</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-work_log_id" className="text-right">
                Work Log
              </Label>
              <div className="col-span-3">
                <Select
                  value={
                    formData.work_log_id ? formData.work_log_id.toString() : ""
                  }
                  onValueChange={handleWorkLogSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work log" />
                  </SelectTrigger>
                  <SelectContent>
                    {workLogs.map((workLog) => (
                      <SelectItem
                        key={workLog.id}
                        value={workLog.id.toString()}
                      >
                        {workLog.name}
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
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentProject?.name}? This
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
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Work Log Dialog */}
      <Dialog
        open={isCreateWorkLogDialogOpen}
        onOpenChange={setIsCreateWorkLogDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Work Log</DialogTitle>
            <DialogDescription>
              Create a new work log for {currentProject?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="worklog-name" className="text-right">
                Work Log Name
              </Label>
              <Input
                id="worklog-name"
                name="name"
                value={workLogFormData.name}
                onChange={(e) =>
                  setWorkLogFormData({
                    ...workLogFormData,
                    name: e.target.value,
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer_rate_card_id" className="text-right">
                Customer Rate Card
              </Label>
              <div className="col-span-3">
                <Select
                  value={workLogFormData.customer_rate_card_id.toString()}
                  onValueChange={(value) =>
                    setWorkLogFormData({
                      ...workLogFormData,
                      customer_rate_card_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer rate card" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerRateCards.map((card) => (
                      <SelectItem key={card.id} value={card.id.toString()}>
                        {card.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gang_id" className="text-right">
                Gang
              </Label>
              <div className="col-span-3">
                <Select
                  value={workLogFormData.gang_id.toString()}
                  onValueChange={(value) =>
                    setWorkLogFormData({
                      ...workLogFormData,
                      gang_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gang" />
                  </SelectTrigger>
                  <SelectContent>
                    {gangs.map((gang) => (
                      <SelectItem key={gang.id} value={gang.id.toString()}>
                        {gang.name}
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
              onClick={() => setIsCreateWorkLogDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateWorkLog}>Create Work Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
