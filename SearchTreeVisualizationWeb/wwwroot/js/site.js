class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.position = { x: 0, y: 0 };
        this.radius = 20;
    }
}

class BinarySeachTree {
    constructor() {
        this.root = null
        this.startPosition = { x: 500, y: 44 };
        this.axisX = 250;
        this.axisY = 90;
    }

    insert(value) {
        var newNode = new Node(value);
        if (this.root === null) {
            newNode.position = this.startPosition;
            this.root = newNode;
            return this;
        }
        let current = this.root;
        while (current) {
            if (value === current.value) return undefined;
            if (value < current.value) {
                if (current.left === null) {
                    newNode.position = { x: current.position.x - this.axisX + current.position.y*0.4, y: current.position.y + this.axisY }
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (current.right === null) {
                    newNode.position = { x: current.position.x + this.axisX - current.position.y*0.4, y: current.position.y + this.axisY }
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    };
    async find(value) {
        if (!this.root) return false

        var c = document.getElementById("myCanvasFind");
        if (c != undefined) {
            var ctx = c.getContext("2d");
        }

        if (ctx == undefined)
            return;
            

        const black = "#000";

        let current = this.root
        let found = false

        while (current && !found) {
            await sleep(1000);

            const { x, y } = current.position;
            const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

            ctx.beginPath();
            ctx.arc(x, y, current.radius, 0, 2 * Math.PI)
            ctx.strokeStyle = black;
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = black;
            ctx.font = "25px Georgia";
            ctx.strokeText(current.value, x - 8, y + 4);

            if (value < current.value) {
                const { x: x1, y: y1 } = current.left.position;
                ctx.beginPath();
                ctx.moveTo(x, y + current.left.radius);
                ctx.lineTo(x1, y1 - current.left.radius);
                ctx.stroke();
                current = current.left

            } else if (value > current.value) {
                const { x: x1, y: y1 } = current.right.position;
                ctx.beginPath();
                ctx.moveTo(x, y + current.right.radius)
                ctx.lineTo(x1, y1 - current.right.radius)
                ctx.stroke()
                current = current.right
            } else {
                found = current
            }
        }

        if (!found) return undefined;
        return found


    };
    BFS() {
        let visited = [],
            queue = [],
            current = this.root;

        var c = document.getElementById("myCanvas")

        if(c!= undefined)
            var ctx = c.getContext("2d")

        const black = "#000"

        queue.push(current);
        while (queue.length) {
            current = queue.shift();
            visited.push(current.value);

            const { x, y } = current.position;
            const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

            ctx.beginPath();
            ctx.arc(x, y, current.radius, 0, 2 * Math.PI)
            ctx.strokeStyle = black;
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = black;
            ctx.font = "25px Georgia";
            ctx.strokeText(current.value, x-8, y+4);

            if (current.left) {
                const { x: x1, y: y1 } = current.left.position;
                ctx.beginPath();
                ctx.moveTo(x, y + current.left.radius);
                ctx.lineTo(x1, y1 - current.left.radius);
                ctx.stroke();
                queue.push(current.left);
            }

            if (current.right) {
                const { x: x1, y: y1 } = current.right.position;
                ctx.beginPath();
                ctx.moveTo(x, y + current.right.radius)
                ctx.lineTo(x1, y1 - current.right.radius)
                ctx.stroke()
                queue.push(current.right);
            }
        };

        return visited;
    };
    preOrder() {
        let visited = [],
            current = this.root;

        var c = document.getElementById("myCanvas")

        if(c!=undefined)
            var ctx = c.getContext("2d")

        if (ctx == undefined)
            return;

        const black = "#000"

        let traverse = node => {
            visited.push(node.value);

            const { x, y } = node.position;
            const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

            if (ctx != undefined) {
                ctx.beginPath();
                ctx.arc(x, y, node.radius, 0, 2 * Math.PI)
                ctx.strokeStyle = black;
                ctx.fillStyle = color;
                ctx.fill();
                ctx.stroke();
                ctx.strokeStyle = black;
                ctx.font = "25px Georgia";
                ctx.strokeText(node.value, x - 8, y + 4);

                if (node.left) {
                    const { x: x1, y: y1 } = node.left.position;
                    ctx.beginPath();
                    ctx.moveTo(x, y + node.left.radius);
                    ctx.lineTo(x1, y1 - node.left.radius);
                    ctx.stroke();
                    traverse(node.left);
                }
                if (node.right) {
                    const { x: x1, y: y1 } = node.right.position;
                    ctx.beginPath();
                    ctx.moveTo(x, y + node.right.radius)
                    ctx.lineTo(x1, y1 - node.right.radius)
                    ctx.stroke()
                    traverse(node.right);
                }
            }
           
        };

        traverse(current);
        return visited;
    };
    postOrder() {
        let visited = [],
            current = this.root;

        let traverse = node => {
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
            visited.push(node.value);
        };

        traverse(current);
        return visited;
    };
    inOrder() {
        let visited = [],
            current = this.root;

        let traverse = node => {
            if (node.left) traverse(node.left);
            visited.push(node.value);
            if (node.right) traverse(node.right);
        };

        traverse(current);
        return visited;
    };
}

var tree = new BinarySeachTree();
//tree.insert(20);
//tree.insert(14);
//tree.insert(57);
//tree.insert(9);
//tree.insert(19);
//tree.insert(31);
//tree.insert(62);
//tree.insert(3);
//tree.insert(11);
//tree.insert(72);

/*tree.insert(1);
tree.insert(2);
tree.insert(7);
tree.insert(3);
tree.insert(10);
tree.insert(5);
tree.insert(11);
tree.insert(4);
tree.insert(6);
tree.insert(12);*/

for (var i = 0; i < 20; i++) {
    tree.insert(getRandomInt(0, 20));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


//console.log(tree.BFS()); //[ 20, 14, 57, 9, 19, 31, 62, 3, 11, 72 ]
//console.log(tree.postOrder());
//console.log(tree.inOrder());
console.log(tree.preOrder());
//console.log(tree.find(4));



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function add() {
    var input = document.getElementById("node");

    if (input.value != undefined && input.value != '') {
        tree.insert(parseInt(input.value));
        console.log(tree.preOrder());
        input.value = "";
    }
    else {
        alert('Musisz wprowadzić wartość!')
    }
}

function clearTree() {
    tree = new BinarySeachTree();

    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);


    canvas = document.getElementById("myCanvasFind");
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function findNode() {
    var input = document.getElementById("findNode");

    if (input.value != undefined && input.value != '') {
        tree.find(parseInt(input.value));
        console.log(tree.preOrder());
        input.value = "";
    }
    else {
        alert('Musisz wprowadzić wartość!')
    }
}