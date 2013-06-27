plugin.onMessageInsertion = function (event) {
  var flickr_status_expression = /^https?:\/\/(?:(?:(?:\w*\.)?flickr.com\/photos)|(?:flic\.kr\/p))\/\S+/i,
      last_anchor = Talker.getLastInsertion().find('a'),
      last_href = last_anchor.attr('href') || '';

  if (flickr_status_expression.test(last_href)) {
    var id = last_href.match(flickr_status_expression)[0],
        url = '//www.flickr.com/services/oembed?format=json&url=' + window.encodeURIComponent(id) + '&jsoncallback=?';
    
    if (last_anchor.hasClass('transformed')) {
      return true; // Do not transform the link a second time.
    }
    
    $.getJSON(url, function (data) {
      if (data && !last_anchor.hasClass('transformed')) {
        var html = "<a href='{web_page_short_url}'><h2>{title}</h2><img src='{thumbnail_url}' width='{thumbnail_width}' height='{thumbnail_height}' /><h3>{license} - {author_name}</h3></a>".replace(/\{(\w+)\}/gi, function (subString, group1 /* , offset, inputString */ ) {
			return data[group1];
		});

        // tag as tranformed so we don't do it again
        last_anchor.addClass('transformed')
          .fadeOut('slow')
          .after($("<div class='travi-flickr'>" + html + "</div>"));
      }
    });
  }
};
