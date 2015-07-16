# demo1.common
jQuery ->
  if jQuery('.demo.demo1.common').length
    $elm = jQuery('.demo.demo1.common')
    $count = $elm.find('span.count')
    num = 0

    $elm.on 'click', 'a.plus', ->
      num += 1
      $count.text num

    $elm.on 'click', 'a.minus', ->
      num -= 1
      $count.text num


jQuery ->
  if jQuery('.demo.demo1.rx').length
    $elm = jQuery('.demo.demo1.rx')
    $count = $elm.find('span.count')
    num = 0

    ob_plus = $elm.onAsObservable('click', 'a.plus').map(1)
    ob_minus = $elm.onAsObservable('click', 'a.minus').map(-1)

    Rx.Observable
      .merge(ob_plus, ob_minus)
      .subscribe (num_change)->
        num += num_change
        $count.text num


build_list = (subject, $result)->
  imgurl = subject.images.small
  title = subject.title
  year = subject.year
  rating = subject.rating.average
  alt = subject.alt

  $dom = jQuery """
    <a class='movie' href='#{alt}' target='_blank'>
      <div class='img' style='background-image:url(#{imgurl})'></div>
      <span class='title'>#{title}</span>
      <span class='year'>#{year}</span>
      <span class='rating'>#{rating}</span>
    </a>
  """
    .appendTo $result.find('.list')


jQuery ->
  if jQuery('.demo.demo2.common').length
    $elm = jQuery('.demo.demo2.common')
    $input = $elm.find('input')
    $result = $elm.find('.result')

    $elm.on 'click', 'a.do-search', ->
      query = $input.val()
      return if query.length is 0

      $result
        .removeClass('state-blank state-loading')
        .addClass('state-loading')
        .find('.list').html('')

      jQuery.ajax
        url: "https://api.douban.com/v2/movie/search?q=#{query}"
        dataType: 'jsonp'
        data:
          apikey: '0c1c004278927f31245400c769b77d93'
      .done (res)->
        $result.removeClass('state-loading')

        if res.subjects.length is 0
          $result.addClass('state-blank')

        for subject in res.subjects[0...5]
          build_list subject, $result
        


jQuery ->
  if jQuery('.demo.demo2.rx').length
    $elm = jQuery('.demo.demo2.rx')
    $input = $elm.find('input')
    $result = $elm.find('.result')

    ob_btn = $elm.onAsObservable('click', 'a.do-search')
      .map (data)-> $input.val()
      .filter (query)-> query.length > 0
      .map (query)-> "https://api.douban.com/v2/movie/search?q=#{query}"

    ob_btn.subscribe ->
      $result
        .removeClass('state-blank state-loading')
        .addClass('state-loading')
        .find('.list').html('')

    ob_search = ob_btn
      .flatMapLatest (url)->
        jQuery.ajaxAsObservable
          url: url
          dataType: 'jsonp'
      .pluck 'data'
    ob_search.subscribe (res)->
      $result.removeClass('state-loading')

      if res.subjects.length is 0
        $result.addClass('state-blank')

      for subject in res.subjects[0...5]
        build_list subject, $result