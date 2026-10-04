export const applicationMap = {
  application: {
    id: "ai-application",
    name: "Vangrex Demo Application",

    routes: {
      dashboard: {
        path: "/",
        name: "Dashboard",
        description: "Application dashboard",
        elements: {},
      },

      projects: {
        path: "/projects",
        name: "Projects",
        description: "Project management page",
        elements: {},
      },

      customers: {
        path: "/customers",
        name: "Customers",
        description: "Customer management page",

        elements: {
          toolbar: {
            id: "ai-customers-toolbar",
            type: "container",
            label: "Customers toolbar",
            description: "Customer page toolbar",
            actions: [],
          },

          title: {
            id: "ai-customers-title",
            type: "text",
            label: "Customers",
            description: "Customers page title",
            actions: [],
          },

          description: {
            id: "ai-customers-description",
            type: "text",
            label: "Customer description",
            description: "Customers page description",
            actions: [],
          },

          addCustomer: {
            id: "ai-customers-add-button",
            type: "button",
            label: "Add customer",
            description: "Create a new customer",
            actions: ["click"],
          },

          search: {
            id: "ai-customers-search",
            type: "input",
            label: "Customer search",
            description: "Search the customer list",
            actions: ["type", "clear", "focus"],
          },

          list: {
            id: "ai-customers-list",
            type: "collection",
            label: "Customer list",
            description: "Dynamic collection of customer records",
            actions: [],

            item: {
              type: "customer",
              description: "A dynamically rendered customer record",

              elements: {
                avatar: {
                  type: "avatar",
                  label: "Customer avatar",
                  actions: [],
                },

                name: {
                  type: "text",
                  label: "Customer name",
                  actions: [],
                },

                email: {
                  type: "text",
                  label: "Customer email",
                  actions: [],
                },

                status: {
                  type: "badge",
                  label: "Customer status",
                  actions: ["click"],
                },

                more: {
                  type: "button",
                  label: "Customer actions",
                  actions: ["click"],
                },

                emailButton: {
                  type: "button",
                  label: "Email customer",
                  actions: ["click"],
                },
              },
            },
          },
        },
      },

      orders: {
        path: "/orders",
        name: "Orders",
        description: "Order management page",
        elements: {},
      },

      settings: {
        path: "/settings",
        name: "Settings",
        description: "Application settings",
        elements: {},
      },
    },
  },
} as const;

export type ApplicationMap = typeof applicationMap;
