(function(){
  var root=document.getElementById('dl-root'); if(!root) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reveal
  var rv=root.querySelectorAll('.dl-rv');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
    rv.forEach(function(el){io.observe(el)});
  } else { rv.forEach(function(el){el.classList.add('in')}); }

  // count-up
  function fmt(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ');}
  var counted=false;
  function counters(){
    if(counted) return; counted=true;
    root.querySelectorAll('[data-count]').forEach(function(el){
      var target=parseInt(el.getAttribute('data-count'),10);
      var pre=el.getAttribute('data-prefix')||'', suf=el.getAttribute('data-suffix')||'';
      if(reduce){el.textContent=pre+fmt(target)+suf;return;}
      var start=null, dur=1600;
      function step(t){ if(!start)start=t; var p=Math.min((t-start)/dur,1); var e=1-Math.pow(1-p,3);
        el.textContent=pre+fmt(Math.floor(e*target))+suf; if(p<1)requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }
  var stats=root.querySelector('.dl-stats');
  if(stats && 'IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){counters();io2.disconnect();}})},{threshold:.4});
    io2.observe(stats);
  } else { counters(); }

  if(!reduce){
    // parallax hero bg
    var bg=document.getElementById('dl-parallax'), ticking=false;
    function onScroll(){ if(ticking)return; ticking=true; requestAnimationFrame(function(){
      var y=window.pageYOffset||0; if(bg && y<900){ bg.style.transform='scale(1.08) translateY('+(y*0.18)+'px)'; } ticking=false; }); }
    window.addEventListener('scroll',onScroll,{passive:true});

    // tilt hero card
    var card=root.querySelector('[data-tilt]');
    if(card){ var stage=card.parentElement;
      stage.addEventListener('mousemove',function(ev){ var r=card.getBoundingClientRect();
        var px=(ev.clientX-r.left)/r.width-.5, py=(ev.clientY-r.top)/r.height-.5;
        card.style.transform='rotateY('+(px*12).toFixed(2)+'deg) rotateX('+(-py*12).toFixed(2)+'deg)'; });
      stage.addEventListener('mouseleave',function(){ card.style.transform='rotateY(0) rotateX(0)'; });
    }
  }
})();