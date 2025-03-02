export class Bintree {
  root: BintreeNode;
  bits: number;
  constructor(bits: number, data?: bigint) {
    this.bits = bits;
    if (data) {
      this.loadData(data);
    } else {
      this.root = new BintreeNode(null, null);
    }
  }
  loadData = (data: bigint) => {
    // Invertir el orden de los bits
    const binaryString = data.toString(2);

    const reversedBinaryString = binaryString.split("").reverse().join("");
    const reversedBigInt = BigInt("0b" + reversedBinaryString);

    data = reversedBigInt >> 1n; //remover primer bit
    //get bit pairs
    const bitPairs: bigint[] = [];
    for (let i = 0; i < binaryString.length / 2 - 1; i++) {
      const bitPair = data & 3n;
      bitPairs.push(bitPair);
      data = data >> 2n;
    }

    const n: bigint[] = [1n];
    let nums: bigint[] = [];
    for (let i = 0; i < bitPairs.length; i++) {
      switch (bitPairs[i]) {
        case 2n:
          n[0] = n[0] << 1n;
          break;
        case 1n:
          n[0] = (n[0] << 1n) | 1n;
          break;
        case 3n:
          n.push((n[0] << 1n) | 0n);
          n[0] = (n[0] << 1n) | 1n;
          break;
      }
      if (n[0].toString(2).length == this.bits + 1 ) {
        const shifted = n.shift();
        if (shifted) {
          nums.push(shifted & ((1n << BigInt(this.bits)) - 1n));
        }
      }
    }
    nums = [...nums , ...n].map(  (nn:bigint) => (nn & (1n << BigInt(this.bits)) - 1n) );
  };
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
  fromArray = (arr: bigint[]) => {
    for (let i = 0; i < arr.length; i++) {
      this.add(arr[i]);
    }
  };
  toBigInt = () => {
    return (this.root.toBigInt(this.bits, 1n) << 1n) | 1n; //WITH PREFIX 1 AND TRAILING 1
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
  toBigInt = (i = 0, n: bigint): bigint => {
    n = (n << 1n) | (this.t ? 1n : 0n);
    n = (n << 1n) | (this.f ? 1n : 0n);
    if (this.t && i - 1 > 0) {
      n = this.t.toBigInt(i - 1, n);
    }
    if (this.f && i - 1 > 0) {
      n = this.f.toBigInt(i - 1, n);
    }
    return n;
  };
}
