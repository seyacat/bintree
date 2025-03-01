export class Bintree {
  root: { t: BintreeNode | null; f: BintreeNode | null };
  bits: number;
  constructor(bits: number) {
    this.bits = bits;
    this.root = { t: null, f: null };
  }
  add = (n: bigint) => {
    let cursor = this.root;
    const bitLength = n.toString(2).length;
    let lastBit = n >> BigInt(this.bits - 1);
    for (let i = this.bits - 1; i >= 0; i--) {
      const bit = i > bitLength ? false : ((n >> BigInt(i)) & 1n) === 1n;
      if (bit) {
        if (!cursor.t)
          cursor.t = new BintreeNode(
            i == 0 && lastBit ? this.root.t : null,
            i == 0 && !lastBit ? this.root.f : null
          );
        cursor = cursor.t;
      } else {
        if (!cursor.f)
          cursor.f = new BintreeNode(
            i == 0 && lastBit ? this.root.t : null,
            i == 0 && !lastBit ? this.root.f : null
          );
        cursor = cursor.f;
      }
    }
  };
  find = (n: bigint) => {
    let cursor = this.root;
    for (let i = this.bits - 1; i >= 0; i--) {
      const bit = (n >> BigInt(i)) & 1n;
      if (bit) {
        if (!cursor.t) return false;
        cursor = cursor.t;
      } else {
        if (!cursor.f) return false;
        cursor = cursor.f;
      }
    }
    return true;
  };
  toArray = () => {
    return [
      ...(this.root.t?.toArray(this.bits, 1n) ?? []),
      ...(this.root.f?.toArray(this.bits, 0n) ?? []),
    ].flat();
  };
  toObject = (i = this.bits) => {
    const ret: any = {};
    if (this.root.t) ret.t = this.root.t.toObject(i);
    if (this.root.f) ret.f = this.root.f.toObject(i);
    return ret;
  };
}

export class WordTree {
  tree: Bintree;
  constructor(w: string) {
    this.tree = new Bintree(w.length);
    for (let i = 0; i < w.length; i++) {
      this.tree.add(BigInt(w.charCodeAt(i)));
    }
  }
  toObject = () => this.tree.toObject();
}

export class BintreeNode {
  t: BintreeNode | null;
  f: BintreeNode | null;
  constructor(t: BintreeNode | null, f: BintreeNode | null) {
    this.t = t;
    this.f = f;
  }
  toObject = (i = 0) => {
    const ret: any = {};
    if (this.t && i - 1 > 0) ret.t = this.t.toObject(i - 1);
    if (this.f && i - 1 > 0) ret.f = this.f.toObject(i - 1);
    return ret;
  };
  toArray = (i = 0, n: bigint): bigint[] => {
    if (i - 1 <= 0) return [n];
    let ret: bigint[] = [];
    if (this.t) {
      ret = this.t.toArray(i - 1, (n << 1n) | 1n);
    }
    if (this.f) {
      ret = [...ret, ...this.f.toArray(i - 1, (n << 1n) | 0n)];
    }
    return ret;
  };
  
}
