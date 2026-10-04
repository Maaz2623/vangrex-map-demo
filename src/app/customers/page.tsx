"use client";

import { Mail, MoreHorizontal, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

const customers = [
  {
    id: "maaz",
    name: "Maaz",
    email: "maaz@example.com",
    initials: "M",
    status: "Active",
    statusVariant: "default" as const,
  },
  {
    id: "sara",
    name: "Sara",
    email: "sara@example.com",
    initials: "S",
    status: "Pending",
    statusVariant: "secondary" as const,
  },
  {
    id: "alex",
    name: "Alex",
    email: "alex@example.com",
    initials: "A",
    status: "Active",
    statusVariant: "default" as const,
  },
];

type Customer = (typeof customers)[number];

export default function CustomersPage() {
  const handleSearch = (value: string) => {
    toast(`Customer search: ${value}`);
  };

  const handleAddCustomer = () => {
    toast("Add customer clicked");
  };

  const handleMore = (customer: Customer) => {
    toast(`${customer.name} customer actions clicked`);
  };

  const handleStatus = (customer: Customer) => {
    toast(`${customer.name} status clicked`);
  };

  const handleEmail = (customer: Customer) => {
    toast(`Email ${customer.name} clicked`);
  };

  return (
    <>
      <Toaster />

      <main className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div
            id="ai-customers-toolbar"
            className="flex items-center justify-between gap-4"
          >
            <div>
              <h1 id="ai-customers-title" className="text-2xl font-bold">
                Customers
              </h1>

              <p
                id="ai-customers-description"
                className="text-muted-foreground"
              >
                Manage customer accounts.
              </p>
            </div>

            <Button id="ai-customers-add-button" onClick={handleAddCustomer}>
              <UserPlus />
              Add customer
            </Button>
          </div>

          <Input
            id="ai-customers-search"
            placeholder="Search customers..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div
            id="ai-customers-list"
            data-ai-collection="customers"
            className="space-y-3"
          >
            {customers.map((customer) => (
              <Card
                key={customer.id}
                data-ai-element="customer"
                data-ai-id={customer.id}
                data-ai-label={customer.name}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar data-ai-element="avatar">
                      <AvatarFallback>{customer.initials}</AvatarFallback>
                    </Avatar>

                    <div>
                      <CardTitle data-ai-element="name">
                        {customer.name}
                      </CardTitle>

                      <p
                        data-ai-element="email"
                        className="text-sm text-muted-foreground"
                      >
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    data-ai-element="more"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMore(customer)}
                  >
                    <MoreHorizontal />
                  </Button>
                </CardHeader>

                <CardContent className="flex items-center justify-between">
                  <Badge
                    data-ai-element="status"
                    variant={customer.statusVariant}
                    className="cursor-pointer"
                    onClick={() => handleStatus(customer)}
                  >
                    {customer.status}
                  </Badge>

                  <Button
                    data-ai-element="emailButton"
                    variant="outline"
                    onClick={() => handleEmail(customer)}
                  >
                    <Mail />
                    Email
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
