"use client";

import { Save } from "lucide-react";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";

export default function SettingsPage() {
  return (
    <>
      <Toaster />

      <main className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-2xl">
          <Card id="ai-settings-card">
            <CardHeader id="ai-settings-header">
              <CardTitle id="ai-settings-title">Settings</CardTitle>
              <CardDescription id="ai-settings-description">
                Configure your application.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent id="ai-settings-content" className="space-y-6 pt-6">
              <div id="ai-settings-profile-section" className="space-y-4">
                <h2 id="ai-settings-profile-title" className="font-semibold">
                  Profile
                </h2>

                <div id="ai-settings-name-field" className="space-y-2">
                  <Label
                    id="ai-settings-name-label"
                    htmlFor="ai-settings-name-input"
                  >
                    Name
                  </Label>

                  <Input
                    id="ai-settings-name-input"
                    defaultValue="Maaz"
                    onChange={(e) => toast(`Name changed: ${e.target.value}`)}
                  />
                </div>

                <div id="ai-settings-email-field" className="space-y-2">
                  <Label
                    id="ai-settings-email-label"
                    htmlFor="ai-settings-email-input"
                  >
                    Email
                  </Label>

                  <Input
                    id="ai-settings-email-input"
                    defaultValue="maaz@example.com"
                    onChange={(e) => toast(`Email changed: ${e.target.value}`)}
                  />
                </div>
              </div>

              <Separator />

              <div id="ai-settings-preferences-section" className="space-y-4">
                <h2
                  id="ai-settings-preferences-title"
                  className="font-semibold"
                >
                  Preferences
                </h2>

                <div
                  id="ai-settings-notifications-row"
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <Label
                      id="ai-settings-notifications-label"
                      htmlFor="ai-settings-notifications"
                    >
                      Notifications
                    </Label>

                    <p
                      id="ai-settings-notifications-description"
                      className="text-sm text-muted-foreground"
                    >
                      Receive application notifications.
                    </p>
                  </div>

                  <Switch
                    id="ai-settings-notifications"
                    onCheckedChange={(checked) =>
                      toast(`Notifications: ${checked}`)
                    }
                  />
                </div>

                <div
                  id="ai-settings-activity-row"
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <Label
                      id="ai-settings-activity-label"
                      htmlFor="ai-settings-activity"
                    >
                      Activity tracking
                    </Label>

                    <p
                      id="ai-settings-activity-description"
                      className="text-sm text-muted-foreground"
                    >
                      Track activity across the application.
                    </p>
                  </div>

                  <Switch
                    id="ai-settings-activity"
                    onCheckedChange={(checked) =>
                      toast(`Activity tracking: ${checked}`)
                    }
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter id="ai-settings-footer">
              <Button
                id="ai-settings-save-button"
                onClick={() => toast("Settings saved")}
              >
                <Save />
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

    </>
  );
}
