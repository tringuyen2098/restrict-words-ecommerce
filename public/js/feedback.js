const $btnFeedBack = $('#btn-feed-back');
const $boxFeedBack = $('#box-feedback');
const $btnCloseBox = $('#btn-close-box');
const $btnSendFeedBack = $('#btn-send-feedback');
const $btnLoadingFeedBack = $('#btn-loading-feedback');
const $btnCopy = $('#btn-copy');

// input
const $inputFeedback = $('#input-feedback');
const $selectIndustryGroup = $('select#industry-group');
const $blockSuccess = $('#noti-success');
const $blockError = $('#noti-error');

$btnFeedBack.show();
$boxFeedBack.hide();
$blockSuccess.hide();
$blockError.hide();

$btnFeedBack.on('click', function (e) {
    $btnFeedBack.hide();
    $boxFeedBack.show();
})

$btnCloseBox.on('click', function (e) {
    $btnFeedBack.show();
    $boxFeedBack.hide();
})

$('#btn-copy').on('click', function () {
    copyToClipboard($('#result'));
})

function copyToClipboard(elem) {
        // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem[0].innerText;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }

    return succeed;
}

var $elOtherIndustries = $('#other-industries');
$elOtherIndustries.hide();

$selectIndustryGroup.on('change', function (e) {
    if(e.target.value == 0) {
        $elOtherIndustries.show();        
    } else {
        $elOtherIndustries.hide();
    }
})



$btnSendFeedBack.show();
$btnLoadingFeedBack.hide();


function callSubmitFeedback(valueInputFeedback, valueIndustryGroup, valueOtherIndustryGroup) {
    $btnSendFeedBack.hide();
    $btnLoadingFeedBack.show();
    $blockError.hide();
    $blockSuccess.hide();

    let payload = {
        word: valueInputFeedback,
        group: valueIndustryGroup
    }

    if(valueOtherIndustryGroup && valueOtherIndustryGroup.length > 0) {
        payload.otherGroup = valueOtherIndustryGroup;
    }

    $.ajax({
        type: "POST",
        url: '/submit-feedback',
        dataType: 'json',
        data: payload,
        success: function (res) {
            if (res && res.success) {
                $btnSendFeedBack.show();
                $btnLoadingFeedBack.hide();
                $blockError.hide();
                $inputFeedback.val('');
                $blockSuccess.show();

                setTimeout(function() {
                    $blockSuccess.hide()
                }, 2000);

            } else {
                $blockError.show();
                setTimeout(function() {
                    $blockError.hide()
                }, 2000)
            }
        },
    });
}


$btnSendFeedBack.on('click', function () {
    const valueInputFeedback = $inputFeedback.val() || '';
    const valueIndustryGroup = $selectIndustryGroup.find('option').filter(':selected').val();

    if(valueInputFeedback && valueInputFeedback.length > 0) {
        if(valueIndustryGroup == 0) {
            const valueOtherIndustry = $('#input-other-industry').val() || '';

            if(valueOtherIndustry && valueOtherIndustry.length > 0) {
                callSubmitFeedback(valueInputFeedback, valueIndustryGroup, valueOtherIndustry);
            } else {
                return alert('Vui lòng thêm thông tin cho nhóm ngành');
            }
        } else {
            callSubmitFeedback(valueInputFeedback, valueIndustryGroup);
        }
    } else {
        alert('Vui lòng nhập các thông tin bắt buộc');
    }
})