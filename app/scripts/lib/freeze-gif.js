// // ==UserScript==
// // @name           Stop gif animations on escape
// // @namespace      http://github.com/johan/
// // @description    Implements the "stop gif animations on hitting the escape key" feature that all browsers except Safari and Google Chrome have had since forever. Now also for Google Chrome!
// // ==/UserScript==

// 'use strict';

// module.exports = function freezeGif(i) {

//   var c = document.createElement('canvas'),
//       w = c.width = i.width,
//       h = c.height = i.height;
//       // j,a;

//   c.getContext('2d').drawImage(i, 0, 0, w, h);

//   try {
//     i.src = c.toDataURL('image/gif'); // if possible, retain all css aspects
//   } catch(e) { // cross-domain -- mimic original with all its tag attributes
//     for (j = 0, a; a = i.attributes[j]; j++) {
//       c.setAttribute(a.name, a.value);
//     }
//     i.parentNode.replaceChild(c, i);
//   }
// }


// function isGifImage(i) {
//   return (/^(?!data:).*\.gif/i).test(i.src);
// }


// function freezeGifsOnEscape(e) {
//   if (e.keyCode === 27 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
//     [].slice.apply(document.images).filter(isGifImage).map(freezeGif);
//   }
// }
// console.log('freeze gif initialized')

// document.addEventListener('keydown', freezeGifsOnEscape, true);
