# demo1.common
jQuery ->
  if jQuery('.demo.demo1.common').length
    $elm = jQuery('.demo.demo1.common')

    $count = $elm.find('span.count')
    $count.data('num', 0)

    $elm.on 'click', 'a.plus', ->
      num = $count.data('num') + 1
      $count
        .text num
        .data 'num', num

    $elm.on 'click', 'a.minus', ->
      num = $count.data('num') - 1
      $count
        .text num
        .data 'num', num


jQuery ->
  if jQuery('.demo.demo1.rx').length
    $elm = jQuery('.demo.demo1.rx')
    $plus_btn = $elm.find('a.plus')
    $minus_btn = $elm.find('a.minus')
    num = 0

    ob_plus = Rx.Observable
      .fromEvent $plus_btn[0], 'click'
      .map ->
        num = num + 1

    ob_minus = Rx.Observable
      .fromEvent $minus_btn[0], 'click'
      .map ->
        num = num - 1

    ob = Rx.Observable.merge ob_plus, ob_minus
    ob.subscribe (num)->
      $elm.find('span.count').text num