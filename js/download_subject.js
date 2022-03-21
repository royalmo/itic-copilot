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
    var link = e.currentTarget.parentElement.firstChild.href;
    var subject_name = e.currentTarget.parentElement.firstChild.innerHTML;

    console.log("OCW-A-D: Downloading " + subject_name + ". Base link: " + link);

    // Creating File Tree
    root = new OcwTree(link, subject_name);
    download_folder(root.root);
    console.log("OCW-A-D: Got tree with " + root.length + " urls.");

    // Downloading files
    save(urls);
}


// Fetches all the contents of a folder. Half-recursive.
function download_folder(folderNode) {
    if (folderNode.hasParent) {
        console.log("Download folder (" + folderNode.navTreeLevel + "): " + folderNode.url);
    }

    // Getting html
    jQuery.ajax({
        url:folderNode.url,
        type:'get',
        dataType:'html',
        success: function(data, folderNode){

            // Parsing
            var _html= jQuery(data);
            var _navTree = _html.find(".navTreeLevel" + folderNode.navTreeLevel);

            // Empty folder
            if(_navTree.html() == null) {
                if (folderNode.isRoot) {
                    alert("This subject has no files to download!");
                }
                // Telling that we checked the folder
                folderNode.folderChecked();
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
                    let new_element = root.insert_with_node(folderNode, link, FOLDER, name);
                    download_folder(new_element);
                }
                else if (anchor.classList.contains('contenttype-file')) {
                    download_link = link.replace("/view", "");

                    let new_element = root.insert_with_node(folderNode, link, FILE, name);
                    download_file(new_element);
                }
                else if (anchor.classList.contains('contenttype-document')) {
                    let new_element = root.insert_with_node(folderNode, link, DOCUMENT, name);
                    download_document(new_element);
                }
                else if (anchor.classList.contains('contenttype-link')) {
                    let new_element = root.insert_with_node(folderNode, link, LINK, name);
                    download_link(new_element);
                }
                // Debug
                else {console.log(anchor);}
            }

            // Telling that we checked the folder
            folderNode.folderChecked();
        }
    });
}
