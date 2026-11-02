// Servicios simulados de la propuesta 5. No realiza llamadas bancarias.
(() => {
  const amount = document.getElementById('amountField');
  const remove = document.getElementById('openBoard');
  const summary = document.getElementById('preferentialSummary');
  const details = document.getElementById('preferentialDetails');
  const toggle = document.getElementById('togglePreferential');
  const cancel = document.getElementById('cancelPreferential');
  const rateRow = document.querySelector('.rate-row');
  const existingVoucher = document.getElementById('existingDomesticVoucher');
  const selectVoucher = document.getElementById('selectDomesticVoucher');
  const voucherFields = selectVoucher.querySelectorAll('span');
  const quoteError = document.getElementById('quoteScheduleError');
  const quoteErrorMessage = document.getElementById('quoteErrorMessage');
  let quoteErrorTimer = null;
  let quoteErrorType = '';
  function showQuoteError(text, type) {
    clearTimeout(quoteErrorTimer);
    quoteErrorMessage.textContent = text;
    quoteErrorType = type;
    quoteError.hidden = false;
    quoteErrorTimer = setTimeout(() => { quoteError.hidden = true; quoteErrorType = ''; }, 6500);
  }
  function clearQuoteError(type) {
    if (quoteErrorType !== type) return;
    clearTimeout(quoteErrorTimer);
    quoteError.hidden = true;
    quoteErrorType = '';
  }
  const numericAmount = value => Number(String(value).replace(/\./g, '').replace(',', '.')) || 0;
  const matchesCurrencyPair = item => Boolean(item)
    && item.originCurrency === originCurrency
    && item.destinationCurrency === destinationCurrency;
  function validateVoucherBalance(showError = false) {
    const exceeded = Boolean(voucher) && numericAmount(amount.value) > numericAmount(voucher.balance);
    if (!showError) {
      amount.classList.remove('amount-limit-error');
      amount.setAttribute('aria-invalid', 'false');
      clearQuoteError('voucher-balance');
      return !exceeded;
    }
    amount.classList.toggle('amount-limit-error', exceeded);
    amount.setAttribute('aria-invalid', String(exceeded));
    if (exceeded) {
      showQuoteError(`El monto no debe superar el saldo disponible de la boleta (${voucher.balance}).`, 'voucher-balance');
      return false;
    }
    clearQuoteError('voucher-balance');
    return true;
  }
  function renderSummary() {
    const reusableVoucher = (matchesCurrencyPair(generatedVoucher) && generatedVoucher) || ((originCurrency === 'EUR' && destinationCurrency === 'USD')
      ? { originCurrency: 'EUR', destinationCurrency: 'USD', number: '125999998', balance: '100,00', rate: MockBoard.format(MockBoard.quote('EUR', 'USD').improved) }
      : null);
    summary.hidden = !voucher;
    existingVoucher.hidden = !reusableVoucher || Boolean(voucher);
    if (reusableVoucher) {
      voucherFields[0].lastChild.textContent = reusableVoucher.number;
      voucherFields[1].lastChild.textContent = reusableVoucher.balance;
      voucherFields[2].lastChild.textContent = reusableVoucher.rate;
    }
    if (matchesCurrencyPair(generatedVoucher)) {
      improveQuoteRow.hidden = true;
      setInlineOfferExpanded(false);
    }
    toggle.disabled = Boolean(voucher);
    if (voucher) {
      details.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
    rateRow.hidden = false;
    document.body.classList.toggle('generated-voucher', Boolean(voucher));
    document.getElementById('currencyField').disabled = busy || (document.body.classList.contains('interbank-transfer') && destinationCurrency==='PYG');
    if (voucher) {
      document.getElementById('preferentialNumber').textContent = voucher.number;
      document.getElementById('preferentialBalance').textContent = voucher.balance;
      document.getElementById('preferentialRate').textContent = voucher.rate;
    }
    validateVoucherBalance();
  }

  toggle.onclick = () => {
    if (voucher) return;
    details.hidden = !details.hidden;
    toggle.setAttribute('aria-expanded', String(!details.hidden));
  };
  cancel.onclick = () => remove.onclick();
  let offer = null;
  let voucher = null;
  let generatedVoucher = null;
  let busy = false;
  const calls = [];
  const registeredVouchers = [];
  const snapshot = () => JSON.stringify([originCurrency, destinationCurrency,
    document.getElementById('currencyField').value,
    document.getElementById('originAccountNumber').textContent,
    document.getElementById('destinationAccountNumber').textContent,
    Number(amount.value.replace(/\./g, '').replace(',', '.'))]);
  const message = () => {};
  async function service(action, payload) {
    calls.push({ action, payload, at: new Date().toISOString() });
    await new Promise(resolve => setTimeout(resolve, 500));
    if (action === 'consultarBoletas') return registeredVouchers.filter(item => item.context === payload.context);
    if (action === 'bajaBoleta') {
      const index = registeredVouchers.findIndex(item => item.id === payload.voucherId);
      if (index !== -1) registeredVouchers.splice(index, 1);
    }
    const result = { id: `DEMO-${calls.length}`, ...payload,
      ...(action === 'generarBoleta' ? { number: String(125999999 + calls.length - 2), balance: amount.value,
        rate: document.getElementById('inlineImprovedRate').textContent.replace(/^Gs\.\s*/, '') } : {}) };
    if (action === 'generarBoleta') registeredVouchers.push(result);
    return result;
  }
  // Registro disponible para revisar la secuencia de la demostración.
  window.mockQuoteServices = { calls, getState: () => ({ offer, voucher, generatedVoucher, busy, registeredVouchers: [...registeredVouchers] }) };
  function lock(value) {
    busy = value;
    cancel.disabled = value;
    renderSummary();
    improveQuote.disabled = applyInlineOffer.disabled = remove.disabled = value;
    amount.readOnly = value;
    transferForm.setAttribute('aria-busy', String(value));
  }
  improveQuote.onclick = async () => {
    if (busy || voucher || improveQuoteRow.hidden) return;
    const scheduleControlAccount = document.getElementById('destinationAccountNumber').textContent.trim() === '0523848840-04';
    if (scenario === 'outside-hours' || scheduleControlAccount) {
      setInlineOfferExpanded(false);
      message('Solicitud rechazada por control de horario. No se generó ninguna boleta.');
      showQuoteError('La mejora de cotización está disponible de 08:00 a 15:59 Hs., en días hábiles.', 'schedule');
      return;
    }
    lock(true);
    offer = null;
    setInlineOfferExpanded(false);
    message('Solicitando oferta…');
    try {
      offer = await service('solicitarOferta', { context: snapshot() });
      updateBoard();
      setInlineOfferExpanded(true);
      message('Oferta disponible. Al seleccionar «GENERAR BOLETA» se solicitará la generación de la boleta.');
    } finally { lock(false); }
  };
  applyInlineOffer.onclick = async () => {
    if (busy || voucher || !offer) return;
    if (offer.context !== snapshot()) {
      offer = null;
      setInlineOfferExpanded(false);
      message('El importe o las cuentas cambiaron. Solicite una nueva oferta.');
      return;
    }
    lock(true);
    message('Generando boleta…');
    try {
      const generated = await service('generarBoleta', { offerId: offer.id, context: offer.context, originCurrency, destinationCurrency });
      message('Boleta generada. Consultando lista de boletas…');
      const available = await service('consultarBoletas', { context: offer.context });
      voucher = available.find(item => item.id === generated.id);
      if (!voucher) { message('No se encontró la boleta generada en la consulta.'); return; }
      generatedVoucher = voucher;
      details.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      applySelectedRate(true);
      setInlineOfferExpanded(false);
      message('Lista de boletas consultada. Se cargó la boleta generada y se aplicó su cotización preferencial.');
    } finally { lock(false); }
  };
  remove.onclick = async () => {
    if (busy || !voucher) return;
    lock(true);
    message('Quitando la boleta de esta transferencia…');
    try {
      voucher = offer = null;
      applySelectedRate(false);
      amountQuoteChecked = true;
      updateImproveAction();
      message('Se dejó de usar la boleta en esta transferencia. La boleta generada sigue disponible y se utilizará la cotización pizarra.');
    } finally { lock(false); }
  };
  amount.addEventListener('input', () => {
    validateVoucherBalance();
    if (!voucher && !busy) { offer = null; setInlineOfferExpanded(false); message(''); }
  });
  document.getElementById('currencyField').addEventListener('change', () => {
    formatAmountField(true);
    if (!voucher && !busy) { offer = null; setInlineOfferExpanded(false); message(''); }
  });
  // Una boleta existente se desvincula al cambiar de operación, sin darla de baja.
  document.addEventListener('click', event => {
    const changesContext = event.target.closest('#changeOrigin, #changeDestination, #navTransfers, .brand, [data-home-transfer], #resultNew');
    if (!busy && voucher?.existing && changesContext) {
      voucher = offer = null;
      applySelectedRate(false);
      setInlineOfferExpanded(false);
      renderSummary();
      message('Se dejó de aplicar la boleta a esta operación. La boleta concertada sigue disponible.');
    }
    if (!busy && voucher && changesContext) {
      event.preventDefault(); event.stopImmediatePropagation();
      // Desvincula la boleta sin anularla antes de abrir la selección solicitada.
      remove.onclick().then(() => {
        if (!voucher && !busy) changesContext.click();
      });
      return;
    }
    if (busy) {
      event.preventDefault(); event.stopImmediatePropagation();
    }
  }, true);
  transferForm.addEventListener('submit', event => {
    if (!validateVoucherBalance(true)) {
      event.preventDefault(); event.stopImmediatePropagation();
      amount.focus();
      return;
    }
    if (busy || (improvedRateAccepted && !voucher)) {
      event.preventDefault(); event.stopImmediatePropagation();
      message('Espere a que se genere la boleta para continuar.');
    }
  }, true);
  document.getElementById('acceptOffer').onclick = applyInlineOffer.onclick;
  const confirm = document.getElementById('confirmMockTransfer');
  const originalConfirm = confirm.onclick;
  confirm.onclick = () => {
    originalConfirm();
    voucher = offer = null;
    lock(false);
    message('');
  };
  document.addEventListener('quote-context-changed', () => {
    if (voucher && !matchesCurrencyPair(voucher)) {
      voucher = offer = null;
      applySelectedRate(false);
      setInlineOfferExpanded(false);
    }
    renderSummary();
  });
  const existingToggle = document.getElementById('existingDomesticToggle');
  const existingList = document.getElementById('existingDomesticList');
  existingToggle.onclick = () => {existingList.hidden = !existingList.hidden;existingToggle.setAttribute('aria-expanded', String(!existingList.hidden));};
  document.getElementById('selectDomesticVoucher').onclick = () => {
    if (busy || voucher) return;
    offer = null;
    voucher = (matchesCurrencyPair(generatedVoucher) && generatedVoucher) || ((originCurrency === 'EUR' && destinationCurrency === 'USD')
      ? {id:'DEMO-EXISTING',existing:true,originCurrency:'EUR',destinationCurrency:'USD',number:'125999998',balance:'100,00',rate:MockBoard.format(currentBoardQuote().improved)}
      : null);
    if (!voucher) return;
    amount.value = voucher.balance;
    existingList.hidden = true;
    existingToggle.setAttribute('aria-expanded','false');
    applySelectedRate(true);
    setInlineOfferExpanded(false);
    lock(false);
    message('Boleta concertada seleccionada. Se utiliza la boleta existente sin generar una nueva.');
  };
  if (previewMode === 'expanded') offer = { id: 'DEMO-PREVIEW-OFFER', context: snapshot() };
  if (previewMode === 'applied') {
    voucher = { id: 'DEMO-PREVIEW-VOUCHER', context: snapshot(), originCurrency, destinationCurrency, number: '125999999', balance: amount.value, rate: document.getElementById('inlineImprovedRate').textContent.replace(/^Gs\.\s*/, '') };
    generatedVoucher = voucher;
    lock(false);
    message('Boleta generada. La cotización mejorada está aplicada.');
  }
})();
