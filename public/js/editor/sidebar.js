$(function() {
    /* Core Operations */
    $(".sidebar .options .option").on("click", function() {
        window.sidebarUtil.change($(this).attr("data-key"), false);
    });

    $(".sidebar .back").on("click", function() {
        window.sidebarUtil.change(false);
    });

    $(".header .top .form").on("change", function() {
        window.sidebarUtil.submit($(this));
    });

    $(".search form, .sidebar form").on("submit", function() {
        window.sidebarUtil.submit($(this));
        return false;
    });

    $(".sidebar .form[name='invite'] input").keyup(function() {
        window.sidebarUtil.screenNames($(this).val());
    });

    $(".sidebar .form[name='invite'] .screen_names").on("click", ".item", function() {
        window.sidebarUtil.screenNamesInput($(this).attr("data-name"));
        window.sidebarUtil.screenNames(false);
    });

    $(".sidebar .form[name='settings'] select[name='security']").on("change", function() {
        window.sidebarUtil.togglePassword($(this).val() == "false");
    });

    $(".sidebar .form[name='type-mode'] select").on("change", function() {
        $(this).parents("form").submit();
    });

    $(".sidebar .form[name='highlight-line'] .listing").on("click", ".remove", function() {
        window.sidebarUtil.highlightRemove($(this).parents(".item").attr("data-lines"));
    });

    $(".sidebar .form[name='highlight-word'] .listing").on("click", ".remove", function() {
        window.sidebarUtil.searchRemove($(this).parents(".item").attr("data-search"));
    });

    $(".sidebar .form[name='invite'] .listing").on("click", ".settings", function(event) {
        event.stopPropagation();
        window.sidebarUtil.laboratorOpen(
            $(this).offset(),
            $(this).parents(".item").attr("data-id")
        );
    });

    $(".context-menu").on("click", ".item", function() {
        window.debug = $(this);
        window.sidebarUtil.laboratorChange(
            $(this).parents(".context-menu").attr("data-id"),
            $(this).attr("data-id")
        );
    });

    $('html').click(function() {
        $(".context-menu").hide();
    });
});
