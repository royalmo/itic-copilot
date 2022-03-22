/*
This file is executed when downloading all the files
of a subject in the https://ocwitic.epsem.upc.edu webpage.

It contains a simple File Tree Structure with classes, to
make easier to sort the downloaded files.

This file is part of OCW-Anti-Download extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/ocw-anti-download .
*/

FOLDER = 0;
FILE = 1;
LINK = 2;
DOCUMENT = 3;

class OcwTreeNode {
    constructor(url, nodeType, name = "Unknown", parent = null) {
        this.url = url;
        this.nodeType = nodeType;
        this.name = name;
        this.parent = parent;
        this.children = [];
        this.data = null;
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get hasChildren() {
        return !this.isLeaf;
    }

    get hasBeenDownloaded() {
        return this.data != null;
    }

    get isRoot() {
        return this.parent == null;
    }

    get hasParent() {
        return !this.isRoot;
    }

    get navTreeLevel() {
        return this.isRoot? 1 : this.parent.navTreeLevel+1;
    }

    // Used to say that a folder has been seen.
    folderChecked() {
        this.data = 0;
    }
}
  
class OcwTree {
    constructor(rootURL, rootName = "Unknown", rootNodeType = FOLDER) {
        this.root = new OcwTreeNode(rootURL, rootNodeType, rootName);
    }

    *preOrderTraversal(node = this.root) {
        yield node;
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    *postOrderTraversal(node = this.root) {
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.postOrderTraversal(child);
            }
        }
        yield node;
    }

    insert(parentNodeURL, newNodeURL, newNodeType, newNodeName = "Unknown") {
        for (let node of this.preOrderTraversal()) {
            if (node.url === parentNodeURL) {
                return this.insert_with_node(node, newNodeURL, newNodeType, newNodeName);
            }
        }
        return false;
    }

    insert_with_node(parentNode, newNodeURL, newNodeType, newNodeName = "Unknown") {
        let newNodeObject = new OcwTreeNode(newNodeURL, newNodeType, newNodeName, parentNode)
        parentNode.children.push(newNodeObject);
        return newNodeObject            
    }

    remove(url) {
        for (let node of this.preOrderTraversal()) {
            const filtered = node.children.filter(c => c.url !== url);
            if (filtered.length !== node.children.length) {
                node.children = filtered;
                return true;
            }
        }
        return false;
    }

    find(url) {
        for (let node of this.preOrderTraversal()) {
            if (node.url === url) return node;
        }
        return undefined;
    }

    get length() {
        var i = 0;
        for (let node of this.preOrderTraversal()) { i++; }
        return i;
    }

    get all_downloaded() {
        for (let node of this.preOrderTraversal()) {
            if (!node.hasBeenDownloaded) { return false; }
        }

        return true
    }
}