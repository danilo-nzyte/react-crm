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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Check, X, Filter } from "lucide-react";
import Link from "next/link";
import {
  Project,
  WorkLog,
  WorkLogEntry,
  Engineer,
  GangEngineer,
} from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/**
 * WorkLogEntriesPage component for project managers to view and approve work log entries
 */
export default function WorkLogEntriesPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.id as string);

  // State for data
  const [project, setProject] = useState<Project | null>(null);
  const [workLog, setWorkLog] = useState<WorkLog | null>(null);
  const [workLogEntries, setWorkLogEntries] = useState<WorkLogEntry[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [gangEngineers, setGangEngineers] = useState<GangEngineer[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [showApproved, setShowApproved] = useState<boolean>(true);
  const [showUnapproved, setShowUnapproved] = useState<boolean>(true);

  // Load mock data
  useEffect(() => {
    // Mock projects data
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

    // Find the current project
    const currentProject = mockProjects.find((p) => p.id === projectId);
    if (currentProject) {
      setProject(currentProject);
    } else {
      // Handle project not found
      router.push("/projects");
      return;
    }

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
    ];

    // Mock work log entries
    const mockWorkLogEntries: WorkLogEntry[] = [
      {
        id: 1,
        name: "Alex Johnson - Cable Installation",
        date: "2023-05-15",
        engineer_id: 1,
        gang_id: 1,
        gang_engineer_id: 1,
        worklog_id: 1,
        customer_rate_card_product: 1,
        unit_sale: 5,
        unit_wage: 5,
        is_approved: true,
        is_deleted: false,
        created_at: "2023-05-15T10:30:00Z",
        modified_at: "2023-05-15T10:30:00Z",
      },
      {
        id: 2,
        name: "Alex Johnson - Network Configuration",
        date: "2023-05-15",
        engineer_id: 1,
        gang_id: 1,
        gang_engineer_id: 1,
        worklog_id: 1,
        customer_rate_card_product: 2,
        unit_sale: 3,
        unit_wage: 3,
        is_approved: false,
        is_deleted: false,
        created_at: "2023-05-15T14:20:00Z",
        modified_at: "2023-05-15T14:20:00Z",
      },
      {
        id: 3,
        name: "Sam Wilson - Cable Installation",
        date: "2023-05-16",
        engineer_id: 2,
        gang_id: 1,
        gang_engineer_id: 2,
        worklog_id: 1,
        customer_rate_card_product: 1,
        unit_sale: 4,
        unit_wage: 4,
        is_approved: false,
        is_deleted: false,
        created_at: "2023-05-16T09:15:00Z",
        modified_at: "2023-05-16T09:15:00Z",
      },
    ];

    // Find the work log for this project
    const currentWorkLog = mockWorkLogs.find(
      (w) => w.id === currentProject.work_log_id
    );
    if (currentWorkLog) {
      setWorkLog(currentWorkLog);

      // Filter entries for the current work log
      const filteredEntries = mockWorkLogEntries.filter(
        (entry) => entry.worklog_id === currentWorkLog.id
      );
      setWorkLogEntries(filteredEntries);
    } else {
      // Handle case where work log is not found
      setWorkLogEntries([]);
    }

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
        name: "Sam Wilson",
        is_deleted: false,
        created_at: "2023-01-02T00:00:00Z",
        modified_at: "2023-01-02T00:00:00Z",
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
    ];
    setGangEngineers(mockGangEngineers);
  }, [projectId, router]);

  /**
   * Format date string to a more readable format
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * Get engineer name by ID
   */
  const getEngineerName = (engineerId: number): string => {
    const engineer = engineers.find((e) => e.id === engineerId);
    return engineer ? engineer.name : "Unknown";
  };

  /**
   * Get gang engineer role by ID
   */
  const getGangEngineerRole = (gangEngineerId: number): string => {
    const gangEngineer = gangEngineers.find((ge) => ge.id === gangEngineerId);
    return gangEngineer ? gangEngineer.name : "Unknown";
  };

  /**
   * Toggle entry selection
   */
  const toggleEntrySelection = (entryId: number) => {
    if (selectedEntries.includes(entryId)) {
      setSelectedEntries(selectedEntries.filter((id) => id !== entryId));
    } else {
      setSelectedEntries([...selectedEntries, entryId]);
    }
  };

  /**
   * Filter entries based on approval status
   */
  const getFilteredEntries = () => {
    return workLogEntries.filter((entry) => {
      if (showApproved && entry.is_approved) return true;
      if (showUnapproved && !entry.is_approved) return true;
      return false;
    });
  };

  // Get filtered entries for use in the component
  const filteredEntries = getFilteredEntries();

  /**
   * Toggle all entries
   */
  const toggleAllEntries = () => {
    const currentFilteredEntries = getFilteredEntries();
    if (selectedEntries.length === currentFilteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(currentFilteredEntries.map((entry) => entry.id));
    }
  };

  /**
   * Approve selected entries
   */
  const approveSelectedEntries = () => {
    const updatedEntries = workLogEntries.map((entry) => {
      if (selectedEntries.includes(entry.id)) {
        return {
          ...entry,
          is_approved: true,
          modified_at: new Date().toISOString(),
        };
      }
      return entry;
    });

    setWorkLogEntries(updatedEntries);
    setSelectedEntries([]);

    toast.success(`${selectedEntries.length} entries have been approved.`);
  };

  /**
   * Reject selected entries
   */
  const rejectSelectedEntries = () => {
    // In a real app, you might want to add a reason for rejection
    // For now, we'll just mark them as deleted
    const updatedEntries = workLogEntries.map((entry) => {
      if (selectedEntries.includes(entry.id)) {
        return {
          ...entry,
          is_deleted: true,
          modified_at: new Date().toISOString(),
        };
      }
      return entry;
    });

    setWorkLogEntries(updatedEntries.filter((entry) => !entry.is_deleted));
    setSelectedEntries([]);

    toast.error(`${selectedEntries.length} entries have been rejected.`);
  };

  if (!project || !workLog) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <p>Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-2" asChild>
          <Link href={`/projects/${projectId}/work-log`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Work Log
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Work Log Entries</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{workLog.name}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem
                    checked={showApproved}
                    onCheckedChange={setShowApproved}
                  >
                    Show Approved
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={showUnapproved}
                    onCheckedChange={setShowUnapproved}
                  >
                    Show Unapproved
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={approveSelectedEntries}
                disabled={selectedEntries.length === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve Selected
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={rejectSelectedEntries}
                disabled={selectedEntries.length === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Reject Selected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredEntries.length > 0 &&
                      selectedEntries.length === filteredEntries.length
                    }
                    onCheckedChange={toggleAllEntries}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Engineer</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={() => toggleEntrySelection(entry.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{getEngineerName(entry.engineer_id)}</TableCell>
                    <TableCell>
                      {getGangEngineerRole(entry.gang_engineer_id)}
                    </TableCell>
                    <TableCell>{entry.unit_sale}</TableCell>
                    <TableCell>
                      {entry.is_approved ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(entry.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
