(function() {
  jQuery(function() {
    var $count, $elm;
    if (jQuery('.demo.demo1.common').length) {
      $elm = jQuery('.demo.demo1.common');
      $count = $elm.find('span.count');
      $count.data('num', 0);
      $elm.on('click', 'a.plus', function() {
        var num;
        num = $count.data('num') + 1;
        return $count.text(num).data('num', num);
      });
      return $elm.on('click', 'a.minus', function() {
        var num;
        num = $count.data('num') - 1;
        return $count.text(num).data('num', num);
      });
    }
  });

  jQuery(function() {
    var $elm, $minus_btn, $plus_btn, num, ob, ob_minus, ob_plus;
    if (jQuery('.demo.demo1.rx').length) {
      $elm = jQuery('.demo.demo1.rx');
      $plus_btn = $elm.find('a.plus');
      $minus_btn = $elm.find('a.minus');
      num = 0;
      ob_plus = Rx.Observable.fromEvent($plus_btn[0], 'click').map(function() {
        return num = num + 1;
      });
      ob_minus = Rx.Observable.fromEvent($minus_btn[0], 'click').map(function() {
        return num = num - 1;
      });
      ob = Rx.Observable.merge(ob_plus, ob_minus);
      return ob.subscribe(function(num) {
        return $elm.find('span.count').text(num);
      });
    }
  });

}).call(this);
