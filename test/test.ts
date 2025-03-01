import { Bintree } from "../bintree";

const bt = new Bintree(8);

bt.add(10);

bt.add(0);
bt.add(1);
bt.add(5);
bt.add(3);
bt.add(520);


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

