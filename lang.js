/* vmacedo.com language switch: no automatic redirect; the PT · EN link only remembers the choice */
(function(){
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[data-lang]');
    if (a) { try { localStorage.setItem('vm-lang', a.getAttribute('data-lang')); } catch(err){} }
  });
})();
