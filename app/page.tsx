import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Users, Package, FileText, Briefcase } from "lucide-react";

/**
 * Home page component
 * Displays a dashboard with quick access to main features
 */
export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to React CRM</h1>
        <p className="text-muted-foreground">
          Manage your customers, products, rate cards, and projects all in one
          place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Customers</CardTitle>
            <CardDescription>Manage your customer database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Users className="h-8 w-8 text-primary" />
              <Button asChild>
                <Link href="/customers">View Customers</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Products</CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Package className="h-8 w-8 text-primary" />
              <Button asChild>
                <Link href="/products">View Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Rate Cards</CardTitle>
            <CardDescription>Manage customer pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <FileText className="h-8 w-8 text-primary" />
              <Button asChild>
                <Link href="/rate-cards">View Rate Cards</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Projects</CardTitle>
            <CardDescription>Manage customer projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Briefcase className="h-8 w-8 text-primary" />
              <Button asChild>
                <Link href="/projects">View Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
