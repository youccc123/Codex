document.getElementById('localTransfers').onclick=()=>{location.href='../index.html?view=transfer';};

const paymentsToggle=document.getElementById('paymentsToggle');paymentsToggle.onclick=()=>{const menu=document.getElementById('paymentsMenu');menu.hidden=!menu.hidden;paymentsToggle.setAttribute('aria-expanded',String(!menu.hidden));};
