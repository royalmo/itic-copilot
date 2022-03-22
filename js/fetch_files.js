/*
This file is executed when downloading all the files
of a subject in the https://ocwitic.epsem.upc.edu webpage.

It has secondary functions for download_subject.js.

This file is part of OCW-Anti-Download extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/ocw-anti-download .
*/

// FUNCTIONS TO DOWNLOAD OCW CONTENT

function download_document(documentNode, callback) {
    console.log("Downloading document: " + documentNode.url);

    jQuery.ajax({
        url:documentNode.url,
        type:'get',
        dataType:'html',
        success: function(data) {
            var webcontent = jQuery(data).find("#content-core").html();

            var turndownService = new TurndownService();
            documentNode.data = turndownService.turndown(webcontent);

            callback();
        }
    });
}

function download_ocw_file_link(linkNode) {
    console.log("Downloading link: " + linkNode.url);
    linkNode.data = '[InternetShortcut]\nURL=' + linkNode.url + '\n';
}

function download_file(fileNode, callback) {
    console.log("Downloading file: " + fileNode.url);

    var b = getBinary(fileNode.url);
    var b64 = base64Encode(b);
    fileNode.data = b64;

    console.log("Saved file: " + fileNode.url);
    callback();
}


// FUNCTIONS TO DOWNLOAD AND ENCODE BASE64 FILES

function getBinary(file){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, false);
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.send(null);
    return xhr.responseText;
}

function base64Encode(str) {
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "", i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
}


// FUNCTION TO CREATE ZIP

function createArchive(tree){
    // Use jszip
    var zip = new JSZip();

    for (let node of tree.preOrderTraversal()) {
        if (node.nodeType == FOLDER) {
            let folder_root = node.isRoot? zip : node.parent.data;
            node.data =  folder_root.folder(node.name);
        }
        else if (node.nodeType == FILE && node.hasBeenDownloaded) {
            let prevtitle = node.url.substring(node.url.lastIndexOf('/')+1);
            let title = prevtitle + (prevtitle.includes('.')? '':'.pdf' );
            node.parent.data.file(title, node.data, {base64: true});
        }
        else if (node.nodeType == DOCUMENT && node.hasBeenDownloaded) {
            node.parent.data.file(node.name+'.md', node.data);
        }
        else if (node.nodeType == LINK) {
            node.parent.data.file(node.name+'.url', node.data);
        }
    }

    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        saveAs(content, tree.root.name+".zip");
    });
}
