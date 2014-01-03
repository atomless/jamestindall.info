var $ = require('jquery');
var SuperGif = require('./lib/libgif.js');
var RubbableGif = require('./lib/rubbable.js');
require('animo.js');


IS_AUTO_SCROLLING = false;

IMG_LOADING_TIMEOUT = false;


// This Function will always return the initial font-size of the html element
var getBaseFontPxSize = function() {

  var html = document.getElementsByTagName('html')[0];
  return parseInt(window.getComputedStyle(html)['fontSize']);
};

// This function will convert pixel to rem
var pxToRem = function(px) {

  return (parseInt(px) / getBaseFontPxSize());
}


var remToPx = function(rem) {

  return (parseInt(rem * getBaseFontPxSize()));
}


var loadingTreeErrorCheck = function(tree_link, tree_img) {

  if (tree_link.hasClass('loading')) {
    randomTree(tree_link, tree_img);
  } else {
    tree_img.trigger('load');
  }
};

var randomTree = function(tree_link, tree_img) {

  var randnum = Math.ceil(Math.random() * 72);
  var filenum = ('0' + randnum).slice(-2);

  tree_link.addClass('loading');

  console.log('LOADING random tree', filenum);
  tree_img.attr('src', 'http://atomless.com/images/72_trees/' + filenum + '.jpg');
  IMG_LOADING_TIMEOUT = setTimeout(function() { loadingTreeErrorCheck(tree_link, tree_img); }, 6000);
};


var hideTree = function(tree_link, tree_img) {

  //console.log('hiding tree');
  tree_img.animo('blur', {duration: 0.5, amount: 4}, function() {
    $('figure', tree_link).animate({
      opacity: 0
    }, 1000, function() {
      randomTree(tree_link, tree_img);
    });
  });
};


var showTree = function(tree_link, tree_img) {

  $('figure', tree_link).animate({
    opacity: 1
  }, 1000, function() {
    tree_img.animo('blur', {duration: 0.5,  amount: 0}, function(){
      tree_link.removeClass('noclick');
    });
  });
};


var handleTreeClick = function(tree_link, tree_img) {

  if ( ! tree_link.hasClass('noclick')) {
    tree_link.addClass('noclick');
    hideTree(tree_link, tree_img);
  }
};


var handleTreeLoaded = function(tree_link, tree_img) {

  console.log('img loaded');
  if (tree_link.hasClass('loading')) {
    tree_link.removeClass('loading');
    clearTimeout(IMG_LOADING_TIMEOUT);
    showTree(tree_link, tree_img);
  }
};


var setupTree = function() {

  var tree_link = $('a[id="tree"]');
  var tree_img = $('img', tree_link);
  tree_link.on('click', function(e) {
    console.log('click');
    e.preventDefault();
    handleTreeClick(tree_link, tree_img);
  });
  tree_img
    .load(function() { handleTreeLoaded(tree_link, tree_img); })
    .error(function() { console.log("error loading image"); });
  randomTree(tree_link, tree_img);
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


var scrollBy = function(scroll_amount) {

  IS_AUTO_SCROLLING = true;
  var y = $(window).scrollTop() + scroll_amount;
  $('html, body').animate({ scrollTop: y }, 0, function() {
    IS_AUTO_SCROLLING = false;
  });
}


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
    var scrollpos = 0;
    var offset = 0;
    if (anchor.length !== 0) {
      IS_AUTO_SCROLLING = true;
      if (anchor.hasClass('hidden')) {
        scrollpos = anchor.removeClass('hidden').offset().top;
        anchor.addClass('hidden');
      } else {
        scrollpos = anchor.offset().top;
      }
      offset = anchor.attr('data-scroll-offset-rem') || 0;
      if (offset) {
        offset = remToPx(offset);
        scrollpos += offset;
      }
      if (! $('#site-nav').hasClass('collapsed')) {
        scrollpos -= ($('#site-nav').height() + remToPx(1.65));
      }
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
    .stop(true, true)
    .animate({height: '0px'}, speed, function() {
      $(this).animate({borderBottomWidth: '0px'}, 'slow', function() {
        $(this).addClass('collapsed');
      });
  });
};


var showSiteNav = function(speed) {

  var bw = remToPx(1.65);
  var h = remToPx(10);
  $('#site-nav')
    .stop(true, true)
    .css({height: '0px', borderBottomWidth: '0px', background: '#fdfdfd'})
    .removeClass('collapsed')
    .animate({borderBottomWidth: bw + 'px'}, 0, function() {
      $(this).animate({height: h + 'px'}, speed, function() {
        $(this).css({background: '#555'})
      });
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


var setUpSuperGif = function(img_id) {

  var rg = new RubbableGif({ gif: $(img_id)[0] } );
  rg.load();
};


var setupInterludes = function () {

  $('.interlude').on('mousedown', function(e){
    e.preventDefault();
    $(this).addClass('mousedown');
  });
  $('.interlude').on('mouseup', function(e){
    $(this).removeClass('mousedown');
  });
  $(document).on('mouseup', function(e){
    $('.interlude.mousedown').removeClass('mousedown');
  });
};


var layoutImages = function() {

  var w,d;
  var ww = $(window).outerWidth();
  var imgs = $('figure > img, .portrait canvas');

  imgs.each(function() {
    w = $(this).width();
    if (w > ww) {
      d = Math.ceil(0.5 *(w - ww)) * -1;
      $(this).css({marginLeft: d + 'px'});
    } else {
      $(this).css({marginLeft: 'auto'});
    }
  });
  console.log('laid out images');
};


var layout = function() {

  var bw = remToPx(1.65);
  var h = remToPx(10);
  if ( ! $('#site-nav').hasClass('collapsed')) {
    $('#site-nav').css({borderBottomWidth: bw + 'px', height: h + 'px'});
  }

  layoutImages();
};


var initialize = function() {

  console.log(pxToRem(567));

  $(window).resize(function(e) {

    layout();
  });

  $(window).scroll(function(e) {

    handleWindowScroll(e);
  });

  $(window).on('canvas-touch-drag-v', function(e, scroll_amount) {
    console.log('canvas-touch-drag-v', e);
    scrollBy(scroll_amount);
  });

  // $('.portrait .interlude-image').hover(function(){freezeGif($(this)[0])}, function(){ $(this).attr('src','images/animated-portrait.gif')});

  $('#nav-toggle, #site-name').on('click', function(e) {

    handleNavToggleClick(e);
  });

  setupInterludes();
  setUpSuperGif('#portrait1');
  setupAnchorScroll();
  setupTree();
  layout();
};

$().ready(function () {

  initialize();
  console.log('initialized');
});


