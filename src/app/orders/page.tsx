"use client";

import { Check, Clock, MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

export default function OrdersPage() {
  return (
    <>
      <Toaster />

      <main className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div id="ai-orders-header">
            <h1 id="ai-orders-title" className="text-2xl font-bold">
              Orders
            </h1>
            <p id="ai-orders-description" className="text-muted-foreground">
              Track and manage orders.
            </p>
          </div>

          <div id="ai-orders-list" className="space-y-4">
            <Card id="ai-order-1001-card">
              <CardHeader
                id="ai-order-1001-header"
                className="flex flex-row items-center justify-between"
              >
                <div>
                  <CardTitle id="ai-order-1001-title">Order #1001</CardTitle>
                  <p
                    id="ai-order-1001-customer"
                    className="text-sm text-muted-foreground"
                  >
                    Customer: Maaz
                  </p>
                </div>

                <Badge
                  id="ai-order-1001-status"
                  className="cursor-pointer"
                  onClick={() => toast("Order status clicked")}
                >
                  Processing
                </Badge>
              </CardHeader>

              <Separator />

              <CardContent
                id="ai-order-1001-content"
                className="flex items-center justify-between pt-6"
              >
                <div
                  id="ai-order-1001-meta"
                  className="flex items-center gap-4 text-sm"
                >
                  <span id="ai-order-1001-time">
                    <Clock className="mr-1 inline size-4" />
                    10 minutes ago
                  </span>
                </div>

                <div id="ai-order-1001-actions" className="flex gap-2">
                  <Button
                    id="ai-order-1001-complete"
                    onClick={() => toast("Order marked complete")}
                  >
                    <Check />
                    Complete
                  </Button>

                  <Button
                    id="ai-order-1001-cancel"
                    variant="outline"
                    onClick={() => toast("Order cancelled")}
                  >
                    <X />
                    Cancel
                  </Button>

                  <Button
                    id="ai-order-1001-more"
                    variant="ghost"
                    size="icon"
                    onClick={() => toast("Order actions opened")}
                  >
                    <MoreHorizontal />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card id="ai-order-1002-card">
              <CardHeader
                id="ai-order-1002-header"
                className="flex flex-row items-center justify-between"
              >
                <CardTitle id="ai-order-1002-title">Order #1002</CardTitle>

                <Badge
                  id="ai-order-1002-status"
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toast("Order #1002 status clicked")}
                >
                  Delivered
                </Badge>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

    </>
  );
}
