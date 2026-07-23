'use client';

import { useEffect } from 'react';

/**
 * Softens a known React 18 / browser-extension clash:
 * `NotFoundError: Failed to execute 'removeChild' on 'Node'`
 * (Google Translate, Grammarly, password managers, etc. rewrite the DOM
 * while React tries to unmount nodes → Next.js error overlay).
 *
 * Patches are no-ops when the node is already detached.
 */
export function DomStability() {
  useEffect(() => {
    if (typeof Node === 'undefined') return;

    const proto = Node.prototype;
    const originalRemoveChild = proto.removeChild;
    const originalInsertBefore = proto.insertBefore;

    proto.removeChild = function removeChildPatched<T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    proto.insertBefore = function insertBeforePatched<T extends Node>(
      newNode: T,
      referenceNode: Node | null,
    ): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        return newNode;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };

    return () => {
      proto.removeChild = originalRemoveChild;
      proto.insertBefore = originalInsertBefore;
    };
  }, []);

  return null;
}
