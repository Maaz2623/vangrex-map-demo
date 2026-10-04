"use client";

import { Activity, Bell, Folder, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardPage() {
  return (
    <>
      <Toaster />

      <main className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Card id="ai-dashboard-card">
            <CardHeader id="ai-dashboard-header">
              <CardTitle id="ai-dashboard-title">Dashboard</CardTitle>
              <CardDescription id="ai-dashboard-description">
                Overview of your application.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent
              id="ai-dashboard-content"
              className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-4"
            >
              <Card id="ai-dashboard-projects-card">
                <CardHeader id="ai-dashboard-projects-header">
                  <Folder />
                  <CardTitle id="ai-dashboard-projects-title">
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent id="ai-dashboard-projects-content">
                  <p
                    id="ai-dashboard-projects-count"
                    className="text-3xl font-bold"
                  >
                    12
                  </p>
                </CardContent>
              </Card>

              <Card id="ai-dashboard-customers-card">
                <CardHeader id="ai-dashboard-customers-header">
                  <Users />
                  <CardTitle id="ai-dashboard-customers-title">
                    Customers
                  </CardTitle>
                </CardHeader>
                <CardContent id="ai-dashboard-customers-content">
                  <p
                    id="ai-dashboard-customers-count"
                    className="text-3xl font-bold"
                  >
                    248
                  </p>
                </CardContent>
              </Card>

              <Card id="ai-dashboard-activity-card">
                <CardHeader id="ai-dashboard-activity-header">
                  <Activity />
                  <CardTitle id="ai-dashboard-activity-title">
                    Activity
                  </CardTitle>
                </CardHeader>
                <CardContent id="ai-dashboard-activity-content">
                  <Badge
                    id="ai-dashboard-activity-status"
                    className="cursor-pointer"
                    onClick={() => toast("Activity status clicked")}
                  >
                    Active
                  </Badge>
                </CardContent>
              </Card>

              <Card id="ai-dashboard-progress-card">
                <CardHeader id="ai-dashboard-progress-header">
                  <CardTitle id="ai-dashboard-progress-title">
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent
                  id="ai-dashboard-progress-content"
                  className="space-y-2"
                >
                  <Progress id="ai-dashboard-progress" value={72} />
                  <p
                    id="ai-dashboard-progress-label"
                    className="text-sm text-muted-foreground"
                  >
                    72% complete
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
