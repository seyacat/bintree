import { Bintree } from "../bintree";

const bt = new Bintree(8);

bt.add(10n);

bt.add(0n);
bt.add(1n);
bt.add(5n);
bt.add(3n);
bt.add(520n);


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

