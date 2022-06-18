var globalColored = false;
var delay = 1000;
var finishedSearch = false;
class Node {
    constructor(value) {
        this.parent = null;
        this.value = value;
        this.x = 400;
        this.y = 40;
        this.children = [];
    }
}
class QueueNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }
    //newnode goes to back of the line/end of the queue
    enqueue(value) {
        const newNode = new QueueNode(value);
        //if queue is empty
        if (this.size === 0) {
            this.first = newNode;
            this.last = newNode;
            // add current first pointer to new first(new node), and make new node new first
        } else {
            this.last.next = newNode;
            this.last = newNode;
        }
        //add 1 to size
        this.size++;

        return this;
    }
    // dequeue nodes off the front of the line
    dequeue() {
        //if queue is empty return false
        if (this.size === 0) return false;
        //get dequeuedNode
        const dequeuedNode = this.first;
        //get new first (could be NULL if stack is length 1)
        const newFirst = this.first.next;
        //if newFirst is null, reassign last to newFirst(null)
        if (!newFirst) {
            this.last = newFirst;
        }
        //assign new first
        this.first = newFirst;
        //remove refernce to list
        dequeuedNode.next = null;
        //remove 1 from size
        this.size--;
        //return dequeuednode
        return dequeuedNode;
    }
}
class Tree {
    constructor() {
        this.root = null
        this.xOffset = 200;
    }
    insert(node, value) {
        var newNode = new Node(value);
        newNode.parent = node;
        newNode.y = node.y + 80;

        if (node.children.length == 0) {
            newNode.x = node.x - this.xOffset;
        }

        else if (node.children.length == 1) {
            newNode.x = node.x + this.xOffset;
        }

        else if (node.children.length == 2) {
            newNode.x = node.x;
        }

        node.children.push(newNode);
    };
    async traverseBFS(colored, canvasName, delayed, searched=undefined) {
        delay = 1000;
        //if there is no root, return false
        globalColored = colored;

        if (!this.root) {
            return false;
        }

        var helper = new Helper();

        var c = document.getElementById(canvasName)

        if (c != undefined)
            var ctx = c.getContext("2d")

        else return;

        //start a new Queue
        const queue = new Queue();
        //keep a tally of all values in the tree
        const treeValues = [];
        //add root to queue
        queue.enqueue(this.root);
        //while queue is not empty
        while (queue.size !== 0) {
            //get TreeNode Children
            const nodeChildren = queue.first.value.children;
            //if node has children, loop and add each to queue
            if (nodeChildren.length !== 0) {
                nodeChildren.forEach(child => queue.enqueue(child));
            }
            //push the first item in the queue to the tree values
            treeValues.push(queue.first.value);
            this.color(queue.first.value, colored, ctx);

            if (searched != undefined) {
                if (searched == queue.first.value.value)
                    return treeValues;
            }

            //remove first node from queue
            queue.dequeue();


            if (colored == true && delayed == true) {
                await helper.sleep(delay);
            }

            if (colored == true && !globalColored)
                return;
        }
        //return values, should be all TreeNodes
        return treeValues;
    }
    color(node, colored, ctx) {
        var x = node.x;
        var y = node.y;

        const black = "#000"

        if (colored == true) {
            var value = node.value;
        }
        else {
            var value = "";
        }

        var parent = node.parent;

        //Wyswietlanie
        if (colored == true)
           //var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
           var color = "#3399ff";
        else
            var color = "#bfbfbf"

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI)
        ctx.strokeStyle = black;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = black;
        ctx.font = "25px Georgia";
        ctx.strokeText(value, x - 8, y + 4);

