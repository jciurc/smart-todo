(() => {
  $(() => {
    // jQuery Sortable Initializer
    var oldContainer;
    $("ol.todo-container").sortable({
      distance: 20, delay: 50,
      group: 'nested',

      afterMove: function(placeholder, container) {
        if (oldContainer != container) {
          if (oldContainer) oldContainer.el.removeClass("active");
          container.el.addClass("active");

          oldContainer = container;
        }
      },

      onDrop: function($item, container, _super) {
        container.el.removeClass("active");
        _super($item, container);

        // Update todo category in database on drop
        const params = {
          url: "/todos/" + $item.attr('alt'),
          data: 'category_id=' + container.el[0].getAttribute('alt'),
          type: "PUT",
        };
        $.ajax(params).then((todo) => {
            $('main').trigger('reload');
          });
      }
    });

  });
})();