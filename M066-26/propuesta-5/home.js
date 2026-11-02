// Inicio local: los accesos reutilizan el flujo de la propuesta 4.
const homeView = document.getElementById('homeView');
const navTransfers = document.getElementById('navTransfers');
const homeIcon = name => `<img src="assets/${name}.svg" alt="">`;
const menuIcons = ['transfer','payments','query','lines','request','auth','wallet','qr','rates','sip','settings','security'];
document.querySelectorAll('.sidebar nav>button').forEach((button,index) => {
  button.querySelector('span').innerHTML = homeIcon(menuIcons[index]);
  if (button.querySelector('b')) button.querySelector('b').innerHTML = homeIcon('arrow');
});
document.querySelector('.menu-search span').innerHTML = homeIcon('search');
document.querySelector('.logout').innerHTML = `${homeIcon('logout')} Cerrar sesión`;
document.querySelector('.profile-menu').innerHTML = homeIcon('user');
document.querySelectorAll('.theme-icon').forEach((el,index) => el.innerHTML = homeIcon(index ? 'sun-small' : 'sun'));
document.querySelector('.notification').innerHTML = homeIcon('bell');
function showHome() {
  resultView.hidden = true;
  document.body.classList.remove('transfer-entry','destination-entry','transfer-form-mode');
  document.body.classList.add('home-mode');
  homeView.hidden = false;
  transferView.hidden = true;
  confirmationView.hidden = true;
  boardDialog.hidden = true;
  navTransfers.classList.remove('active');
  document.querySelector('.profile-copy strong').textContent = 'USUARIO XXXXX0031';
  window.scrollTo(0,0);
}
function openHomeTransfer(currency) {
  resultView.hidden = true;
  document.body.classList.remove('home-mode');
  homeView.hidden = true;
  confirmationView.hidden = true;
  transferView.hidden = false;
  navTransfers.classList.add('active');
  changeOrigin.onclick();
  document.getElementById('amountField').value = '0';
  if (currency) {
    selectOrigin(currency);
    document.getElementById('originAccountNumber').textContent = currency === 'EUR' ? '4018190001' : '4018190000';
    document.getElementById('originAccountType').textContent = currency === 'EUR' ? 'Caja de Ahorros' : 'Cuentas Corrientes';
  }
  window.scrollTo(0,0);
}
navTransfers.onclick = () => openHomeTransfer();
document.querySelector('.brand').onclick = event => {event.preventDefault();showHome();};
document.querySelectorAll('[data-home-transfer]').forEach(button => button.onclick = () => openHomeTransfer(button.dataset.homeTransfer));
document.querySelectorAll('.home-eye').forEach(button => button.onclick = () => {
  const balance = button.closest('.home-account').querySelector('[data-balance]');
  const concealed = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed',String(concealed));
  button.setAttribute('aria-label',`${concealed ? 'Mostrar' : 'Ocultar'} saldo de cuenta ${button.closest('.home-account').dataset.currency}`);
  balance.textContent = concealed ? '************' : balance.dataset.balance;
});
document.getElementById('homeFilterToggle').onclick = () => {
  const panel = document.getElementById('homeFilters');panel.hidden = !panel.hidden;
  document.getElementById('homeFilterToggle').setAttribute('aria-expanded',String(!panel.hidden));
};
document.getElementById('homeCurrencyFilter').onchange = event => {
  document.querySelectorAll('.home-account').forEach(card => card.hidden = Boolean(event.target.value && card.dataset.currency !== event.target.value));
};
document.querySelectorAll('[data-home-tab]').forEach(button => button.onclick = () => {
  document.querySelectorAll('[data-home-tab]').forEach(tab => {tab.classList.toggle('active',tab===button);tab.setAttribute('aria-selected',String(tab===button));});
  const accounts = button.dataset.homeTab === 'Cuentas';
  document.getElementById('homeAccounts').hidden = !accounts;
  document.getElementById('homeEmpty').hidden = accounts;
  document.getElementById('homeEmpty').textContent = `No hay ${button.dataset.homeTab === 'Tarjetas' ? 'tarjetas' : 'CDA'} para mostrar.`;
  document.getElementById('homeFilterToggle').hidden = !accounts;
  document.getElementById('homeFilters').hidden = true;
  document.getElementById('homeFilterToggle').setAttribute('aria-expanded','false');
});
const transferAccounts = [
  {currency:'USD',number:'4018190000',type:'Cuentas Corrientes',name:'XXXXXXXXXXXXXXXX',balance:'USD 89.998,00'},
  {currency:'PYG',number:'4018190000',type:'Cuentas Corrientes',name:'XXXXXXXXXXXXXXXX',balance:'Gs. 1.843.386'},
  {currency:'EUR',number:'4018190001',type:'Caja de Ahorros',name:'XXXXXXXXXXXXXXXX',balance:'EUR 50.000,00'}
];
const savedTransferAccounts = referenceSavedAccounts;

