/**
 * @name dfs
 * @description Depth-first traversal of a graph given as an adjacency list.
 * @category algorithm
 * @tags algorithm, graph, traversal
 * @usage low
 *
 * @param {Map<T, T[]>} graph Adjacency list: node -> its neighbors
 * @param {T} start The node to start from
 * @returns {T[]} Nodes in depth-first visit order
 *
 * @example
 * dfs(new Map([["a", ["b", "c"]], ["b", ["d"]], ["c", []], ["d", []]]), "a");
 * // ["a", "b", "d", "c"]
 */
export function dfs<T>(graph: Map<T, T[]>, start: T): T[] {
  const visited = new Set<T>();
  const order: T[] = [];

  const visit = (node: T): void => {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);
    for (const neighbor of graph.get(node) ?? []) visit(neighbor);
  };

  visit(start);
  return order;
}
