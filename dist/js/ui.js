(function() {
  var build_list;

  jQuery(function() {
    var $count, $elm, num;
    if (jQuery('.demo.demo1.common').length) {
      $elm = jQuery('.demo.demo1.common');
      $count = $elm.find('span.count');
      num = 0;
      $elm.on('click', 'a.plus', function() {
        num += 1;
        return $count.text(num);
      });
      return $elm.on('click', 'a.minus', function() {
        num -= 1;
        return $count.text(num);
      });
    }
  });

  jQuery(function() {
    var $count, $elm, num, ob_minus, ob_plus;
    if (jQuery('.demo.demo1.rx').length) {
      $elm = jQuery('.demo.demo1.rx');
      $count = $elm.find('span.count');
      num = 0;
      ob_plus = $elm.onAsObservable('click', 'a.plus').map(1);
      ob_minus = $elm.onAsObservable('click', 'a.minus').map(-1);
      return Rx.Observable.merge(ob_plus, ob_minus).subscribe(function(num_change) {
        num += num_change;
        return $count.text(num);
      });
    }
  });

  build_list = function(subject, $result) {
    var $dom, alt, imgurl, rating, title, year;
    imgurl = subject.images.small;
    title = subject.title;
    year = subject.year;
    rating = subject.rating.average;
    alt = subject.alt;
    return $dom = jQuery("<a class='movie' href='" + alt + "' target='_blank'>\n  <div class='img' style='background-image:url(" + imgurl + ")'></div>\n  <span class='title'>" + title + "</span>\n  <span class='year'>" + year + "</span>\n  <span class='rating'>" + rating + "</span>\n</a>").appendTo($result.find('.list'));
  };

  jQuery(function() {
    var $elm, $input, $result;
    if (jQuery('.demo.demo2.common').length) {
      $elm = jQuery('.demo.demo2.common');
      $input = $elm.find('input');
      $result = $elm.find('.result');
      return $elm.on('click', 'a.do-search', function() {
        var query;
        query = $input.val();
        if (query.length === 0) {
          return;
        }
        $result.removeClass('state-blank state-loading').addClass('state-loading').find('.list').html('');
        return jQuery.ajax({
          url: "https://api.douban.com/v2/movie/search?q=" + query,
          dataType: 'jsonp'
        }).done(function(res) {
          var i, len, ref, results, subject;
          $result.removeClass('state-loading');
          if (res.subjects.length === 0) {
            $result.addClass('state-blank');
          }
          ref = res.subjects.slice(0, 5);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subject = ref[i];
            results.push(build_list(subject, $result));
          }
          return results;
        });
      });
    }
  });

  jQuery(function() {
    var $elm, $input, $result, ob_btn, ob_search;
    if (jQuery('.demo.demo2.rx').length) {
      $elm = jQuery('.demo.demo2.rx');
      $input = $elm.find('input');
      $result = $elm.find('.result');
      ob_btn = $input.onAsObservable('input').map(function(data) {
        return $input.val();
      }).map(function(query) {
        return "https://api.douban.com/v2/movie/search?q=" + query;
      }).throttle(500).distinctUntilChanged();
      ob_btn.subscribe(function() {
        return $result.addClass('state-loading').find('.list').html('');
      });
      ob_search = ob_btn.flatMapLatest(function(url) {
        return jQuery.ajaxAsObservable({
          url: url,
          dataType: 'jsonp'
        });
      }).pluck('data');
      ob_search.subscribe(function(url) {
        return $result.removeClass('state-loading');
      });
      ob_search.filter(function(res) {
        return res.subjects.length === 0;
      }).subscribe(function(res) {
        return $result.addClass('state-blank');
      });
      return ob_search.filter(function(res) {
        return res.subjects.length > 0;
      }).subscribe(function(res) {
        var i, len, ref, results, subject;
        ref = res.subjects.slice(0, 5);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          subject = ref[i];
          results.push(build_list(subject, $result));
        }
        return results;
      });
    }
  });

}).call(this);
