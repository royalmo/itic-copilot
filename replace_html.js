
var links = document.querySelectorAll("a");
var i;

for (i = 0; i<links.length; i++) {
    if (links[i].href.includes("@@download")) {
        links[i].parentElement.innerHTML = links[i].parentElement.innerHTML + '<a href="' + links[i].href.replace("@@download", "@@display-file") + '" style="color:grey;font-size:10px">[<em>View</em>]</a>';
    }
}

var spans = document.querySelectorAll("span");

for (i = 0; i<spans.length; i++) {
    if (spans[i].classList.contains('summary') && spans[i].children[0].classList.contains('contenttype-file')) {
        spans[i].innerHTML = spans[i].innerHTML + '<a href = "' + spans[i].children[0].href.replace('/view', '') + '" style="color:grey;font-size:10px">[<em>View</em>]</a>';
    }
}

var subjects = document.querySelectorAll("dd");

for (i=0; i<subjects.length; i++) {
    if (subjects[i].classList.contains('doormatSectionBody')) {
        subjects[i].innerHTML = subjects[i].innerHTML + '<a class="ocw-anti-d-lnk" style="color:#2F4F4F; font-size:10px;" href="#" lnk="' + subjects[i].firstChild.href + '"> [<em>Download all</em>]</a>'
    }
}

console.log("Done replacing links!");

//////////////////////////////////////////////////////////////////////

// Bind to static elements
$(function() {
    $('a.ocw-anti-d-lnk').click(download_subjects);
  });

function download_subjects(e) {
    link = e.currentTarget.parentElement.firstChild.href;
    console.log("Download base link: " + link);
    alert("This part of the OCW anti-downloader extension isn't ready yet! \nUpdate to the newest version or wait for the newer version.")
}