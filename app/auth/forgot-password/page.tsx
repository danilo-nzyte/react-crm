"use client";

/**
 * Forgot Password page component
 * Handles password reset request with form validation
 */
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";

// ShadCN UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

// Infer the type from the schema
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password page component
 * Provides a form for requesting password reset
 */
export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * Handle form submission
   * @param data - Form values
   */
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      // In development mode with mock auth, just simulate success
      if (process.env.NODE_ENV === "development") {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        showToast.success("Password reset instructions sent to your email");
        return;
      }

      // Call forgot password API
      await api.post("/auth/forgot-password", {
        email: data.email,
      });

      setIsSubmitted(true);
      showToast.success("Password reset instructions sent to your email");
    } catch (error) {
      console.error("Forgot password error:", error);
      showToast.error("Failed to send reset instructions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email to receive password reset instructions"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We've sent password reset instructions to your email address.
                  Please check your inbox and follow the link to reset your
                  password.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you don't receive an email within a few minutes, please
                  check your spam folder or try again.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register("email")}
                    disabled={isSubmitting}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Sending instructions..."
                    : "Send reset instructions"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
