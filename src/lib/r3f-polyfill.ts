import * as THREE from "three";

/**
 * Creates an auto-vivifying Proxy so that pierced JSX properties like "data-tsd-source"
 * can traverse arbitrary depth (target["data"]["tsd"]["source"]) without throwing:
 * "Error: R3F: Cannot set "data-tsd-source". Ensure it is an object before setting "source""
 */
export function createVivifyingProxy(): any {
  return new Proxy(
    {},
    {
      get(target: any, prop: string | symbol) {
        if (typeof prop === "string" && !(prop in target)) {
          target[prop] = createVivifyingProxy();
        }
        return target[prop];
      },
      set(target: any, prop: string | symbol, value: any) {
        target[prop] = value;
        return true;
      },
    }
  );
}

export function patchThreePrototypes() {
  const prototypes = [
    THREE.Object3D.prototype,
    THREE.Material.prototype,
    THREE.BufferGeometry.prototype,
    THREE.Texture.prototype,
    (THREE as any).Light?.prototype,
    (THREE as any).Camera?.prototype,
    (THREE as any).Scene?.prototype,
    (THREE as any).Mesh?.prototype,
    (THREE as any).Group?.prototype,
  ];

  for (const proto of prototypes) {
    if (proto) {
      try {
        Object.defineProperty(proto, "data", {
          get() {
            if (!this._vivifiedData) {
              this._vivifiedData = createVivifyingProxy();
            }
            return this._vivifiedData;
          },
          set(val) {
            if (typeof val === "object" && val !== null) {
              this._vivifiedData = val;
            }
          },
          configurable: true,
          enumerable: false,
        });
      } catch {
        // Ignored if already defined
      }
    }
  }
}

patchThreePrototypes();
