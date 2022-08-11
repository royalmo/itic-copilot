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
This file contains the methods needed to download a group of files (foler, subject or quadrimester).
*/

(function() {

    LINK_TEMPLATE_WINDOWS = '[InternetShortcut]\nURL={0}\n';
    LINK_TEMPLATE_LINUX   = '[Desktop Entry]\nEncoding=UTF-8\nName={1}\nType=Link\nURL={0}'
    LINK_TEMPLATE_MACOS   = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n    <key>URL</key>\n    <string>{0}</string>\n</dict>\n</plist>\n';


    itic_copilot.ocw.link_download_buttons = function() {
        $(function() {
            $('a.copilot_download_subject').click(download_subject);
        });

        $(function() {
            $('a.copilot_download_quadrimester').click(download_quadrimester);
        });

        $(function() {
            $('a.copilot_download_folder').click(download_folder);
        });
    };


    function download_folder() {
        var title = document.querySelector('h1').innerHTML;
        var link = window.location.href;
    
        var classes = document.getElementsByClassName('navTreeCurrentItem contenttype-folder')[0].parentElement.parentElement.classList;
        var navlevel = 1;
        for (var i=0; i<classes.length; i++){
            if (typeof classes[i] === 'string' && classes[i].startsWith('navTreeLevel')) {
                navlevel = parseInt(classes[i].slice(classes[i].lastIndexOf("l")+1))+1;
                break;
            }
        }
    
        itic_copilot.log("ocw_start_folder_download", [title, link]);
        itic_copilot.fnon.wait(title);
    
        // Creating File Tree
        tree = new itic_copilot.tree.OcwTree(link, title, navlevel);
        download_folder_recursive(tree.root);
    }

    function download_subject(e) {
        var link = e.currentTarget.parentElement.children[0].href;
        var subject_name = e.currentTarget.parentElement.children[0].innerHTML;

        itic_copilot.log("ocw_start_subject_download", [subject_name, link]);
        itic_copilot.fnon.wait(subject_name, link);

        // Creating File Tree
        tree = new itic_copilot.tree.OcwTree(link, subject_name);
        download_folder_recursive(tree.root);
    }

    function download_quadrimester(e) {
        var subjects = e.currentTarget.parentElement.parentElement.children;
        var quadrimester_name = e.currentTarget.parentElement.innerHTML;

        quadrimester_name = quadrimester_name.substring(0, quadrimester_name.indexOf('<a'));

        itic_copilot.log("ocw_start_quatrimester_download", quadrimester_name);

        tree = new itic_copilot.tree.OcwTree(link, quadrimester_name, 0);
        itic_copilot.fnon.wait(quadrimester_name, 'a');

        for(var i = 0; i<subjects.length; i++) {
            if (! subjects[i].classList.contains('doormatSectionBody')) continue;

            var link = subjects[i].children[0].href;
            var subject_name = subjects[i].children[0].innerHTML;

            let new_element = tree.insert_with_node(tree.root, link, FOLDER, subject_name);

            download_folder_recursive(new_element);
        }

        tree.root.folderChecked();
    }


    function download_folder_continuation() {
        if (!tree.all_downloaded) {return;}

        itic_copilot.log("ocw_fetched_tree", String(tree.length));

        // Downloading files
        createArchive(tree, function() {
            itic_copilot.fnon.panic(t("ocw_downloader_success_msg", tree.root.name), t("ocw_downloader_done"));
        });
    }


    function download_folder_recursive(folderNode) {
        if(!itic_copilot.fnon.is_downloading()) {return;} 
        itic_copilot.fnon.update_wait(t("ocw_downloader_fetching_msg", folderNode.url));

        // Getting html
        jQuery.ajax({
            url:folderNode.url,
            type:'get',
            dataType:'html',
            error: function(data) {
                itic_copilot.fnon.panic(t("ocw_downloader_error_msg", folderNode.url));
                itic_copilot.error("ocw_error_download");
            },
            success: function(data){

                // Parsing
                var _html= jQuery(data);
                var _navTree = _html.find(".navTreeLevel" + folderNode.navTreeLevel);

                // Empty folder
                if(_navTree.html() == null) {
                    if (folderNode.isRoot) {
                        itic_copilot.fnon.panic(t("ocw_downloader_empty_subject_msg"));
                        return;
                    }
                    // Telling that we checked the folder
                    folderNode.folderChecked();
                    download_folder_continuation();
                    return;
                }

                // Checking every sub-item and doing what we need to do.
                var sub_items = _navTree.children();
                for (var i=0; i<sub_items.length; i++) {
                    var prev = sub_items[i].children;
                    if (prev.length == 0) continue;

                    var anchor = prev[0];
                    var link = anchor.href;
                    var name = $.trim($(anchor).text());

                    if (anchor.classList.contains('contenttype-folder')) {
                        let new_element = tree.insert_with_node(folderNode, link, itic_copilot.tree.FOLDER, name);
                        download_folder_recursive(new_element);
                    }
                    else if (anchor.classList.contains('contenttype-file')) {
                        let download_link = link.replace("/view", "");

                        let new_element = tree.insert_with_node(folderNode, download_link, itic_copilot.tree.FILE, name);
                        download_file(new_element, download_folder_continuation);
                    }
                    else if (anchor.classList.contains('contenttype-document')) {
                        let new_element = tree.insert_with_node(folderNode, link, itic_copilot.tree.DOCUMENT, name);
                        download_document(new_element, download_folder_continuation);
                    }
                    else if (anchor.classList.contains('contenttype-image')) {
                        let new_element = tree.insert_with_node(folderNode, link, itic_copilot.tree.IMAGE, name);
                        download_image(new_element, download_folder_continuation);
                    }
                    else if (anchor.classList.contains('contenttype-link')) {
                        let new_element = tree.insert_with_node(folderNode, link, itic_copilot.tree.LINK, name);
                        download_ocw_link(new_element);
                    }
                    // Debug
                    //else {console.log(anchor);}
                }

                // Telling that we checked the folder
                folderNode.folderChecked();

                // End download loop
                download_folder_continuation();
            }
        });
    }

    function download_ocw_link(linkNode) {
        let os = itic_copilot.os;
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
        if(!itic_copilot.fnon.is_downloading()) {return;} 
        itic_copilot.fnon.update_wait(t("ocw_downloader_downloading_msg", documentNode.url));

        jQuery.ajax({
            url:documentNode.url,
            type:'get',
            dataType:'html',
            error: function(data){
                itic_copilot.fnon.panic(t('ocw_downloader_error_msg', documentNode.url));
                itic_copilot.error("ocw_error_download");
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
        if(!itic_copilot.fnon.is_downloading()) {return;} 
        itic_copilot.fnon.update_wait(t("ocw_downloader_downloading_msg", fileNode.name));

        $.ajax({
            type: "GET",
            url: fileNode.url,
            beforeSend: function (xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            },
            error: function(data){
                itic_copilot.fnon.panic(t('ocw_downloader_error_msg', fileNode.url));
                itic_copilot.error("ocw_error_download");
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
        if(!itic_copilot.fnon.is_downloading()) {return;}
        itic_copilot.fnon.update_wait(t("ocw_downloader_downloading_msg", imgNode.name));

        jQuery.ajax({
            url:imgNode.url,
            type:'get',
            dataType:'html',
            error: function(data){
                itic_copilot.fnon.panic(t('ocw_downloader_error_msg', imgNode.url));
                itic_copilot.error("ocw_error_download");
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
        if(!itic_copilot.fnon.is_downloading()) {return;}
        // Use jszip
        var zip = new JSZip();
        itic_copilot.fnon.update_wait(t("ocw_downloader_compressing_msg", tree.root.name+".zip"));

        for (let node of tree.preOrderTraversal()) {
            if (node.nodeType == itic_copilot.tree.FOLDER) {
                let folder_root = node.isRoot? zip : node.parent.data;
                node.data =  folder_root.folder(node.name);
            }
            else if (node.nodeType == itic_copilot.tree.FILE && node.hasBeenDownloaded) {
                let prevtitle = node.url.substring(node.url.lastIndexOf('/')+1);
                let title = prevtitle + (prevtitle.includes('.')? '':'.pdf' );
                node.parent.data.file(title, node.data, {base64: true});
            }
            else if (node.nodeType == itic_copilot.tree.DOCUMENT && node.hasBeenDownloaded) {
                node.parent.data.file(node.name+'.md', node.data);
            }
            else if (node.nodeType == itic_copilot.tree.LINK || (node.nodeType == itic_copilot.tree.IMAGE && node.hasBeenDownloaded)) {
                node.parent.data.file(node.name, node.data);
            }
        }

        zip.generateAsync({type:"blob"}).then(function(content) {
            if(!itic_copilot.fnon.is_downloading()) return;

            // see FileSaver.js
            itic_copilot.log("ocw_saving_file", tree.root.name+".zip");
            saveAs(content, tree.root.name+".zip");
            callback();
        });
    }

})();

// TODO change this part into a more intuitive file (?)

// Showing links depending of user's settings.
itic_copilot.settings.get('ocw.show_links').then( value => {
    itic_copilot.ocw.toggle_links(value);
});

itic_copilot.ocw.link_download_buttons();
