/*
This file is executed when downloading all the files
of a subject in the https://ocwitic.epsem.upc.edu webpage.

It looks for all the files in the file tree, downloads
them and packs them in a .zip file, prompted to download.

This file is part of OCW-Anti-Download extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/ocw-anti-download .
*/

// Used to link 'Download subject' links into the function.
$(function() {
    $('a.ocw-anti-d-lnk').click(download_subject);
});


// Function called when we want to download a subject.
function download_subject(e) {
    var link = e.currentTarget.parentElement.children[0].href;
    var subject_name = e.currentTarget.parentElement.children[0].innerHTML; // 0.413 0.161 0.087 0.248

    console.log(browser.i18n.getMessage("log_download_start", [subject_name, link]));
    fnon_init_wait(subject_name, link);

    // Creating File Tree
    tree = new OcwTree(link, subject_name);
    download_folder(tree.root);
}

function download_subject_continuation() {
    if (!tree.all_downloaded) {return;}

    console.log(browser.i18n.getMessage("log_download_tree", String(tree.length)));

    // Downloading files
    createArchive(tree, function() {
        fnon_kill_wait();
        fnon_alert(browser.i18n.getMessage("success_downloading_subject", tree.root.name), browser.i18n.getMessage("done"));
    });
}


// Fetches all the contents of a folder. Half-recursive.
function download_folder(folderNode) {
    if(!fnon_is_downloading()) {return;}
    fnon_update_downloading(folderNode.url);

    // Getting html
    jQuery.ajax({
        url:folderNode.url,
        type:'get',
        dataType:'html',
        error: function(data) {
            fnon_panic(browser.i18n.getMessage("error_downloading_subject", folderNode.url));
        },
        success: function(data){

            // Parsing
            var _html= jQuery(data);
            var _navTree = _html.find(".navTreeLevel" + folderNode.navTreeLevel);

            // Empty folder
            if(_navTree.html() == null) {
                if (folderNode.isRoot) {
                    fnon_panic(browser.i18n.getMessage("error_subject_empty"));
                    return;
                }
                // Telling that we checked the folder
                folderNode.folderChecked();
                download_subject_continuation();
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
                    let new_element = tree.insert_with_node(folderNode, link, FOLDER, name);
                    download_folder(new_element);
                }
                else if (anchor.classList.contains('contenttype-file')) {
                    let download_link = link.replace("/view", "");

                    let new_element = tree.insert_with_node(folderNode, download_link, FILE, name);
                    download_file(new_element, download_subject_continuation);
                }
                else if (anchor.classList.contains('contenttype-document')) {
                    let new_element = tree.insert_with_node(folderNode, link, DOCUMENT, name);
                    download_document(new_element, download_subject_continuation);
                }
                else if (anchor.classList.contains('contenttype-link')) {
                    let new_element = tree.insert_with_node(folderNode, link, LINK, name);
                    download_ocw_link(new_element);
                }
                // Debug
                else {console.log(anchor);}
            }

            // Telling that we checked the folder
            folderNode.folderChecked();

            // End download loop
            download_subject_continuation();
        }
    });
}