        if (parent != null) {
            ctx.beginPath();
            ctx.moveTo(x, y - 20);
            ctx.lineTo(parent.x, parent.y + 20);
            ctx.stroke();
        }
    }
    traverseDFS(type, canvasName, searched = undefined) {
        finishedSearch = false;
        delay = 0;
        //if there is no root, return false
        var colored = true;
        globalColored = colored;

        if (!this.root) {
            return false;
        }

        var helper = new Helper();
        var c = document.getElementById(canvasName)
        if (c != undefined)
            var ctx = c.getContext("2d")

        //make a variable for tree values
        const treeValues = [];
        //current values always starts at root
        let current = this.root;

        //helper methods go here
        const preOrderHelper = async node => {
            //push value onto array FIRST
            if (finishedSearch == false) {
                treeValues.push(node);
                this.color(node, true, ctx);
            }
            
            if (searched != undefined) {
                if (searched == node.value)
                    finishedSearch = true;
            }

            //recursively call function on all node children
            if (node.children.length !== 0) {
                for (var i = 0; i < node.children.length; i++) {
                    if (colored == true && !globalColored)
                        return;

                    delay += 300;
                    await helper.sleep(delay);
                    await preOrderHelper(node.children[i]);
                }
            }
            return true;
        };
        const postOrderHelper = async node => {
            //recursively call function on all node children FIRST
            if (node.children.length !== 0) {
                for (var i = 0; i < node.children.length; i++) {
                    if (colored == true && !globalColored)
                        return;

                    await postOrderHelper(node.children[i]);
                }
            }
            //push value onto array
            if (finishedSearch == false) {
                treeValues.push(node);
                this.color(node, true, ctx);
            }

            if (searched != undefined) {
                if (searched == node.value)
                    finishedSearch = true;
            }

            delay += 300;
            await helper.sleep(delay);

            return true;
        };
        const inOrderHelper = async node => {
            //if node had children, split nodes into left and right halves in case tree is not binary FIRST
            if (node.children.length !== 0) {
                //get halfway point
                const halfway = Math.floor(node.children.length / 2);
                //recursively call function on all node children left of halfway point
                for (let i = 0; i < halfway; i++) {
                    if (colored == true && !globalColored)
                        return;

                    await inOrderHelper(node.children[i]);
                }
                // push parent node value to array
                if (finishedSearch == false) {
                    treeValues.push(node);
                    this.color(node, true, ctx);
                }
                
                if (searched != undefined) {
                    if (searched == node.value)
                        finishedSearch = true;
                }

                delay += 300;
                await helper.sleep(delay);

                //recursively call function on all node children right of halfway point
                for (let i = halfway; i < node.children.length; i++) {
                    if (colored == true && !globalColored)
                        return;

                    await inOrderHelper(node.children[i]);
                }
                // else push value into array
            } else {
                if (colored == true && !globalColored)
                    return;

                if (finishedSearch == false) {
                    treeValues.push(node);
                    this.color(node, true, ctx);
                }

                if (searched != undefined) {
                    if (searched == node.value)
                        finishedSearch = true;
                }

                delay += 300;
                await helper.sleep(delay);
            }
            return true;
        };

        //switch statment to select proper order and start recursive function calls
        switch (type) {
            case "pre":
                preOrderHelper(current);
                break;
            case "post":
                postOrderHelper(current);
                break;
            case "in":
                inOrderHelper(current);
                break;
        }
        //return array
        return treeValues;
    }
}
class Helper {
    constructor() {

    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/*Przykładowe drzewo*/
var tree = new Tree();
tree.root = new Node(1);
tree.insert(tree.root, 2);
tree.insert(tree.root, 5);
tree.xOffset = 100;
tree.insert(tree.root.children[0], 4);
tree.insert(tree.root.children[0], 5);
tree.insert(tree.root.children[1], 6);
tree.insert(tree.root.children[1], 7);
tree.xOffset = 50;
tree.insert(tree.root.children[0].children[0], 8);
tree.insert(tree.root.children[0].children[0], 9);
tree.insert(tree.root.children[0].children[1], 10);
tree.insert(tree.root.children[0].children[1], 11);
tree.insert(tree.root.children[1].children[0], 12);
tree.insert(tree.root.children[1].children[0], 13);
tree.insert(tree.root.children[1].children[1], 14);
tree.insert(tree.root.children[1].children[1], 15);

console.log(tree);
/* Przykładowe drzewo */

/*Inicjalizowanie drzewa*/
if (document.getElementById("myCanvas") != undefined && document.getElementById("myCanvasSearch") != undefined) {
    tree.traverseBFS(true, "myCanvas", false);
    tree.traverseBFS(false, "myCanvasSearch", false);
}

else {
    tree.traverseBFS(false, "myCanvas", false);
}

/* Listenery */
var btnClear = document.getElementById("btnClear");
var btnBFS = document.getElementById("btnBFS");
var btnDFS_IN = document.getElementById("btnDFS_IN");
var btnDFS_POST = document.getElementById("btnDFS_POST");
var btnDFS_PRE = document.getElementById("btnDFS_PRE");

var btnClearSearch = document.getElementById("btnClearSearch");
var btnBFSSearch = document.getElementById("btnBFSSearch");
var btnDFS_INSearch = document.getElementById("btnDFS_INSearch");
var btnDFS_POSTSearch = document.getElementById("btnDFS_POSTSearch");
var btnDFS_PRESearch = document.getElementById("btnDFS_PRESearch");

if (btnClear != undefined) {
    btnClear.addEventListener("click", function () {
        tree.traverseBFS(false, "myCanvas", false);
    }, false);
}

if (btnBFS != undefined) {
    btnBFS.addEventListener("click", function () {
        tree.traverseBFS(true, "myCanvas", true)
    }, true);
}

if (btnDFS_IN != undefined) {
    btnDFS_IN.addEventListener("click", function () {
        console.log(tree.traverseDFS("in", "myCanvas"));
    });
}
if (btnDFS_POST != undefined) {
    btnDFS_POST.addEventListener("click", function () {
        console.log(tree.traverseDFS("post", "myCanvas"));
    });
}
if (btnDFS_PRE != undefined) {
    btnDFS_PRE.addEventListener("click", function () {
        console.log(tree.traverseDFS("pre", "myCanvas"));
    });
}

//SEARCH
if (btnClearSearch != undefined) {
    btnClearSearch.addEventListener("click", function () {
        tree.traverseBFS(false, "myCanvasSearch", false);
    }, false);
}

if (btnBFSSearch != undefined) {
    btnBFSSearch.addEventListener("click", function () {
        var searched = document.getElementById("searchInput");
        if (searched != undefined)
            searched = searched.value;

        tree.traverseBFS(true, "myCanvasSearch", true, searched)
    }, true);
}

if (btnDFS_INSearch != undefined) {
    btnDFS_INSearch.addEventListener("click", function () {
        var searched = document.getElementById("searchInput");
        if (searched != undefined)
            searched = searched.value;

        console.log(tree.traverseDFS("in", "myCanvasSearch", searched));
    });
}
if (btnDFS_POSTSearch != undefined) {
    btnDFS_POSTSearch.addEventListener("click", function () {
        var searched = document.getElementById("searchInput");
        if (searched != undefined)
            searched = searched.value;

        console.log(tree.traverseDFS("post", "myCanvasSearch", searched));
    });
}
if (btnDFS_PRESearch != undefined) {
    btnDFS_PRESearch.addEventListener("click", function () {
        var searched = document.getElementById("searchInput");
        if (searched != undefined)
            searched = searched.value;

        console.log(tree.traverseDFS("pre", "myCanvasSearch", searched));
    });
}
