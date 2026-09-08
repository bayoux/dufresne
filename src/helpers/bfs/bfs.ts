/**
 * @name bfs
 * @description Breadth-first traversal of a graph given as an adjacency list.
 * @category algorithm
 * @tags algorithm, graph, traversal
 * @usage low
 *
 * @param {Map<T, T[]>} graph Adjacency list: node -> its neighbors
 * @param {T} start The node to start from
 * @returns {T[]} Nodes in breadth-first visit order
 *
 * @example
 * bfs(new Map([["a", ["b", "c"]], ["b", ["d"]], ["c", []], ["d", []]]), "a");
 * // ["a", "b", "c", "d"]
 */
export function bfs<T>(graph: Map<T, T[]>, start: T): T[] {
  const visited = new Set<T>([start]);
  const order: T[] = [];
  const queue: T[] = [start];

  while (queue.length) {
    const node = queue.shift() as T;
    order.push(node);

    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}
