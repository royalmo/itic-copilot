/*
This file is executed when downloading all the files
of a subject in the https://ocwitic.epsem.upc.edu webpage.

It has secondary functions for download_subject.js.

This file is part of iTIC Copilot extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/itic-copilot .
*/

// FUNCTIONS TO DOWNLOAD OCW CONTENT

LINK_TEMPLATE_WINDOWS = '[InternetShortcut]\nURL={0}\n';
LINK_TEMPLATE_LINUX   = '[Desktop Entry]\nEncoding=UTF-8\nName={1}\nType=Link\nURL={0}'
LINK_TEMPLATE_MACOS   = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n    <key>URL</key>\n    <string>{0}</string>\n</dict>\n</plist>\n';

function download_ocw_link(linkNode) {
    let os = get_os();
    if (os == "Windows") {
        linkNode.data = LINK_TEMPLATE_WINDOWS.replace('{0}', linkNode.url);
        linkNode.name += ".url";
    }
    else if (os == "Linux") {
        linkNode.data = LINK_TEMPLATE_LINUX.replace('{0}', linkNode.url).replace('{1}', linkNode.name);
        linkNode.name += ".desktop";
    }
    else if (os == "MacOS") {
        linkNode.data = LINK_TEMPLATE_MACOS.replace('{0}', linkNode.url);
        linkNode.name += ".webloc";
    }
    else {
        linkNode.data = linkNode.url;
        linkNode.name += ".txt";
    }
}

function download_document(documentNode, callback) {
    if(!fnon_is_downloading()) {return;}
    fnon_update_downloading(documentNode.url);

    jQuery.ajax({
        url:documentNode.url,
        type:'get',
        dataType:'html',
        error: function(data){
            fnon_panic(browser.i18n.getMessage('error_downloading_subject', documentNode.url));
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
            fnon_panic(browser.i18n.getMessage('error_downloading_subject', fileNode.url));
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

function download_image(imgNode, callback){
    if(!fnon_is_downloading()) {return;}
    fnon_update_downloading(imgNode.name);
    
    jQuery.ajax({
        url:imgNode.url,
        type:'get',
        dataType:'html',
        error: function(data){
            fnon_panic(browser.i18n.getMessage('error_downloading_subject', imgNode.url));
        },
        success: function(data) {
            imgNode.url = jQuery(data).find('a.discreet').children("img").first().attr('src');

            // Downloading the image doesn't seem to work, we will save the url instead.
            // imgNode.name += imgNode.url.substring(imgNode.url.lastIndexOf('.'));
            // download_file(imgNode, callback);
            download_ocw_link(imgNode);
            callback();
        }
    });
}

// FUNCTION TO CREATE ZIP

function createArchive(tree, callback){
    if(!fnon_is_downloading()) return;
    // Use jszip
    var zip = new JSZip();
    fnon_update_compressing(tree.root.name+".zip");

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
        else if (node.nodeType == LINK || (node.nodeType == IMAGE && node.hasBeenDownloaded)) {
            node.parent.data.file(node.name, node.data);
        }
    }

    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        console.log(browser.i18n.getMessage("log_saving_zip", tree.root.name));
        saveAs(content, tree.root.name+".zip");
        callback();
    });
}
