import { tool } from "ai";
import { z } from "zod";

import { applicationMap } from "@/lib/application-map";

type ElementNode = {
  id: string;
  type: string;
  label: string;
  description: string;
  actions: readonly string[];
  children?: Record<string, ElementNode>;
};

type CollectionNode = ElementNode & {
  item?: {
    type: string;
    description: string;
    elements: Record<
      string,
      {
        type: string;
        label: string;
        actions: readonly string[];
      }
    >;
  };
};

type RouteNode = {
  path: string;
  name: string;
  description: string;
  elements: Record<string, ElementNode | CollectionNode>;
};

function findElement(
  elements: Record<string, ElementNode | CollectionNode>,
  targetId: string,
): ElementNode | CollectionNode | null {
  for (const element of Object.values(elements)) {
    if (element.id === targetId) {
      return element;
    }

    if (element.children) {
      const result = findElement(element.children, targetId);

      if (result) {
        return result;
      }
    }
  }

  return null;
}

function findElementInRoutes(targetId: string): {
  element: ElementNode | CollectionNode;
  route: RouteNode;
} | null {
  const routes = applicationMap.application.routes;

  for (const route of Object.values(routes)) {
    const element = findElement(route.elements, targetId);

    if (element) {
      return {
        element,
        route,
      };
    }
  }

  return null;
}

export const executeUIAction = tool({
  description: `
Execute an action on a UI element exposed by the Application Map.

For STATIC elements:

{
  "target": "ai-customers-add-button",
  "action": "click"
}

For elements inside a DYNAMIC COLLECTION:

{
  "target": "ai-customers-list",
  "item": "maaz",
  "element": "emailButton",
  "action": "click"
}

The "target" must be the collection ID.

The "item" must identify the specific record.

The "element" must identify the capability inside that record.

NEVER create dot-path targets such as:

"ai-customers-list.0.emailButton"

For dynamic collections always use:
target + item + element + action.
`,
  inputSchema: z.object({
    target: z
      .string()
      .describe(
        "Static element ID or dynamic collection ID from the Application Map.",
      ),

    action: z.string().describe("The action to perform."),

    value: z.string().optional().describe("Optional value for the action."),

    item: z
      .string()
      .optional()
      .describe("ID of the dynamic collection item, such as a customer ID."),

    element: z
      .string()
      .optional()
      .describe(
        "Element inside the dynamic collection item, such as emailButton, status, or more.",
      ),
  }),

  execute: async ({ target, action, value, item, element }) => {
    const result = findElementInRoutes(target);

    if (!result) {
      return {
        success: false,
        error: `Element "${target}" does not exist in the Application Map.`,
      };
    }

    const { element: mapElement, route } = result;

    /*
     * Dynamic collection action
     */
    if (item && element) {
      if (mapElement.type !== "collection") {
        return {
          success: false,
          error: `"${target}" is not a dynamic collection.`,
        };
      }

      const collection = mapElement as CollectionNode;

      const itemElement = collection.item?.elements?.[element];

      if (!itemElement) {
        return {
          success: false,
          error: `Element "${element}" does not exist inside collection "${target}".`,
        };
      }

      if (!itemElement.actions.includes(action)) {
        return {
          success: false,
          error: `Action "${action}" is not allowed on "${element}".`,
        };
      }

      return {
        success: true,
        dynamic: true,
        collection: target,
        item,
        element,
        action,
        value: value ?? null,
        route: route.path,
      };
    }

    /*
     * Static element action
     */
    if (!mapElement.actions.includes(action)) {
      return {
        success: false,
        error: `Action "${action}" is not allowed on "${target}".`,
      };
    }

    return {
      success: true,
      dynamic: false,
      target,
      action,
      value: value ?? null,
      label: mapElement.label,
      route: route.path,
    };
  },
});

export const navigate = tool({
  description:
    "Navigate to a route exposed by the Application Map. Use this for page navigation, not executeUIAction.",

  inputSchema: z.object({
    route: z.string().describe("The route key from the Application Map."),
  }),

  execute: async ({ route }) => {
    const routeNode =
      applicationMap.application.routes[
        route as keyof typeof applicationMap.application.routes
      ];

    if (!routeNode) {
      return {
        success: false,
        error: `Route "${route}" does not exist in the Application Map.`,
      };
    }

    return {
      success: true,
      route,
      path: routeNode.path,
      label: routeNode.name,
    };
  },
});
