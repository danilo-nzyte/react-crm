"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gang } from "@/types";
import { useRouter } from "next/navigation";
import { ArrowRight, Users } from "lucide-react";

/**
 * EngineerPortal component for engineers to access their work logging interface
 * Mobile-optimized for field use
 */
export default function EngineerPortal() {
  const router = useRouter();
  const [gangs, setGangs] = useState<Gang[]>([]);
  const [selectedGang, setSelectedGang] = useState<string>("");

  // Load gangs data
  useEffect(() => {
    // Mock data loading - in a real app, this would be an API call
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

    setGangs(mockGangs);
  }, []);

  /**
   * Handle gang selection change
   */
  const handleGangChange = (value: string) => {
    setSelectedGang(value);
  };

  /**
   * Continue to work log page
   */
  const handleContinue = () => {
    router.push(`/engineer-portal/log-work?gangId=${selectedGang}`);
  };

  return (
    <div className="container max-w-md mx-auto py-6 px-4 flex items-center justify-center min-h-screen">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl text-center">Engineer Portal</CardTitle>
          <CardDescription className="text-center">
            Log your gang's daily work activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Gang</label>
            <Select value={selectedGang} onValueChange={handleGangChange}>
              <SelectTrigger className="w-full">
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
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedGang}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
