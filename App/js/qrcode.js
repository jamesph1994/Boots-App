$(document).ready(function() {
  $(document).disableSelection();
  var $container = $('.container'),
      $pullDown = $('.pulldown'),
      $allemails = $('.allemails'),
      $emailsItemNew = $('.email-item-new'),
      $emailsItemMark = $('.email-item__mark'),
      $showbox = $('.showbox'),
      $top = $('.top'),
      refreshArr = ['.inbox', '.allemails', '.pulldown', '.emails-outter', '.container'],
      refreshArrLength = refreshArr.length,
      deltaY = 0,
      offsetLeftCont = $container.offset().left,
      offsetTopCont = $container.offset().top,
      offsetPulldown = $pullDown.offset().top,
      halfWidthCont = 141,
      halfHeightCont = 250,
      animating = false;

  $(window).resize(function() {
      offsetLeftCont = $container.offset().left;
      offsetTopCont = $container.offset().top;
      offsetPulldown = $pullDown.offset().top;
  });
  
  var mousemoveHandler = function(e) {
    var x = e.pageX,
        y = e.pageY;
        deltaY = e.pageY;

    (function lean() {
      var pXoffsetPos = (((x - offsetLeftCont) - halfWidthCont) / 14),
          pXoffsetNeg = (((x - offsetLeftCont + halfWidthCont) - ((x - offsetLeftCont) * 2)) / 14),
          pYoffset = (((y - offsetTopCont + halfHeightCont) - ((y - offsetTopCont) * 2)) / 25);
      return [
        $container.css('transform', 'rotateY(' + pXoffsetPos + 'deg) rotateX(' + pYoffset + 'deg)'),
        $container.css('transform', 'rotateY(-' + pXoffsetNeg + 'deg) rotateX(' + pYoffset + 'deg)'),
        $container.css('box-shadow', '-' + pXoffsetPos + 'px ' + pYoffset + 'px 29px 0px rgba(0,0,0,0.75)'),
        $container.css('box-shadow', pXoffsetNeg + 'px ' + pYoffset + 'px 29px 0px rgba(0,0,0,0.75)')
      ];
    })();

    (function grab() {
      function grabing(el, divide) {
        $(el).css('transform', 'translateY(' + ((y - offsetPulldown - 22) / divide) + 'px)');
      }
      for (var i = 8, j = 0; i >= 2, j < refreshArrLength - 2; i /= 2, j++) {
        grabing(refreshArr[j], i);
      }
      grabing('.emails-outter', 1);

      function refresh(el, tran) {
        $(el).css({
          'transform': 'translateY(' + tran + 'px)',
          'transition': '.1s',
          '-moz-transition': '0s'
        });
      }
      // If statments so you only be able drag stuff in a particular area
      if (y > (offsetTopCont + 350)) {
        for (var i = 22, j = 0; i <= 180, j < refreshArrLength - 1; i *= 2, j++) {
          refresh(refreshArr[j], i);
        }
      } else if (y < (offsetTopCont + 175)) {
        for (var i = 0; i < refreshArrLength - 1; i++) {
          $(refreshArr[i]).css('transform', '');
        }
      }
    })();
  };

  var loading = function(el, num) {
    $(el).css({
      'opacity': '0',
      'transform': 'scale(0,1)',
      'transition': 'transform .4s'
    });
    $showbox.show();
    setTimeout(function() {
      $(el).css({
        'opacity': '1',
        'transform': 'scale(1,1)',
        'transition': '.4s',
        '-moz-transition': '0s'
      });
      $(el).children('p').text('All 163');
      $showbox.hide();
    }, 2000);
    setTimeout(function() {
      $emailsItemNew.addClass('email-item-new-scale');
      $emailsItemMark.children('div').addClass('scale');
    }, 2150);
    $(document).off('mousemove mouseup');
    for (var i = 0; i < refreshArrLength - 1; i++) {
      if(i === 1 || i === 2) continue;
      $(refreshArr[i]).css({
        'transform': '',
        'transition': '.2s',
        '-moz-transition': '0s'
      }).addClass('bounce');
    }
  };

  var noLoading = function(bounce) {
    for (var i = 0; i < refreshArrLength - 1; i++) {
      $container.css({
        'transform': '',
        'transition': '.5s',
        '-moz-transition': '0s',
        'box-shadow': '0 0 35px rgba(0, 0, 0, .75)'
      });

      $(refreshArr[i]).css({
        'transform': '',
        'transition': '.2s',
        '-moz-transition': '0s'
      }).addClass(bounce);
      $(document).off('mousemove mouseup');
    }
  };

  var mouseupHandler = function() {
    if (deltaY > (offsetTopCont + 300)) {
      noLoading();
      loading('.allemails, .pulldown', 1);
      animating = true;
      setTimeout(function() {
        animating = false;
      }, 2150);
    } else if (deltaY > (offsetTopCont + 191)) {
      noLoading('bounce');
    } else {
      noLoading();
    }
  };

  var toDefault = function() {
    for (var i = 0; i < refreshArrLength; i++) {
      $(refreshArr[i]).css({
        'transform': '',
        'transition': 'transform .1s, box-shadow 0s',
        '-moz-transition': '0s'
      });
    }
    $('.allemails, .pulldown').css({
      'opacity': '1',
      'transform': 'scale(1,1)',
      'transition': '0s'
    });
    $allemails.children('p').text('All 162');
    $emailsItemNew.removeClass('email-item-new-scale');
    for (var i = 0; i < refreshArrLength - 1; i++) {
      $(refreshArr[i]).removeClass('bounce');
    }
    $emailsItemNew.removeClass('email-item-new-scale');
    $emailsItemMark.children('div').removeClass('scale');
  };

  $(document).on('mousedown', '.top', function() {
    if (animating === false) {
      $(document).on('mousemove', mousemoveHandler);
      $(document).on('mouseup', mouseupHandler);
      toDefault();
    }
  });
});