
$('#btn-loading').hide();
$('#btn-send').show();
$('#frame-result').hide();

function call(sentence, characters) {
    if (sentence && sentence.length > 0) {
        const $btnSubmit = $('#btn-send');
        const $btnLoading = $('#btn-loading');
        const $frameResult = $('#frame-result');

        $btnLoading.show();
        $btnSubmit.hide();

        $.ajax({
            type: "POST",
            url: '/submit',
            dataType: 'json',
            data: {
                sentence: sentence,
                characters: characters
            },
            success: function (res) {
                if (res) {
                    $('#result').html(res.sentence);

                    $btnLoading.hide();
                    $btnSubmit.show();
                    $frameResult.show();
                }
            },
        });
    }
}

function getValue() {
    const sentence = $('#sentence').val();
    const characters = $('#characters-split').find('option:selected').val();
    call(sentence, characters);
}