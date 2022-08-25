(async function () {
    if (! await itic_copilot.settings.get('itic_copilot.easter_eggs')) return;

    $('table').click(function (e) {
        e.target.style.transform = 'rotate(90deg)';
    })
})();