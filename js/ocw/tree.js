/*
 * Copyright (C) 2022 Eric Roy
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see http://www.gnu.org/licenses/.
*/


/*
 * This file contains the classes for the OpenCourseWare file trees. It also
 * has some methods to deal with them.
*/

itic_copilot.tree = {};

// Enum for file type
itic_copilot.tree.FOLDER = 0;
itic_copilot.tree.FILE = 1;
itic_copilot.tree.LINK = 2;
itic_copilot.tree.DOCUMENT = 3;
itic_copilot.tree.IMAGE = 4;

itic_copilot.tree.OcwTreeNode = class {
    constructor(url, nodeType, name = t("ocw_downloader_unknown"), parent = null, navTreeLevel = null) {
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

itic_copilot.tree.OcwTree = class {
    constructor(rootURL, rootName = t("ocw_downloader_unknown"), startLevel = 1, rootNodeType = itic_copilot.tree.FOLDER) {
        this.root = new itic_copilot.tree.OcwTreeNode(rootURL, rootNodeType, rootName, null, startLevel);
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

    insert(parentNodeURL, newNodeURL, newNodeType, newNodeName = t("ocw_downloader_unknown")) {
        for (let node of this.preOrderTraversal()) {
            if (node.url === parentNodeURL) {
                return this.insert_with_node(node, newNodeURL, newNodeType, newNodeName);
            }
        }
        return false;
    }

    insert_with_node(parentNode, newNodeURL, newNodeType, newNodeName = t("ocw_downloader_unknown")) {
        let newNodeObject = new itic_copilot.tree.OcwTreeNode(newNodeURL, newNodeType, newNodeName, parentNode)
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
