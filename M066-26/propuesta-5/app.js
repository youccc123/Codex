const transferView = document.getElementById('transferView');
const confirmationView = document.getElementById('confirmationView');
const boardDialog = document.getElementById('boardDialog');
const transferForm = document.getElementById('transferForm');
const originAccount = document.getElementById('originAccount');
const destinationAccount = document.getElementById('destinationAccount');
const originOptions = document.getElementById('originOptions');
const destinationOptions = document.getElementById('destinationOptions');
const destinationSection = document.getElementById('destinationSection');
const destinationDetail = document.getElementById('destinationDetail');
const transferActions = document.getElementById('transferActions');
const improveQuoteRow = document.getElementById('improveQuoteRow');
const improveQuote = document.getElementById('improveQuote');
const inlineOfferPanel = document.getElementById('inlineOfferPanel');
const applyInlineOffer = document.getElementById('applyInlineOffer');
const destinationSearch = document.getElementById('destinationSearch');
const changeOrigin = document.getElementById('changeOrigin');
const changeDestination = document.getElementById('changeDestination');
const transferTabs = document.getElementById('transferTabs');
const transferLayout = document.getElementById('transferLayout');
const limitsPanel = document.getElementById('limitsPanel');
const scenario = new URLSearchParams(window.location.search).get('scenario') || 'eligible';
const previewMode = new URLSearchParams(window.location.search).get('preview');

let originCurrency = null;
let destinationCurrency = null;
let improvedRateAccepted = false;
let amountQuoteChecked = false;

function bothAccountsSelected() {
  return Boolean(originCurrency && destinationCurrency);
}

function hasUsdAccount() {
  return bothAccountsSelected()
    && (originCurrency === 'USD' || destinationCurrency === 'USD');
}

function transactionCurrency() {
  if (!bothAccountsSelected()) return 'PYG';
  if (originCurrency === destinationCurrency) return originCurrency;
  return hasUsdAccount() ? 'USD' : 'PYG';
}

