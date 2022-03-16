links = document.querySelectorAll("a");

for (i = 0; i<links.length; i++) {
    links[i].href = links[i].href.replace("@@download", "@@display-file");
}

console.log("Done replacing links!")