document.addEventListener("DOMContentLoaded", () => {

  const pages = [
    document.getElementById('page1'),
    document.getElementById('page2'),
    document.getElementById('page3')
  ];
  let current = 0;

  const toPage2Btn = document.getElementById('toPage2');
  const toPage3Link = document.getElementById('toPage3');
  const backArrow = document.getElementById('backArrow');
  const nextArrow = document.getElementById('nextArrow');

  function showPage(index) {
    pages.forEach((p,i)=>{
      p.classList.remove('active','left','right');
      if(i<index) p.classList.add('left');
      else if(i>index) p.classList.add('right');
    });
    pages[index].classList.add('active');
    current = index;
    updateArrows();
  }

  function updateArrows() {
    backArrow.style.visibility = current===0?'hidden':'visible';
    nextArrow.style.visibility = current===pages.length-1?'hidden':'visible';
  }

  toPage2Btn.addEventListener('click', ()=>showPage(1));
  toPage3Link.addEventListener('click', e=>{ e.preventDefault(); showPage(2); });
  backArrow.addEventListener('click', ()=>{ if(current>0) showPage(current-1); });
  nextArrow.addEventListener('click', ()=>{ if(current<pages.length-1) showPage(current+1); });

  updateArrows();

  // ✅ handle redirect from signup
  const params = new URLSearchParams(window.location.search);
  if (params.get("page") === "login") {
    showPage(1);
  }

});

// after successful login
localStorage.setItem("username", username);
window.location.href = "home.html";
window.location.href = "home.html?page=login";