function hasEnteredAmount() {
  const rawAmount = document.getElementById('amountField').value.trim();
  const parsedAmount = Number(rawAmount.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(parsedAmount) && parsedAmount > 0;
}

function updateImproveAction() {
  const supportsImprovement = scenario === 'eligible' || scenario === 'outside-hours';
  improveQuoteRow.hidden = (originCurrency === 'EUR' && destinationCurrency === 'USD') || !(supportsImprovement && hasUsdAccount() && hasEnteredAmount() && !improvedRateAccepted);
  if (improveQuoteRow.hidden) setInlineOfferExpanded(false);
  updateInterbankMode();
  document.dispatchEvent(new Event('quote-context-changed'));
}

function setInlineOfferExpanded(expanded) {
  inlineOfferPanel.hidden = !expanded;
  improveQuote.setAttribute('aria-expanded', String(expanded));
}

function formatAmountField(completeDecimals = false) {
  const amountField = document.getElementById('amountField');
  const usesDecimals = document.getElementById('currencyField').value !== 'Guaraníes';
  const rawValue = amountField.value.replace(/\./g, '').replace(/[^0-9,]/g, '');
  const parts = rawValue.split(',');
  const integerDigits = (parts.shift() || '').replace(/^0+(?=\d)/, '');
  const integerValue = integerDigits || '0';
  const formattedInteger = integerValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (!usesDecimals) {
    amountField.value = formattedInteger;
    return;
  }

  const hadDecimalSeparator = rawValue.includes(',');
  let decimals = parts.join('').slice(0, 2);
  if (completeDecimals) decimals = decimals.padEnd(2, '0');
  amountField.value = hadDecimalSeparator || completeDecimals
    ? `${formattedInteger},${decimals}`
    : formattedInteger;
}

function currentBoardQuote(){return MockBoard.quote(originCurrency,destinationCurrency);}
function updateBoard() {
 const q=currentBoardQuote(),foreign=originCurrency==='PYG'?destinationCurrency:originCurrency;
 document.getElementById('boardOrigin').textContent=originCurrency;
 document.getElementById('boardDestination').textContent=destinationCurrency;
 document.getElementById('boardCurrency').textContent=foreign;
 document.getElementById('boardCurrencyName').textContent=foreign==='EUR'?'Euro':'Dólar americano';
 document.getElementById('boardBuy').textContent='Gs. '+MockBoard.format(MockBoard.rows[foreign]?.[0]||1);
 document.getElementById('boardSell').textContent='Gs. '+MockBoard.format(MockBoard.rows[foreign]?.[1]||1);
 document.getElementById('quoteIndicator').hidden=false;
 document.getElementById('inlineCurrentRate').textContent=MockBoard.format(q.board);
 document.getElementById('inlineImprovedRate').textContent=MockBoard.format(q.improved);
 document.querySelectorAll('.inline-offer-copy span, #webOfferComparison span').forEach(el=>el.textContent=q.unit);
 const comparison=document.querySelectorAll('#webOfferComparison strong');
 if(comparison[0])comparison[0].textContent=MockBoard.format(q.board);
 if(comparison[1])comparison[1].textContent=MockBoard.format(q.improved);
 const gain=document.querySelector('#webOfferComparison b');if(gain)gain.textContent='Mejora de '+MockBoard.format(Math.abs(q.improved-q.board))+' '+q.unit;
 const existing=document.querySelector('#selectDomesticVoucher > span:last-child');if(existing)existing.lastChild.textContent=MockBoard.format(q.improved);
}

function applySelectedRate(useImprovedRate) {
  improvedRateAccepted = useImprovedRate;
  const existingPair = originCurrency === 'EUR' && destinationCurrency === 'USD';
  const q=currentBoardQuote();
  const rate = MockBoard.format(useImprovedRate?q.improved:q.board);
  const label = 'Cotización';
  const quoteIndicator = document.getElementById('quoteIndicator');
  quoteIndicator.classList.remove('offer-applied');
  quoteIndicator.classList.toggle('improvement-active', useImprovedRate);
  quoteIndicator.closest('.web-quote-control').classList.remove('offer-is-applied');
  document.getElementById('openBoard').hidden = !useImprovedRate;
  document.getElementById('openBoard').textContent = 'No utilizar';
  document.getElementById('quoteLabel').textContent = label;
  document.getElementById('quoteRate').textContent = rate;
  document.getElementById('summaryRateLabel').textContent = useImprovedRate ? 'Cotización mejorada aplicada' : 'Cotización pizarra';
  document.getElementById('summaryRate').textContent = rate+' '+q.unit;
  document.querySelector('.web-summary-rate').classList.toggle('offer-applied', useImprovedRate);
  updateImproveAction();
}

function configureOfferScenario() {
  document.getElementById('boardTitle').textContent = 'Consulta de mejora de cotización';
  document.getElementById('webOfferComparison').hidden = false;
  document.getElementById('acceptOffer').hidden = false;
  document.getElementById('continueBoard').textContent = 'CONTINUAR CON TASA ACTUAL';
  document.getElementById('boardIntro').textContent = 'Tenés una mejora disponible para esta operación.';
}

function configureBoardDetail() {
  document.getElementById('boardTitle').textContent = 'Detalle de cotización';
  document.getElementById('webOfferComparison').hidden = true;
  document.getElementById('acceptOffer').hidden = true;
  document.getElementById('continueBoard').textContent = 'CERRAR';
  document.getElementById('boardIntro').textContent = 'Cotización pizarra aplicable a esta operación.';
}

function selectOrigin(currency) {
  document.body.classList.remove('transfer-entry');
  document.body.classList.remove('transfer-form-mode');
  document.body.classList.add('destination-entry');
  originCurrency = currency;
  document.getElementById('originCurrencyLabel').textContent = currency;
  document.getElementById('originAccountNumber').textContent = currency === 'EUR' ? '4018190001' : '4018190000';
  document.getElementById('originAccountType').textContent = currency === 'EUR' ? 'Caja de Ahorros' : 'Cuentas Corrientes';
  originOptions.hidden = true;
  originAccount.hidden = false;
  changeOrigin.hidden = false;
  transferTabs.hidden = false;
  transferLayout.classList.remove('source-selection');
  limitsPanel.hidden = true;
  destinationSection.hidden = false;
  destinationSection.classList.remove('locked');
  destinationSearch.disabled = false;
  destinationSearch.placeholder = 'Buscar destinatario';
  destinationOptions.hidden = false;
  if (typeof renderDestinationAccounts === 'function') renderDestinationAccounts();
}

function selectDestination(currency, account) {
  document.body.classList.remove('destination-entry');
  document.body.classList.add('transfer-form-mode');
  limitsPanel.hidden = Boolean(account?.balance);
  transferTabs.hidden = true;
  destinationAccount.classList.toggle('own-account', Boolean(account?.balance));
  document.querySelector('.destination-selected-balance').hidden = !account?.balance;
  document.querySelector('.destination-selected-eye').hidden = !account?.balance;
  document.getElementById('destinationBalance').textContent = account?.balance || '';
  destinationCurrency = currency;
  const interbank=Boolean(account && !account.balance && !/sudameris/i.test(account.type));
  document.body.classList.toggle('interbank-transfer',interbank);
  document.getElementById('sipNotice').hidden=!interbank;
  document.getElementById('domesticQuoteHours').hidden=interbank;
  const logo=document.querySelector('#destinationAccount .account-icon img');
  logo.src=account?.logoUrl||'assets/bank.png';logo.alt=interbank?account.type:'Sudameris';
  amountQuoteChecked = false;
  document.getElementById('destinationCurrencyLabel').textContent = currency;
  document.getElementById('destinationAccountNumber').textContent = currency === 'USD' ? '300053000' : '490875';
  destinationOptions.hidden = true;
  destinationSection.classList.add('has-selection');
  destinationDetail.hidden = false;
  transferActions.hidden = false;
  destinationAccount.hidden = false;
  changeDestination.hidden = false;
  transferForm.hidden = false;

  if (hasUsdAccount()) {
    updateBoard();
    applySelectedRate(false);
  } else {
    document.getElementById('quoteIndicator').hidden = true;
    document.getElementById('currencyField').value = transactionCurrency() === 'USD' ? 'Dólares' : 'Guaraníes';
  }
  if (account) {
    document.getElementById('destinationAccountNumber').textContent = account.number;
    document.querySelector('.credit-account-copy b').textContent = account.name;
    document.querySelector('.credit-account-copy span').firstChild.textContent = account.type + ' ';
  }
  if(interbank)document.getElementById('currencyField').value={PYG:'Guaraníes',USD:'Dólares',EUR:'Euros'}[currency!=='PYG'?originCurrency:currency];
  formatAmountField(true);
  updateImproveAction();
}

originOptions.querySelectorAll('[data-origin]').forEach(button => {
  button.onclick = () => selectOrigin(button.dataset.origin);
});

destinationOptions.querySelectorAll('[data-destination]').forEach(button => {
  button.onclick = () => selectDestination(button.dataset.destination);
});

changeOrigin.onclick = () => {
  document.body.classList.remove('destination-entry');
  document.body.classList.remove('transfer-form-mode');
  document.body.classList.add('transfer-entry');
  document.getElementById('originSearch').value = '';
  originOptions.querySelectorAll('[data-origin]').forEach(button => button.hidden = false);
  document.getElementById('originSearchEmpty').hidden = true;
  originCurrency = null;
  destinationCurrency = null;
  amountQuoteChecked = false;
  boardDialog.hidden = true;
  originAccount.hidden = true;
  originOptions.hidden = false;
  changeOrigin.hidden = true;
  transferTabs.hidden = false;
  transferLayout.classList.add('source-selection');
  limitsPanel.hidden = true;
  destinationSection.hidden = true;
  destinationAccount.hidden = true;
  destinationDetail.hidden = true;
  transferActions.hidden = true;
  destinationSection.classList.remove('has-selection');
  destinationOptions.hidden = true;
  changeDestination.hidden = true;
  destinationSection.classList.add('locked');
  destinationSearch.disabled = true;
  destinationSearch.placeholder = 'Primero seleccioná la cuenta de origen';
  transferForm.hidden = true;
  improvedRateAccepted = false;
  updateImproveAction();
};

changeDestination.onclick = () => {
  document.body.classList.remove('transfer-form-mode');
  document.body.classList.add('destination-entry');
  limitsPanel.hidden = true;
  if (typeof renderDestinationAccounts === 'function') renderDestinationAccounts();
  destinationCurrency = null;
  amountQuoteChecked = false;
  boardDialog.hidden = true;
  destinationAccount.hidden = true;
  destinationDetail.hidden = true;
  transferActions.hidden = true;
  destinationSection.classList.remove('has-selection');
  destinationOptions.hidden = false;
  changeDestination.hidden = true;
  transferForm.hidden = true;
  improvedRateAccepted = false;
  updateImproveAction();
};

document.getElementById('amountField').addEventListener('input', () => {
  formatAmountField(false);
  amountQuoteChecked = true;
  updateImproveAction();
});
document.getElementById('amountField').addEventListener('blur', () => {
  formatAmountField(true);
  amountQuoteChecked = true;
  updateImproveAction();
});

improveQuote.onclick = () => {
  if (!improveQuoteRow.hidden) {
    updateBoard();
    setInlineOfferExpanded(inlineOfferPanel.hidden);
  }
};

applyInlineOffer.onclick = () => {
  applySelectedRate(true);
  setInlineOfferExpanded(false);
};

document.getElementById('openBoard').onclick = () => {
  if (improvedRateAccepted) {
    applySelectedRate(false);
    amountQuoteChecked = true;
    updateImproveAction();
  }
};
document.getElementById('closeBoard').onclick = () => boardDialog.hidden = true;
document.getElementById('continueBoard').onclick = () => {
  applySelectedRate(false);
  boardDialog.hidden = true;
};
document.getElementById('acceptOffer').onclick = () => {
  applySelectedRate(true);
  boardDialog.hidden = true;
};

transferForm.onsubmit = event => {
  event.preventDefault();
  const currency = {Dólares:'USD',Euros:'EUR',Guaraníes:'Gs.'}[document.getElementById('currencyField').value];
  document.getElementById('summaryOrigin').textContent = '••••' + document.getElementById('originAccountNumber').textContent.slice(-6);
  document.getElementById('summaryType').textContent = document.getElementById('originAccountType').textContent;
  document.getElementById('summaryOwner').textContent = document.querySelector('.credit-account-copy b').textContent;
  document.getElementById('summaryDestination').textContent = document.getElementById('destinationAccountNumber').textContent;
  const amount = Number(document.getElementById('amountField').value.replace(/\./g, '').replace(',', '.'));
  const q=currentBoardQuote();
  const rate = improvedRateAccepted ? q.improved : q.board;
  const inputCurrency={Dólares:'USD',Euros:'EUR',Guaraníes:'PYG'}[document.getElementById('currencyField').value];
  const total=inputCurrency===originCurrency?amount:originCurrency==='PYG'?amount*rate:amount/rate;
  document.getElementById('summaryTotal').textContent = `${originCurrency === 'PYG' ? 'Gs.' : originCurrency} ${total.toLocaleString('es-PY', {minimumFractionDigits: originCurrency === 'PYG' ? 0 : 2, maximumFractionDigits: 2})}`;
  document.querySelector('.web-summary-rate').hidden = !hasUsdAccount();
  document.getElementById('summaryRateLabel').textContent = improvedRateAccepted ? 'Cotización mejorada' : 'Cotización';
  document.getElementById('summaryRate').textContent = rate.toLocaleString('es-PY');
  document.querySelectorAll('.verification-digits input').forEach(input => input.value = '');
  document.getElementById('confirmMockTransfer').disabled = true;
  document.getElementById('summaryAmount').textContent = `${currency} ${document.getElementById('amountField').value}`;
  transferView.hidden = true;
  confirmationView.hidden = false;
  scrollTo({ top: 0, behavior: 'smooth' });
};

document.getElementById('backButton').onclick = () => {
  confirmationView.hidden = true;
  transferView.hidden = false;
};

if (previewMode === 'offer' || previewMode === 'expanded' || previewMode === 'applied') {
  selectOrigin('PYG');
  selectDestination('USD');
  document.getElementById('amountField').value = '10.000';
  formatAmountField(true);
  amountQuoteChecked = true;
  updateImproveAction();

  if (previewMode === 'expanded') {
    updateBoard();
    setInlineOfferExpanded(true);
  } else if (previewMode === 'applied') {
    updateBoard();
    applySelectedRate(true);
  }
}

const codeDigits = [...document.querySelectorAll('.verification-digits input')];
codeDigits.forEach((input, index) => input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(-1);
  if (input.value && index < 5) codeDigits[index + 1].focus();
  document.getElementById('confirmMockTransfer').disabled = !codeDigits.every(digit => /^\d$/.test(digit.value));
}));
document.getElementById('resendCode').onclick = () => {
  document.getElementById('verificationStatus').hidden = false;
  document.getElementById('verificationStatus').textContent = 'Reenvío simulado. Utilice cualquier código de 6 dígitos.';
};
const resultView = document.getElementById('resultView');
document.getElementById('confirmMockTransfer').onclick = () => {
  confirmationView.hidden = true;
  resultView.hidden = false;
  const copy = (to, from) => document.getElementById(to).textContent = document.getElementById(from).textContent;
  copy('resultOwner','summaryOwner'); copy('resultAmount','summaryTotal');
  copy('resultCreditAmount','summaryAmount'); copy('resultRate','summaryRate'); copy('resultRateLabel','summaryRateLabel');
  document.getElementById('resultOrigin').textContent = document.getElementById('summaryOrigin').textContent + ' ' + document.getElementById('summaryType').textContent;
  document.getElementById('resultDestination').textContent = document.getElementById('summaryDestination').textContent + ' ' + document.querySelector('.credit-account-copy span').firstChild.textContent.trim();
  document.getElementById('resultDate').textContent = new Date().toLocaleDateString('es-PY', {day:'2-digit',month:'2-digit',year:'numeric'}) + ' - ' + new Date().toLocaleTimeString('es-PY', {hour12:false});
  copy('detailDate','resultDate'); copy('detailPosted','resultDate');
  copy('detailCreditNumber','summaryDestination'); copy('detailCreditOwner','summaryOwner');
  copy('detailDebitType','summaryType'); copy('detailDebitNumber','summaryOrigin'); copy('detailTotal','summaryTotal');
  document.getElementById('detailCreditType').textContent = document.querySelector('.credit-account-copy span').firstChild.textContent.trim();
  document.getElementById('resultSummaryTab').click();
  document.getElementById('resultStatus').hidden = true;
  window.scrollTo(0,0);
};
['Summary','Details'].forEach(kind => document.getElementById('result'+kind+'Tab').onclick = () => {
  document.getElementById('receiptSummary').hidden = kind !== 'Summary';
  document.getElementById('receiptDetails').hidden = kind !== 'Details';
  ['Summary','Details'].forEach(other => { const button = document.getElementById('result'+other+'Tab'); button.classList.toggle('active',kind===other);button.setAttribute('aria-selected',String(kind===other)); });
});
document.getElementById('resultNew').onclick = () => openHomeTransfer();
const resultNotice = message => { const status = document.getElementById('resultStatus');status.textContent = message;status.hidden = false; };
document.getElementById('resultFavorite').onclick = () => resultNotice('Operación agregada a favoritos en esta demostración.');
document.getElementById('resultShare').onclick = () => resultNotice('Compartir comprobante: acción simulada del mockup.');
document.getElementById('resultDownload').onclick = () => {
  const text = 'COMPROBANTE DE DEMOSTRACIÓN — SIN VALIDEZ BANCARIA\n'+document.getElementById('receiptSummary').innerText+'\n'+document.getElementById('receiptDetails').textContent;
  const url = URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a');link.href=url;link.download='comprobante-demo.txt';link.click();URL.revokeObjectURL(url);
};

