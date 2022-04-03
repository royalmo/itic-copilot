/*
This file is executed when needing to replace some parts
of the https://ocwitic.epsem.upc.edu webpage.

It adds some extra links to prevent forced downloads.
It also adds some extra links to download all things at once.

This file is part of OCW-Anti-Download extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/ocw-anti-download .
*/

function replace_html() {
    // Removing fored download
    var links = document.querySelectorAll("a");
    var i;

    for (i = 0; i<links.length; i++) {
        if (links[i].href.includes("@@download")) {
            links[i].parentElement.innerHTML = links[i].parentElement.innerHTML + '<a href="' + links[i].href.replace("@@download", "@@display-file") + '" style="color:grey;font-size:10px">[<em>View</em>]</a>';
        }
    }

    // Adding extra download links
    var spans = document.querySelectorAll("span");

    for (i = 0; i<spans.length; i++) {
        if (spans[i].classList.contains('summary') && spans[i].children[0].classList.contains('contenttype-file')) {
            spans[i].innerHTML = spans[i].innerHTML + '<a href = "' + spans[i].children[0].href.replace('/view', '') + '" style="color:grey;font-size:10px">[<em>View</em>]</a>';
        }
        if (spans[i].classList.contains('summary') && spans[i].children[0].classList.contains('contenttype-assignatura')) {
            spans[i].innerHTML = spans[i].innerHTML + '<a class="ocw-anti-d-lnk" style="color:#2F4F4F; font-size:10px;" href="#"> [<em>Download all</em>]</a>';
        }
    }

    // Adding download subjects links
    var subjects = document.querySelectorAll("dd");

    for (i = 0; i<subjects.length; i++) {
        if (subjects[i].classList.contains('doormatSectionBody')) {
            subjects[i].innerHTML = subjects[i].innerHTML + '<a class="ocw-anti-d-lnk" style="color:#2F4F4F; font-size:10px;" href="#"> [<em>Download all</em>]</a>';
        }
    }

    console.log("OCW-A-D: Done replacing links!");
}

function get_os() {
    /* Returns "Windows", "Linux", "MacOS" */
    /* Default value (if not found) is Windows */
    let os_info = jscd.os;
    if (os_info.includes("Linux")) return "Linux";
    if (os_info.includes("Mac")) return "MacOS";
    return "Windows";
}

// For the moment this functionality is always active.
replace_html();
