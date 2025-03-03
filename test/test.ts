import { Bintree } from "../bintree";

const bt = new Bintree(8);

//bt.add(10n);

bt.add(0n);
console.log(bt.indexToArray())

//bt.add(1n);
bt.add(5n);
console.log(bt.indexToArray())

bt.add(4n);
console.log(bt.indexToArray())

bt.add(8n);
console.log(bt.indexToArray())

bt.add(9n);
console.log(bt.indexToArray())

bt.add(9n);
console.log(bt.indexToArray())





/*bt.add(4n);
//bt.add(3n);
//bt.add(520n);
bt.add(19n);
//bt.add(88n);
bt.add(2n);
//bt.add(21n);
//bt.add(250n);
//bt.remove(12n);
bt.remove(5n);
bt.remove(4n);
bt.add(45n);
bt.remove(44n);*/


//console.dir({"ob":bt.toObject()}, { depth: null });

/*const bt2 = new Bintree(8);
bt2.add(25n);
console.log(bt2.toArray())
bt2.remove(25n);
bt2.add(55n);
console.log(bt2.toArray())

console.dir(
  {
    0: bt.find(0n),
    19: bt.find(19n),
    3: bt.find(3n),
    7: bt.find(7n),
    5: bt.find(5n),
  },
  { depth: null }
);

console.dir(bt.toArray(), { depth: null });

const data = bt.toBigInt();

const targetBt = new Bintree(8, data);

console.dir(bt.toArray());

*/