function updateInterbankMode(){
 const interbank=document.body.classList.contains('interbank-transfer')&&bothAccountsSelected();
 const field=document.getElementById('currencyField');
 const n=Number(document.getElementById('amountField').value.replace(/\./g,'').replace(',','.'))||0;
 const extended=interbank&&(destinationCurrency!=='PYG'||(field.value==='Guaraníes'&&n>10000000));
 document.body.classList.toggle('interbank-extended',extended);
 document.getElementById('interbankOnline').hidden=!extended;
 document.querySelector('#limitsPanel .limits-card section strong').textContent=extended?'Gs. 1.000.000.000':'Gs. 10.000.000';
 if(interbank){
  Array.from(field.options).forEach(o=>{const c={Guaraníes:'PYG',Dólares:'USD',Euros:'EUR'}[o.value];o.hidden=c!==originCurrency&&c!==destinationCurrency;});
  document.getElementById('quoteIndicator').hidden=originCurrency===destinationCurrency;
 }else Array.from(field.options).forEach(o=>o.hidden=false);
}

const scheduleToggle = document.getElementById('scheduleToggle');
const scheduleDate = document.getElementById('scheduleDate');
const schedulePeriod = document.getElementById('schedulePeriod');
scheduleToggle.addEventListener('change', () => {
  const active = scheduleToggle.checked;
  document.getElementById('scheduleFields').hidden = !active;
  scheduleToggle.setAttribute('aria-expanded', String(active));
  scheduleDate.disabled = schedulePeriod.disabled = !active;
  scheduleDate.required = active;
});
