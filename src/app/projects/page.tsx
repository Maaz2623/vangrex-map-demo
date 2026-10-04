"use client";

import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import { Toaster } from "@/components/ui/sonner";

export default function ProjectsPage() {
  return (
    <>
      <Toaster />

      <main className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div
            id="ai-projects-toolbar"
            className="flex items-center justify-between gap-4"
          >
            <div>
              <h1 id="ai-projects-title" className="text-2xl font-bold">
                Projects
              </h1>
              <p id="ai-projects-description" className="text-muted-foreground">
                Manage your projects.
              </p>
            </div>

            <Button
              id="ai-projects-add-button"
              onClick={() => toast("Create project clicked")}
            >
              <Plus />
              New project
            </Button>
          </div>

          <Input
            id="ai-projects-search"
            placeholder="Search projects..."
            onChange={(e) => toast(`Searching: ${e.target.value}`)}
          />

          <div id="ai-projects-list" className="grid gap-4 md:grid-cols-2">
            <Card id="ai-project-alpha-card">
              <CardHeader id="ai-project-alpha-header">
                <div className="flex justify-between gap-4">
                  <div>
                    <CardTitle id="ai-project-alpha-title">Vangrex</CardTitle>
                    <CardDescription id="ai-project-alpha-description">
                      AI application platform
                    </CardDescription>
                  </div>

                  <Button
                    id="ai-project-alpha-more"
                    variant="ghost"
                    size="icon"
                    onClick={() => toast("Vangrex project actions")}
                  >
                    <MoreHorizontal />
                  </Button>
                </div>
              </CardHeader>

              <CardContent id="ai-project-alpha-content">
                <Badge
                  id="ai-project-alpha-status"
                  className="cursor-pointer"
                  onClick={() => toast("Vangrex status clicked")}
                >
                  Active
                </Badge>
              </CardContent>

              <CardFooter id="ai-project-alpha-footer">
                <Button
                  id="ai-project-alpha-open"
                  onClick={() => toast("Opening Vangrex project")}
                >
                  Open project
                </Button>
              </CardFooter>
            </Card>

            <Card id="ai-project-beta-card">
              <CardHeader id="ai-project-beta-header">
                <CardTitle id="ai-project-beta-title">Analytics</CardTitle>
                <CardDescription id="ai-project-beta-description">
                  Internal analytics dashboard
                </CardDescription>
              </CardHeader>

              <CardContent id="ai-project-beta-content">
                <Badge
                  id="ai-project-beta-status"
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toast("Analytics status clicked")}
                >
                  Draft
                </Badge>
              </CardContent>

              <CardFooter id="ai-project-beta-footer">
                <Button
                  id="ai-project-beta-open"
                  variant="outline"
                  onClick={() => toast("Opening Analytics project")}
                >
                  Open project
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
