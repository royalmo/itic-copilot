form = $('#form');
    
// Adding action URL
$.getJSON(browser.extension.getURL('/config/links.json'), function(links) {
    form.attr('action', links['see_schedule']);

    // Adding current subjects
    itic_copilot.settings.get('subjects').then( subjects => {

        subjects.forEach(subj => { // subj[1] is the full code
            form.append('<input type="checkbox" value="' + subj[1] + '" name="checkbox[]" checked>');
        });

        // Sending
        form.submit();
    });
});