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
    if(!fnon_is_downloading()) {return;}
    fnon_update_downloading(documentNode.url);

    jQuery.ajax({
        url:documentNode.url,
        type:'get',
        dataType:'html',
        error: function(data){
            fnon_panic("An error occurred while downloading " + documentNode.url);
        },
        success: function(data) {
            var webcontent = jQuery(data).find("#content-core").html();

            var turndownService = new TurndownService();
            documentNode.data = turndownService.turndown(webcontent);

            callback();
        }
    });
}

function download_file(fileNode, callback){
    if(!fnon_is_downloading()) {return;}
    fnon_update_downloading(fileNode.name);

    $.ajax({
        type: "GET",
        url: fileNode.url,
        beforeSend: function (xhr) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        },
        error: function(data){
            fnon_panic("An error occurred while downloading " + fileNode.url);
        },
        success: function (result, textStatus, jqXHR) {
            var binary = "";
            var responseText = jqXHR.responseText;
            var responseTextLen = responseText.length;
        
            for ( i = 0; i < responseTextLen; i++ ) {
                binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
            }
        
            fileNode.data = btoa(binary);
            callback();
        }
      });
}

// FUNCTION TO CREATE ZIP

function createArchive(tree, callback){
    if(!fnon_is_downloading()) return;
    // Use jszip
    var zip = new JSZip();
    fnon_update_compressing(' file tree ...');

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

    fnon_update_compressing(tree.root.name+".zip");

    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        console.log("OCW-A-D: Saving file " + tree.root.name+".zip");
        saveAs(content, tree.root.name+".zip");
        callback();
    });
}