function renderDestinationAccounts() {
  const selected = transferAccounts.find(account => account.currency === originCurrency);
  if (selected) {
    document.querySelector('#originAccount>div:nth-child(2)>strong').textContent = selected.name;
    document.querySelector('#originAccount .available small').textContent = 'SALDO';
    document.querySelector('#originAccount .balance-visibility').innerHTML = homeIcon('eye');
    document.getElementById('originCurrencyLabel').textContent = selected.balance;
  }
  destinationSearch.value = '';
  destinationOptions.innerHTML = '';
  for (const [title, accounts] of [['Sus cuentas',transferAccounts.filter(account=>account.currency!==originCurrency)],['Cuentas agendadas',savedTransferAccounts]]) {
    const group = document.createElement('section'); group.className = 'destination-group';
    const heading = document.createElement('h3'); heading.textContent = title; group.append(heading);
    accounts.forEach(account => {
      const button = document.createElement('button'); button.type='button';button.className='destination-candidate';
      button.dataset.destination = account.currency;
      button.setAttribute('aria-label',`Seleccionar ${account.name}, cuenta ${account.number} en ${account.currency}`);
      const logo=document.createElement('img');logo.src=account.logoUrl || 'assets/bank.png';logo.loading='lazy';logo.alt='';logo.className='destination-bank';button.append(logo);
      const copy=document.createElement('span');copy.className='destination-candidate-copy';
      for (const text of [account.name,account.type + (account.balance ? '' : ' '+(account.currency==='PYG'?'Gs.':account.currency)),account.number]) {const line=document.createElement('span');line.textContent=text;copy.append(line);}
      button.append(copy);
      const detail=document.createElement('span');detail.className='destination-candidate-balance';
      if(account.balance){const label=document.createElement('small');label.textContent='SALDO';detail.append(label);}
      const value=document.createElement('b');value.textContent=account.balance || account.currency;detail.append(value);button.append(detail);
      const eye=document.createElement('img');eye.src=account.balance?'assets/eye.svg':'assets/arrow.svg';eye.alt='';eye.className='destination-eye';button.append(eye);
      button.onclick=()=>selectDestination(account.currency,account);
      if (!account.balance) {
        detail.remove();eye.remove();
        const row=document.createElement('div');row.className='saved-account-row';
        const edit=document.createElement('button');edit.type='button';edit.className='saved-account-edit';edit.innerHTML='Editar <img src="assets/edit.svg" alt="">';edit.setAttribute('aria-label','Editar '+account.name);
        edit.onclick=()=> {const name=window.prompt('Nombre del destinatario',account.name);if(name?.trim()){account.name=name.trim();renderDestinationAccounts();}};
        row.append(button,edit);group.append(row);
      } else group.append(button);
    });
    destinationOptions.append(group);
  }
  const empty=document.createElement('p');empty.id='destinationSearchEmpty';empty.hidden=true;empty.textContent='No se encontraron destinatarios.';destinationOptions.append(empty);
}
destinationSearch.addEventListener('input', () => {
  const query=destinationSearch.value.trim().toLocaleLowerCase('es');let total=0;
  destinationOptions.querySelectorAll('.destination-group').forEach(group=>{
    let visible=0;group.querySelectorAll('.destination-candidate').forEach(button=>{button.hidden=!(button.textContent+' '+button.dataset.destination).toLocaleLowerCase('es').includes(query);if(button.parentElement.classList.contains('saved-account-row'))button.parentElement.hidden=button.hidden;if(!button.hidden)visible++;});
    group.hidden=visible===0;total+=visible;
  });
  document.getElementById('destinationSearchEmpty').hidden=total>0;
});
if (previewMode) {document.body.classList.remove('home-mode');homeView.hidden=true;transferView.hidden=false;navTransfers.classList.add('active');} else showHome();

document.getElementById('transferHomeLink').onclick = event => {event.preventDefault();showHome();};
document.getElementById('originSearch').addEventListener('input', event => {
  const query = event.target.value.trim().toLocaleLowerCase('es');
  let count = 0;
  originOptions.querySelectorAll('[data-origin]').forEach(button => {
    button.hidden = !(button.textContent + ' ' + button.dataset.origin).toLocaleLowerCase('es').includes(query);
    if (!button.hidden) count++;
  });
  document.getElementById('originSearchEmpty').hidden = count > 0;
});

const requestToggle=document.getElementById('requestToggle');
requestToggle.onclick=()=>{const menu=document.getElementById('requestMenu');menu.hidden=!menu.hidden;requestToggle.setAttribute('aria-expanded',String(!menu.hidden));};
if(!previewMode && new URLSearchParams(location.search).get('view')==='transfer')openHomeTransfer();

const paymentsToggle=document.getElementById('paymentsToggle');
paymentsToggle.onclick=()=>{const menu=document.getElementById('paymentsMenu');menu.hidden=!menu.hidden;paymentsToggle.setAttribute('aria-expanded',String(!menu.hidden));};
