$(".locations .item").live("click", function() {
    window.documents.location($(this).data("key"), "", false);
});
