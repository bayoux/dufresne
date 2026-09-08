class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

/**
 * @name Trie
 * @description A prefix tree for fast word/prefix lookup — the classic structure behind autocomplete.
 * @category data-structure
 * @tags data-structure, trie, string, prefix
 * @usage low
 *
 * @example
 * const trie = new Trie();
 * trie.insert("cat");
 * trie.has("cat"); // true
 * trie.startsWith("ca"); // true
 */
export class Trie {
  #root = new TrieNode();

  insert(word: string): void {
    let node = this.#root;
    for (const char of word) {
      let next = node.children.get(char);
      if (!next) {
        next = new TrieNode();
        node.children.set(char, next);
      }
      node = next;
    }
    node.isEnd = true;
  }

  has(word: string): boolean {
    const node = this.#find(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.#find(prefix) !== null;
  }

  #find(str: string): TrieNode | null {
    let node = this.#root;
    for (const char of str) {
      const next = node.children.get(char);
      if (!next) return null;
      node = next;
    }
    return node;
  }
}
