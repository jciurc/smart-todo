(() => {
  $(() => {
    // jQuery Sortable Initializer
    var oldContainer;
    $("ol.todo-container").sortable({
      distance: 20, delay: 50,
      group: 'nested',

      afterMove: function (placeholder, container) {
        if(oldContainer != container){
          if(oldContainer)
            oldContainer.el.removeClass("active");
          container.el.addClass("active");

          oldContainer = container;
        }
      },

      onDrop: function ($item, container, _super) {
        container.el.removeClass("active");
        _super($item, container);
      }
    });

    $(".switch-container").on("click", ".switch", function  (e) {
      var method = $(this).hasClass("active") ? "enable" : "disable";
      $(e.delegateTarget).next().sortable(method);
    });

  });
})();