let $btnDelete = $('.btn-delete');
let $btnDeleteLoading = $('.btn-delete-loading');

$("#overlay").hide();

function onDelete(id) {
    let text = "Bạn có muốn xóa những từ này không?";

    if (confirm(text) == true) {
        $("#overlay").show();
        
        const payload = {id};
        $.ajax({
            type: "POST",
            url: '/admin-delete-word',
            dataType: 'json',
            data: payload,
            success: function (res) {
                if (res && res.success) {
                   location.reload();
                }
            },
        });   
    } 
}

function onMerge(id) {
    $("#overlay").show();

    const payload = {id};
    $.ajax({
        type: "POST",
        url: '/admin-merge-word',
        dataType: 'json',
        data: payload,
        success: function (res) {
            if (res && res.success) {
               location.reload();
            }
        },
    });
}

function showText(el) {
    $(el).removeClass("text-truncate");
}

function limitText(el) {
    $(el).addClass("text-truncate");
}