export class Bintree {
  root: BintreeNode;
  indexRoot: BintreeNode;
  bits: number;
  constructor(bits: number, data?: bigint) {
    this.bits = bits;
    if (data) {
      this.loadData(data);
    } else {
      this.root = new BintreeNode();
      this.indexRoot = new BintreeNode();
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
      if (n[0].toString(2).length == this.bits + 1) {
        const shifted = n.shift();
        if (shifted) {
          nums.push(shifted & ((1n << BigInt(this.bits)) - 1n));
        }
      }
    }
    nums = [...nums, ...n].map(
      (nn: bigint) => nn & ((1n << BigInt(this.bits)) - 1n)
    );
  };
  add = (n: bigint, index?: bigint) => {
    console.log({ nav: this.nextAvailableIndex() });
    index = index ?? this.nextAvailableIndex();
    this._add(this.root, n);
    this._add(this.indexRoot, index);
    //console.dir({"in":this.indexRoot.toObject(100)},{depth:null})
  };

  _add = (rootNode: BintreeNode, n: bigint) => {
    let cursor = rootNode;
    const bitLength = n.toString(2).length;
    let lastBit = n >> BigInt(this.bits - 1);
    for (let i = this.bits - 1; i >= 0; i--) {
      const bit = i > bitLength ? false : ((n >> BigInt(i)) & 1n) === 1n;
      if (bit) {
        if (!cursor.t)
          cursor.t = new BintreeNode(
            cursor
            //i == 0 && lastBit ? this.root.t : null, //ROOT LOOP
            //i == 0 && !lastBit ? this.root.f : null
          );
        cursor = cursor.t;
      } else {
        if (!cursor.f)
          cursor.f = new BintreeNode(
            cursor
            //i == 0 && lastBit ? this.root.t : null,
            //i == 0 && !lastBit ? this.root.f : null
          );
        cursor = cursor.f;
      }
    }
  };

  remove = (n: bigint) => {
    const chain = this.bintreeChain(n);
    if (chain.length !== this.bits) return;
    for (let i = this.bits - 1; i >= 0; i--) {
      if (chain[i - 1].t && chain[i - 1].t === chain[i]) {
        chain[i - 1].t = null;
        if (chain[i - 1].f) return;
      }
      if (chain[i - 1].f && chain[i - 1].f === chain[i]) {
        chain[i - 1].f = null;
        if (chain[i - 1].t) return;
      }
      return;
    }
  };
  bintreeChain = (n: bigint): BintreeNode[] => {
    let cursor = this.root;
    const ret: BintreeNode[] = [];
    for (let i = this.bits - 1; i >= 0; i--) {
      const bit = (n >> BigInt(i)) & 1n;
      if (bit) {
        if (!cursor.t) return [];
        ret.push(cursor.t);
        cursor = cursor.t;
      } else {
        if (!cursor.f) return [];
        ret.push(cursor.f);
        cursor = cursor.f;
      }
    }
    return ret;
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
  nextAvailableIndex = () => {
    let cursor = this.indexRoot;
    let index: bigint = 1n;
    for (let i = 0n; i < this.bits; i++) {
      
      console.log("fulltest", i, cursor.f?.isFull(this.bits - Number(i) - 1));
      if (
        cursor.f &&
        !cursor.t &&
        (cursor.f.isFull(this.bits - Number(i) - 2) || i === BigInt(this.bits) - 1n)
      ) {
        console.log(
          "condicion 1",
          i,
          BigInt(this.bits) - i - 1n,
          JSON.stringify(cursor.toObject(100), null, 2)
        );
        index = (index << 1n) | 1n;
        index = index << (BigInt(this.bits) - i - 1n);
        break;
      }
      if (cursor.t) {
        console.log("condicion 2");
        index = (index << 1n) | 1n;
        cursor = cursor.t;
        continue;
      }
      if (cursor.f) {
        console.log("condicion 3");
        index = index << 1n;
        cursor = cursor.f;
        continue;
      }
      if (!cursor.f) {
        console.log("condicion 4");
        index = index << (BigInt(this.bits) - i);
        break;
      }
      console.log("INDEXIN", index.toString(2));
    }
    console.log("INDEX", index.toString(2));
    return index;
  };
  fromArray = (arr: bigint[]) => {
    for (let i = 0; i < arr.length; i++) {
      this.add(arr[i]);
    }
  };
  toArray() {
    return this._toArray(this.root);
  }
  indexToArray() {
    return this._toArray(this.indexRoot);
  }
  _toArray = (rootNode: BintreeNode) => {
    return [
      ...(rootNode.t?.toArray(this.bits, 1n) ?? []),
      ...(rootNode.f?.toArray(this.bits, 0n) ?? []),
    ].flat();
  };
  toBigInt = () => {
    return (this.root.toBigInt(this.bits, 1n) << 1n) | 1n; //WITH PREFIX 1 AND TRAILING 1
  };
  toObject = (i = this.bits) => {
    return this.root.toObject(100);
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
  toObject = () => this.tree.toObject(100);
}

export class BintreeNode {
  p: BintreeNode | null;
  t: BintreeNode | null;
  f: BintreeNode | null;
  constructor(
    p: BintreeNode | null = null,
    t: BintreeNode | null = null,
    f: BintreeNode | null = null
  ) {
    this.p = p;
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
  isFull = (i = 0): boolean => {
    console.dir({ FULLIN: 1, i, ob: this.toObject(100) }, { depth: null });
    return (
      this.t != null &&
      this.f != null &&
      (i <= 0 || (this.t.isFull(i - 1) && this.f.isFull(i - 1)))
    );
  };
}
