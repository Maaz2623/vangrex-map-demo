export const applicationMap = {
  application: {
    id: "ai-application",
    name: "Vangrex Demo Application",

    routes: {
      projects: {
        path: "/projects",
        name: "Projects",
        description: "Project management page",

        elements: {
          toolbar: {
            id: "ai-projects-toolbar",
            type: "container",
            label: "Projects toolbar",
            description: "Projects page toolbar",
            actions: [],

            children: {
              title: {
                id: "ai-projects-title",
                type: "text",
                label: "Projects",
                description: "Projects page title",
                actions: [],
              },

              description: {
                id: "ai-projects-description",
                type: "text",
                label: "Project description",
                description: "Projects page description",
                actions: [],
              },

              addProject: {
                id: "ai-projects-add-button",
                type: "button",
                label: "New project",
                description: "Create a new project",
                actions: ["click"],
              },
            },
          },

          search: {
            id: "ai-projects-search",
            type: "input",
            label: "Project search",
            description: "Search the project list",
            actions: ["type", "clear", "focus"],
          },

          list: {
            id: "ai-projects-list",
            type: "collection",
            label: "Project list",
            description: "Dynamic collection of projects",
            actions: [],

            item: {
              type: "project",
              description: "A dynamically rendered project",

              elements: {
                card: {
                  type: "card",
                  label: "Project card",
                  actions: [],
                },

                header: {
                  type: "card-header",
                  label: "Project header",
                  actions: [],
                },

                title: {
                  type: "text",
                  label: "Project name",
                  actions: [],
                },

                description: {
                  type: "text",
                  label: "Project description",
                  actions: [],
                },

                content: {
                  type: "card-content",
                  label: "Project content",
                  actions: [],
                },

                status: {
                  type: "badge",
                  label: "Project status",
                  actions: ["click"],
                },

                footer: {
                  type: "card-footer",
                  label: "Project footer",
                  actions: [],
                },

                more: {
                  type: "button",
                  label: "Project actions",
                  actions: ["click"],
                },

                open: {
                  type: "button",
                  label: "Open project",
                  actions: ["click"],
                },
              },
            },
          },
        },
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
            description: "Customers page toolbar",
            actions: [],

            children: {
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
            },
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
            description: "Dynamic collection of customers",
            actions: [],

            item: {
              type: "customer",
              description: "A dynamically rendered customer",

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

      settings: {
        path: "/settings",
        name: "Settings",
        description: "Application settings",

        elements: {
          card: {
            id: "ai-settings-card",
            type: "card",
            label: "Settings",
            description: "Application settings card",
            actions: [],

            children: {
              header: {
                id: "ai-settings-header",
                type: "card-header",
                label: "Settings header",
                description: "Settings page header",
                actions: [],

                children: {
                  title: {
                    id: "ai-settings-title",
                    type: "text",
                    label: "Settings",
                    description: "Settings page title",
                    actions: [],
                  },

                  description: {
                    id: "ai-settings-description",
                    type: "text",
                    label: "Configure your application",
                    description: "Settings page description",
                    actions: [],
                  },
                },
              },

              separator: {
                id: "ai-settings-separator",
                type: "separator",
                label: "Settings separator",
                description: "Separator below settings header",
                actions: [],
              },

              content: {
                id: "ai-settings-content",
                type: "card-content",
                label: "Settings content",
                description: "Application settings",
                actions: [],

                children: {
                  profileSection: {
                    id: "ai-settings-profile-section",
                    type: "section",
                    label: "Profile",
                    description: "Profile settings",
                    actions: [],

                    children: {
                      title: {
                        id: "ai-settings-profile-title",
                        type: "text",
                        label: "Profile",
                        description: "Profile section title",
                        actions: [],
                      },

                      nameField: {
                        id: "ai-settings-name-field",
                        type: "field",
                        label: "Name",
                        description: "Name field",
                        actions: [],

                        children: {
                          label: {
                            id: "ai-settings-name-label",
                            type: "label",
                            label: "Name",
                            description: "Name input label",
                            actions: [],
                          },

                          input: {
                            id: "ai-settings-name-input",
                            type: "input",
                            label: "Name",
                            description: "User name",
                            actions: ["type", "clear", "focus"],
                          },
                        },
                      },

                      emailField: {
                        id: "ai-settings-email-field",
                        type: "field",
                        label: "Email",
                        description: "Email field",
                        actions: [],

                        children: {
                          label: {
                            id: "ai-settings-email-label",
                            type: "label",
                            label: "Email",
                            description: "Email input label",
                            actions: [],
                          },

                          input: {
                            id: "ai-settings-email-input",
                            type: "input",
                            label: "Email",
                            description: "User email",
                            actions: ["type", "clear", "focus"],
                          },
                        },
                      },
                    },
                  },

                  preferencesSection: {
                    id: "ai-settings-preferences-section",
                    type: "section",
                    label: "Preferences",
                    description: "Application preferences",
                    actions: [],

                    children: {
                      title: {
                        id: "ai-settings-preferences-title",
                        type: "text",
                        label: "Preferences",
                        description: "Preferences section title",
                        actions: [],
                      },

                      notificationsRow: {
                        id: "ai-settings-notifications-row",
                        type: "row",
                        label: "Notifications",
                        description: "Notification preferences",
                        actions: [],

                        children: {
                          label: {
                            id: "ai-settings-notifications-label",
                            type: "label",
                            label: "Notifications",
                            description: "Notifications label",
                            actions: [],
                          },

                          description: {
                            id: "ai-settings-notifications-description",
                            type: "text",
                            label: "Receive application notifications",
                            description: "Notification preference description",
                            actions: [],
                          },

                          switch: {
                            id: "ai-settings-notifications",
                            type: "switch",
                            label: "Notifications",
                            description:
                              "Enable or disable application notifications",
                            actions: ["enable", "disable"],
                          },
                        },
                      },

                      activityRow: {
                        id: "ai-settings-activity-row",
                        type: "row",
                        label: "Activity tracking",
                        description: "Activity tracking preferences",
                        actions: [],

                        children: {
                          label: {
                            id: "ai-settings-activity-label",
                            type: "label",
                            label: "Activity tracking",
                            description: "Activity tracking label",
                            actions: [],
                          },

                          description: {
                            id: "ai-settings-activity-description",
                            type: "text",
                            label: "Track activity across the application",
                            description: "Activity tracking description",
                            actions: [],
                          },

                          switch: {
                            id: "ai-settings-activity",
                            type: "switch",
                            label: "Activity tracking",
                            description: "Enable or disable activity tracking",
                            actions: ["enable", "disable"],
                          },
                        },
                      },
                    },
                  },
                },
              },

              footer: {
                id: "ai-settings-footer",
                type: "card-footer",
                label: "Settings footer",
                description: "Settings actions",
                actions: [],

                children: {
                  save: {
                    id: "ai-settings-save-button",
                    type: "button",
                    label: "Save changes",
                    description: "Save application settings",
                    actions: ["click"],
                  },
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

        elements: {
          header: {
            id: "ai-orders-header",
            type: "container",
            label: "Orders header",
            description: "Orders page header",
            actions: [],

            children: {
              title: {
                id: "ai-orders-title",
                type: "text",
                label: "Orders",
                description: "Orders page title",
                actions: [],
              },

              description: {
                id: "ai-orders-description",
                type: "text",
                label: "Track and manage orders",
                description: "Orders page description",
                actions: [],
              },
            },
          },

          list: {
            id: "ai-orders-list",
            type: "collection",
            label: "Order list",
            description: "Dynamic collection of orders",
            actions: [],

            item: {
              type: "order",
              description: "A dynamically rendered order",

              elements: {
                card: {
                  type: "card",
                  label: "Order card",
                  actions: [],
                },

                header: {
                  type: "card-header",
                  label: "Order header",
                  actions: [],
                },

                title: {
                  type: "text",
                  label: "Order number",
                  actions: [],
                },

                customer: {
                  type: "text",
                  label: "Order customer",
                  actions: [],
                },

                status: {
                  type: "badge",
                  label: "Order status",
                  actions: ["click"],
                },

                separator: {
                  type: "separator",
                  label: "Order separator",
                  actions: [],
                },

                content: {
                  type: "card-content",
                  label: "Order content",
                  actions: [],
                },

                meta: {
                  type: "container",
                  label: "Order metadata",
                  actions: [],
                },

                time: {
                  type: "text",
                  label: "Order time",
                  actions: [],
                },

                actions: {
                  type: "container",
                  label: "Order actions",
                  actions: [],
                },

                complete: {
                  type: "button",
                  label: "Complete order",
                  description: "Mark the order as complete",
                  actions: ["click"],
                },

                cancel: {
                  type: "button",
                  label: "Cancel order",
                  description: "Cancel the order",
                  actions: ["click"],
                },

                more: {
                  type: "button",
                  label: "Order actions",
                  description: "Open additional order actions",
                  actions: ["click"],
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

export type ApplicationMap = typeof applicationMap;
