import type { Registry, RegistryItem } from "../types.ts";

export interface ResolvedPlan {
  /** Items to install, dependencies before dependents. */
  items: RegistryItem[];
  /** Union of every npm package the selected items (and their deps) need. */
  npm: string[];
}

/**
 * Walks the internal dependency graph for `names` and returns a flat,
 * de-duplicated, topologically ordered install plan.
 */
export function resolveDependencies(registry: Registry, names: string[]): ResolvedPlan {
  const ordered: RegistryItem[] = [];
  const done = new Set<string>();
  const stack = new Set<string>();
  const npm = new Set<string>();

  const visit = (name: string, from?: string) => {
    if (done.has(name)) return;
    if (stack.has(name)) {
      throw new Error(`Circular dependency: ${[...stack, name].join(" -> ")}`);
    }

    const item = registry.items[name];
    if (!item) {
      throw new Error(
        from
          ? `"${from}" depends on "${name}", which is not in the registry.`
          : `"${name}" is not in the registry. Run \`dufresne list\`.`,
      );
    }

    stack.add(name);
    for (const dep of item.dependencies.internal) visit(dep, name);
    stack.delete(name);

    done.add(name);
    for (const pkg of item.dependencies.npm) npm.add(pkg);
    ordered.push(item);
  };

  for (const name of names) visit(name);

  return { items: ordered, npm: [...npm].sort() };
}
