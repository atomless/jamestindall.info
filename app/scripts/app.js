var $ = require('jquery');

require('animo.js');


IS_AUTO_SCROLLING = false;


var randomTree = function() {

  var randnum = Math.ceil(Math.random() * 72);
  var filenum = ('0' + randnum).slice(-2);
  console.log('LOADING random tree', filenum);
  $('a[name="tree"] img').attr('src', 'http://atomless.com/images/72_trees/' + filenum + '.jpg');
};


var handleTreeClick = function(tree_link, tree_img) {

  if ( ! tree_link.hasClass('noclick')) {

    tree_link.addClass('noclick');
    tree_img.animo('blur', {duration: 0.5, amount: 4}, function() {
      $('figure', tree_link).animate({
        opacity: 0
      }, 500, function() {
        tree_link.addClass('loading');
        randomTree();
      });
    });
  }
};


var handleTreeLoaded = function(tree_link, tree_img) {

  tree_link.removeClass('loading');
  $('figure', tree_link).animate({
    opacity: 1
  }, 500, function() {
    tree_img.animo('blur', {duration: 0.5,  amount: 0}, function(){
      tree_link.removeClass('noclick');
    });
  });
};


var setupTree = function() {

  var tree_link = $('a[name="tree"]');
  var tree_img = $('img', tree_link);

  tree_link.on('click', function(e) {

    e.preventDefault();
    handleTreeClick(tree_link, tree_img);
  });

  tree_img
    .load(function() { handleTreeLoaded(tree_link, tree_img); })
    .error(function() { console.log("error loading image"); });

  randomTree();
};


var scrollTo = function(y, _speed, hash) {

  var speed = _speed || 0;
  IS_AUTO_SCROLLING = true;
  $('html, body').animate({ scrollTop: y }, speed, function() {
    IS_AUTO_SCROLLING = false;
    if (hash !== null) {
      location.hash = hash;
    }
  });
};


var isScrolledIntoView = function(elem, threshhold, scrollpos) {

  var viewtop = (scrollpos || $(window).scrollTop());
  var viewheight = $(window).height();
  var viewbottom = viewtop + viewheight;
  var elemtop = $(elem).offset().top;
  var elembottom = elemtop + $(elem).outerHeight();
  var viewthreshhold = viewtop + (viewheight * 0.5);

  if (elemtop > viewtop && elemtop < viewbottom) {
    var viewtarget = viewtop + (viewheight * 0.1);
    var distance = elemtop - viewtarget;
    return (Math.abs(distance) < threshhold);
  } else if (elemtop < viewtop && elembottom > viewthreshhold) {
    return true;
  } else {
    return false;
  }
};


var setCurrentSectionScrollAnchorFragment = function(_scrollpos) {

  var scrollpos = _scrollpos || $(window).scrollTop();
  var dh = $(document).height();
  var hh = $('header').height();

  if ((scrollpos > 300) && (scrollpos < (dh - 100))) {

    $('main a.section-title[href^="#"]').each(function() {
      var hash = $(this).attr('href');
      if ($(this).parent().attr('data-has-inner-sections') !== 'true') {
        if (hash !== location.hash && isScrolledIntoView($(this).parent(), 40, scrollpos)) {
          var hash = hash.slice(hash.indexOf('#') + 1);
          location.hash = hash;
          scrollTo(scrollpos, 0, null);//eliminate the scroll jump
          return false;
        }
      }
    });
  } else if ((scrollpos < 300) && (scrollpos > 5) && (location.hash !== 'top')) {
    location.hash = 'top';
    scrollTo(scrollpos, 0, null);
  }
};


var setupAnchorScroll = function() {

  $('#page-nav a[href^="#"]').on('click', function(e) {

    e.preventDefault();
    var href = $(this).attr('href');
    var hash = href.slice(href.indexOf('#') + 1);
    var anchor = $('a[id="' + hash + '"]');
    console.log(anchor);
    if (anchor.length !== 0) {
      IS_AUTO_SCROLLING = true;
      var scrollpos = anchor.offset().top;
      scrollTo(scrollpos, 'slow', hash);
    }
  });
}


var handleWindowScroll = function(e) {

  var scrollpos = $(window).scrollTop();

  if (IS_AUTO_SCROLLING !== true) {
    setCurrentSectionScrollAnchorFragment(scrollpos);
  }

  if ( ! $('#site-nav').hasClass('collapsed') && scrollpos > 70) {
    hideSiteNav('fast');
  }
};


var hideSiteNav = function(speed) {

  $('#site-nav')
    .stop()
    .animate({height: '0px'}, speed, function() {
      $(this).animate({borderBottomWidth: '0px'}, 'slow', function() {
        $(this).addClass('collapsed');
      });
  });
};


var showSiteNav = function(speed) {

  $('#site-nav')
    .stop()
    .css({height: '0px', borderBottomWidth: '0px'})
    .removeClass('collapsed')
    .animate({borderBottomWidth: '33px'}, 0, function() {
      $(this).animate({height: '204px'}, speed, function() {});
    });
};


var handleNavToggleClick = function(e) {

  e.preventDefault();
  var scrollpos = $(window).scrollTop();
  if ($('#site-nav').hasClass('collapsed')) {
    showSiteNav('fast');
  }else{
    if (scrollpos < $('header').outerHeight()) {
      hideSiteNav('fast');
    }
  }
  scrollTo(0, 'fast', 'top');
};


var initialize = function() {

  $(window).scroll(function(e) {

    handleWindowScroll(e);
  });

  setupAnchorScroll();

  $('#nav-toggle, #site-name').on('click', function(e) {

    handleNavToggleClick(e);
  });

  setupTree();
};

$().ready(function () {

  initialize();
  console.log('initialized');
});


