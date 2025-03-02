import { Bintree } from "../bintree";

const bt = new Bintree(8);

//bt.add(10n);

bt.add(0n);
//bt.add(1n);
bt.add(5n);
bt.add(4n);
//bt.add(3n);
//bt.add(520n);
bt.add(19n);
//bt.add(88n);
//bt.add(2n);
//bt.add(21n);
//bt.add(250n);


console.dir(bt.toObject(), { depth: null });

/*console.dir(
  {
    1: bt.find(1),
    2: bt.find(2),
    3: bt.find(3),
    7: bt.find(7),
  },
  { depth: null }
);*/

console.dir(bt.toArray(), { depth: null });

const data = bt.toBigInt();

const targetBt = new Bintree(8, data);

console.dir(bt.toArray());

