/*
This file is executed when downloading all the files
of a subject in the https://ocwitic.epsem.upc.edu webpage.

It contains a simple File Tree Structure with classes, to
make easier to sort the downloaded files.

This file is part of iTIC Copilot extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/itic-copilot .
*/

FOLDER = 0;
FILE = 1;
LINK = 2;
DOCUMENT = 3;
IMAGE = 4;

unknown_text = browser.i18n.getMessage("ocw_downloader_unknown")

class OcwTreeNode {
    constructor(url, nodeType, name = unknown_text, parent = null, navTreeLevel = null) {
        this.url = url;
        this.nodeType = nodeType;
        this.name = name;
        this.parent = parent;
        this.children = [];
        this.data = null;
        this.navTreeLevel = navTreeLevel===null? this.parent.navTreeLevel+1 : navTreeLevel;
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

    // Used to say that a folder has been seen.
    folderChecked() {
        this.data = 0;
    }
}
  
class OcwTree {
    constructor(rootURL, rootName = unknown_text, startLevel = 1, rootNodeType = FOLDER) {
        this.root = new OcwTreeNode(rootURL, rootNodeType, rootName, null, startLevel);
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

    insert(parentNodeURL, newNodeURL, newNodeType, newNodeName = unknown_text) {
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