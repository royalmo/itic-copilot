/*
This file is executed when downloading all the files
of a subject in the https://ocwitic.epsem.upc.edu webpage.

It has secondary functions for download_subject.js.

This file is part of OCW-Anti-Download extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/ocw-anti-download .
*/

// FUNCTIONS TO DOWNLOAD OCW CONTENT

function download_document(documentNode) {
    console.log("Downloading document: " + documentNode.url);
}

function download_link(linkNode) {
    console.log("Downloading link: " + linkNode.url);

    var xhr = new XMLHttpRequest();

    $.ajax({
        url: linkNode.url,
        type: 'get',
        xhr: function() { return xhr; },
        success: function () {
            linkNode.data = xhr.responseURL;
        }
    });
}

function download_file(fileNode) {
    console.log("Downloading file: " + fileNode.url);

    var b = getBinary(fileNode.url);
    var b64 = base64Encode(b);
    fileNode.data = b64;

    console.log("Saved file: " + fileNode.url);
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

function createArchive(rootNode){
    // Use jszip
    var zip = new JSZip();

    for (let node of rootNode.preOrderTraversal()) {
        if (node.nodeType == FOLDER) {
            let folder_root = node.isRoot? zip : node.parent.data;
            node.data =  folder_root.folder(node.name);
        }
        else if (node.hasBeenDownloaded) {
            let title = node.name + (node.name.includes('.')? '':'.pdf' );
            node.parent.data.file(title, node.data, {base64: true});
        }
    }

    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        saveAs(content, rootNode.root.name+".zip");
    });
}
