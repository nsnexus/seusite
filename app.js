/* ===== NS Links – app.js (Firebase) ===== */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, runTransaction, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig, BASE_URL } from '/firebase-config.js';
import { THEMES, SOCIAL_ICONS } from '/data.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------- rota ---------- */
const RESERVED = ['editor','login','admin','app','api','perfis','index.html','www'];
const qs = new URLSearchParams(location.search);
const SLUG = (qs.get('u') || location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
const PUBLIC_MODE = !!SLUG && !RESERVED.includes(SLUG);

/* ---------- estado ---------- */
const DEFAULT = () => ({
  name: 'Seu Nome', bio: 'Toque em um link abaixo 👇', avatar: '', theme: 'noite', btnStyle: 'glass',
  socials: { instagram:'', whatsapp:'', tiktok:'', youtube:'', linkedin:'', email:'' },
  links: [{ id: uid(), emoji:'🌐', title:'Meu primeiro link', url:'https://nsnexus.com.br', highlight:true, visible:true }],
});
let state = DEFAULT();
let user = null, mySlug = null;

/* ---------- utilidades ---------- */
function uid(){ return Math.random().toString(36).slice(2,10); }
const $ = s => document.querySelector(s);
const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugify = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,30);
const validSlug = s => /^[a-z0-9-]{3,30}$/.test(s) && !RESERVED.includes(s);
function show(id){ ['#screenLoading','#screenLogin','#screenClaim','#page','#topbar'].forEach(s => $(s).hidden = true); [].concat(id).forEach(s => $(s).hidden = false); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2400); }
function debounce(fn, ms){ let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

// Segurança: só permite http, https, mailto e tel (bloqueia javascript:)
function safeUrl(u=''){
  u = String(u).trim(); if (!u) return '#';
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  if (/^[a-z]+:/i.test(u)) return '#';
  if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(u)) return 'mailto:' + u;
  return 'https://' + u;
}
function socialUrl(k, v){
  if (!v) return '';
  if (k === 'whatsapp') return /^https?:/.test(v) ? safeUrl(v) : 'https://wa.me/' + v.replace(/\D/g,'');
  if (k === 'email') return 'mailto:' + v.replace(/^mailto:/,'');
  return safeUrl(v);
}
function avatarFallback(name){
  const ini = (name||'?').split(' ').filter(Boolean).slice(0,2).map(p=>p[0].toUpperCase()).join('');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#334155"/><text x="50%" y="54%" font-family="Arial" font-size="80" fill="#fff" text-anchor="middle" dominant-baseline="middle">${ini}</text></svg>`);
}
function authError(e){
  const m = {
    'auth/invalid-credential':'E-mail ou senha incorretos.', 'auth/wrong-password':'Senha incorreta.',
    'auth/user-not-found':'Conta não encontrada.', 'auth/email-already-in-use':'Este e-mail já tem conta. Clique em Entrar.',
    'auth/weak-password':'Senha fraca (mín. 6 caracteres).', 'auth/invalid-email':'E-mail inválido.',
    'auth/popup-closed-by-user':'Login cancelado.', 'auth/unauthorized-domain':'Domínio não autorizado no Firebase.',
    'auth/too-many-requests':'Muitas tentativas. Aguarde um pouco.',
  };
  return m[e.code] || 'Erro: ' + (e.code || e.message);
}

/* ---------- renderização ---------- */
function applyTheme(){
  const t = THEMES[state.theme] || THEMES.noite, r = document.documentElement.style;
  ['bg1','bg2','accent','accent2','text','muted'].forEach(k => r.setProperty('--'+k, t[k]));
  const light = state.theme === 'claro';
  r.setProperty('--card', light ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.10)');
  r.setProperty('--border', light ? 'rgba(15,23,42,.12)' : 'rgba(255,255,255,.18)');
  document.querySelector('meta[name=theme-color]').content = t.bg1;
  document.body.className = 'btn-' + (state.btnStyle || 'glass');
}
function render(){
  applyTheme();
  document.title = state.name + ' | NS Links';
  $('#name').textContent = state.name;
  $('#bio').textContent = state.bio;
  const av = $('#avatar'); av.onerror = () => { av.onerror = null; av.src = avatarFallback(state.name); };
  av.src = state.avatar || avatarFallback(state.name);
  $('#socials').innerHTML = Object.entries(state.socials || {}).filter(([k,v]) => v && SOCIAL_ICONS[k])
    .map(([k,v]) => `<a href="${esc(socialUrl(k,v))}" target="_blank" rel="noopener" aria-label="${k}">${SOCIAL_ICONS[k]}</a>`).join('');
  const vis = (state.links || []).filter(l => l.visible);
  $('#links').innerHTML = vis.length ? vis.map((l,i) => `
    <a class="link ${l.highlight?'hl':''}" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener" style="animation-delay:${.1+i*.07}s">
      <span class="emo">${esc(l.emoji||'🔗')}</span><span class="ttl">${esc(l.title)}</span></a>`).join('')
    : `<div class="empty">${PUBLIC_MODE ? 'Nenhum link ainda.' : 'Nenhum link ainda. Toque em ✏️ para adicionar.'}</div>`;
}

/* ---------- salvar no Firestore (automático) ---------- */
const pageData = () => ({ name: state.name, bio: state.bio, avatar: state.avatar || '', theme: state.theme,
  btnStyle: state.btnStyle, socials: state.socials, links: state.links });
function setStatus(t){ $('#saveStatus').textContent = t; }
const persist = debounce(async () => {
  if (!mySlug) return;
  try { await updateDoc(doc(db,'pages',mySlug), { ...pageData(), updatedAt: serverTimestamp() }); setStatus('✅ Salvo'); }
  catch (e) { console.error(e); setStatus('⚠️ Erro ao salvar'); toast('⚠️ ' + (e.code === 'permission-denied' ? 'Dados inválidos (foto grande?)' : 'Falha ao salvar')); }
}, 700);
function save(){ setStatus('💾 Salvando...'); render(); persist(); }

/* ---------- MODO PÚBLICO ---------- */
async function loadPublic(){
  $('#footLink').href = BASE_URL;
  try {
    const snap = await getDoc(doc(db,'pages',SLUG));
    if (!snap.exists()) throw 0;
    state = { ...DEFAULT(), ...snap.data() };
  } catch {
    state = { ...DEFAULT(), name:'Página não encontrada', bio:`O endereço "/${SLUG}" ainda não existe 😕\nQue tal criar o seu?`,
      socials:{}, links:[{ id:'c', emoji:'✨', title:'Criar minha página grátis', url:BASE_URL, highlight:true, visible:true }] };
  }
  render(); show(['#page','#topbar']);
}

/* ---------- MODO EDITOR ---------- */
async function loadEditor(){
  onAuthStateChanged(auth, async u => {
    user = u;
    if (!u) { mySlug = null; show('#screenLogin'); return; }
    show('#screenLoading');
    try {
      const us = await getDoc(doc(db,'users',u.uid));
      mySlug = us.exists() ? us.data().slug : null;
      if (!mySlug) { show('#screenClaim'); $('#inClaim').value = slugify(u.displayName || u.email.split('@')[0]); checkClaim(); return; }
      const ps = await getDoc(doc(db,'pages',mySlug));
      state = { ...DEFAULT(), ...(ps.exists() ? ps.data() : {}) };
      openEditor();
    } catch (e) { console.error(e); toast('Erro ao carregar. Verifique a configuração do Firebase.'); show('#screenLogin'); }
  });
}
function openEditor(){
  render(); show(['#page','#topbar']);
  $('#btnEdit').hidden = false; $('#btnView').hidden = false;
  $('#btnView').href = `${BASE_URL}/${mySlug}`;
  $('#footLink').textContent = `${BASE_URL.replace(/^https?:\/\//,'')}/${mySlug}`;
  $('#footLink').href = `${BASE_URL}/${mySlug}`;
}

/* Login */
$('#btnGoogle').onclick = async () => {
  try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { msg('#loginMsg', authError(e)); }
};
$('#emailForm').onsubmit = async e => {
  e.preventDefault();
  const mode = e.submitter?.dataset.mode || 'login', email = $('#inEmail').value.trim(), pass = $('#inPass').value;
  msg('#loginMsg', 'Aguarde...', '');
  try { mode === 'signup' ? await createUserWithEmailAndPassword(auth, email, pass) : await signInWithEmailAndPassword(auth, email, pass); }
  catch (err) { msg('#loginMsg', authError(err)); }
};
$('#btnForgot').onclick = async () => {
  const email = $('#inEmail').value.trim();
  if (!email) return msg('#loginMsg', 'Digite seu e-mail acima primeiro.');
  try { await sendPasswordResetEmail(auth, email); msg('#loginMsg', '📧 E-mail de redefinição enviado!', 'ok'); }
  catch (e) { msg('#loginMsg', authError(e)); }
};
function msg(sel, text, cls='err'){ const el = $(sel); el.textContent = text; el.className = 'msg ' + cls; }

/* Escolher / alterar endereço */
async function slugAvailable(s){ return !(await getDoc(doc(db,'pages',s))).exists(); }
const checkClaim = debounce(async () => {
  const s = slugify($('#inClaim').value); $('#btnClaim').disabled = true;
  if (!validSlug(s)) return msg('#claimMsg', 'Use 3 a 30 letras, números ou hífen.');
  msg('#claimMsg', 'Verificando...', '');
  if (await slugAvailable(s)) { msg('#claimMsg', `✅ ${BASE_URL.replace(/^https?:\/\//,'')}/${s} está livre!`, 'ok'); $('#btnClaim').disabled = false; }
  else msg('#claimMsg', '❌ Já está em uso. Tente outro.');
}, 400);
$('#inClaim').oninput = checkClaim;
$('#inClaim').onblur = e => e.target.value = slugify(e.target.value);

async function moveToSlug(newSlug, data){
  await runTransaction(db, async tx => {
    const ref = doc(db,'pages',newSlug);
    if ((await tx.get(ref)).exists()) throw new Error('taken');
    tx.set(ref, { ...data, slug:newSlug, uid:user.uid, updatedAt: serverTimestamp() });
    if (mySlug && mySlug !== newSlug) tx.delete(doc(db,'pages',mySlug));
    tx.set(doc(db,'users',user.uid), { slug:newSlug });
  });
  mySlug = newSlug;
}
$('#btnClaim').onclick = async () => {
  const s = slugify($('#inClaim').value); $('#btnClaim').disabled = true;
  try {
    state = { ...DEFAULT(), name: user.displayName || 'Seu Nome', avatar: user.photoURL || '' };
    await moveToSlug(s, { ...pageData(), createdAt: serverTimestamp() });
    toast('🎉 Página criada!'); openEditor(); openPanel();
  } catch (e) { msg('#claimMsg', e.message === 'taken' ? '❌ Alguém acabou de pegar. Tente outro.' : 'Erro ao criar.'); $('#btnClaim').disabled = false; }
};

const checkSlug = debounce(async () => {
  const s = slugify($('#inSlug').value); $('#btnChangeSlug').disabled = true;
  if (s === mySlug) return $('#slugMsg').textContent = 'Este é seu endereço atual.';
  if (!validSlug(s)) return $('#slugMsg').textContent = 'Use 3 a 30 letras, números ou hífen.';
  $('#slugMsg').textContent = 'Verificando...';
  if (await slugAvailable(s)) { $('#slugMsg').textContent = '✅ Disponível'; $('#btnChangeSlug').disabled = false; }
  else $('#slugMsg').textContent = '❌ Já está em uso';
}, 400);
$('#inSlug').oninput = checkSlug;
$('#btnChangeSlug').onclick = async () => {
  const s = slugify($('#inSlug').value);
  if (!confirm(`Mudar para ${BASE_URL}/${s}?\nO endereço antigo deixará de funcionar.`)) return;
  try { await moveToSlug(s, pageData()); toast('✅ Endereço alterado'); openEditor(); fillForms(); }
  catch (e) { toast(e.message === 'taken' ? '❌ Endereço em uso' : 'Erro ao alterar'); }
};

/* ---------- painel ---------- */
function openPanel(){ fillForms(); $('#panel').classList.add('open'); $('#overlay').classList.add('show'); }
function closePanel(){ $('#panel').classList.remove('open'); $('#overlay').classList.remove('show'); resetLinkForm(); }
function fillForms(){
  $('#inName').value = state.name; $('#inBio').value = state.bio;
  $('#inAvatar').value = (state.avatar || '').startsWith('data:') ? '' : state.avatar;
  document.querySelectorAll('[data-social]').forEach(i => i.value = state.socials?.[i.dataset.social] || '');
  $('#inBtnStyle').value = state.btnStyle;
  $('#inSlug').value = mySlug || ''; $('#slugMsg').textContent = ''; $('#btnChangeSlug').disabled = true;
  $('#userInfo').textContent = user ? `Conectado como ${user.email}` : '';
  renderThemes(); renderLinkList();
}
function renderThemes(){
  $('#themeGrid').innerHTML = Object.entries(THEMES).map(([k,t]) => `
    <button class="theme ${state.theme===k?'sel':''}" data-theme="${k}" style="background:linear-gradient(135deg,${t.bg1},${t.bg2});color:${t.text}">
      <span style="position:absolute;top:8px;right:8px;width:14px;height:14px;border-radius:50%;background:${t.accent}"></span>${t.nome}</button>`).join('');
}
function renderLinkList(){
  $('#linkList').innerHTML = state.links.map(l => `
    <li data-id="${l.id}" class="${l.visible?'':'off'}">
      <span class="drag">☰</span><span>${esc(l.emoji||'🔗')}</span>
      <div class="info"><b>${esc(l.title)}</b><small>${esc(l.url)}</small></div>
      <button class="mini" data-act="vis">${l.visible?'👁️':'🚫'}</button>
      <button class="mini" data-act="edit">✏️</button>
      <button class="mini" data-act="del">🗑️</button>
    </li>`).join('') || '<p class="hint">Nenhum link cadastrado.</p>';
}
function resetLinkForm(){ $('#linkForm').reset(); $('#inId').value=''; $('#btnSaveLink').textContent='Adicionar link'; $('#btnCancelEdit').hidden=true; }

$('#btnEdit').onclick = openPanel;
$('#btnClose').onclick = closePanel;
$('#overlay').onclick = closePanel;
document.addEventListener('keydown', e => e.key === 'Escape' && closePanel());
document.querySelectorAll('.tab').forEach(tab => tab.onclick = () => {
  document.querySelectorAll('.tab,.tab-body').forEach(el => el.classList.remove('active'));
  tab.classList.add('active'); $('#'+tab.dataset.tab).classList.add('active');
});

// Perfil
$('#inName').oninput = e => { state.name = e.target.value.slice(0,40) || 'Seu Nome'; save(); };
$('#inBio').oninput = e => { state.bio = e.target.value; save(); };
$('#inAvatar').onchange = e => { const v = e.target.value.trim(); state.avatar = v ? safeUrl(v) : ''; save(); };
document.querySelectorAll('[data-social]').forEach(i => i.oninput = () => { state.socials[i.dataset.social] = i.value.trim(); save(); });
$('#inAvatarFile').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const img = new Image();
  img.onload = () => {
    const S = 300, c = document.createElement('canvas'); c.width = c.height = S;
    const s = Math.min(img.width, img.height);
    c.getContext('2d').drawImage(img, (img.width-s)/2, (img.height-s)/2, s, s, 0, 0, S, S);
    state.avatar = c.toDataURL('image/jpeg', .8); URL.revokeObjectURL(img.src); save(); toast('📷 Foto atualizada');
  };
  img.src = URL.createObjectURL(f);
};

// Links
$('#linkForm').onsubmit = e => {
  e.preventDefault();
  if (!$('#inId').value && state.links.length >= 50) return toast('Limite de 50 links');
  const data = { emoji: $('#inEmoji').value.trim() || '🔗', title: $('#inTitle').value.trim(),
    url: safeUrl($('#inUrl').value), highlight: $('#inHighlight').checked };
  if (data.url === '#') return toast('❌ Link inválido');
  const id = $('#inId').value;
  if (id) Object.assign(state.links.find(l => l.id === id), data);
  else state.links.push({ id: uid(), visible: true, ...data });
  toast(id ? '✅ Link atualizado' : '✅ Link adicionado');
  save(); renderLinkList(); resetLinkForm();
};
$('#btnCancelEdit').onclick = resetLinkForm;
$('#linkList').onclick = e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const id = b.closest('li').dataset.id, l = state.links.find(x => x.id === id);
  if (b.dataset.act === 'edit') {
    $('#inId').value=id; $('#inEmoji').value=l.emoji; $('#inTitle').value=l.title; $('#inUrl').value=l.url; $('#inHighlight').checked=l.highlight;
    $('#btnSaveLink').textContent='Salvar alteração'; $('#btnCancelEdit').hidden=false; $('#inTitle').focus(); return;
  }
  if (b.dataset.act === 'vis') l.visible = !l.visible;
  if (b.dataset.act === 'del') { if (!confirm(`Excluir "${l.title}"?`)) return; state.links = state.links.filter(x => x.id !== id); }
  save(); renderLinkList();
};
(() => { // arrastar (toque e mouse)
  const list = $('#linkList'); let drag = null;
  list.addEventListener('pointerdown', e => { const h = e.target.closest('.drag'); if (!h) return; drag = h.closest('li'); drag.classList.add('dragging'); h.setPointerCapture(e.pointerId); });
  list.addEventListener('pointermove', e => {
    if (!drag) return; e.preventDefault();
    const after = [...list.querySelectorAll('li:not(.dragging)')].find(li => { const r = li.getBoundingClientRect(); return e.clientY < r.top + r.height/2; });
    after ? list.insertBefore(drag, after) : list.appendChild(drag);
  });
  const end = () => { if (!drag) return; drag.classList.remove('dragging'); drag = null;
    const order = [...list.querySelectorAll('li')].map(li => li.dataset.id);
    state.links.sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id)); save(); };
  list.addEventListener('pointerup', end); list.addEventListener('pointercancel', end);
})();

// Tema
$('#themeGrid').onclick = e => { const b = e.target.closest('[data-theme]'); if (!b) return; state.theme = b.dataset.theme; save(); renderThemes(); };
$('#inBtnStyle').onchange = e => { state.btnStyle = e.target.value; save(); };

// Conta
$('#btnExport').onclick = () => {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([JSON.stringify(pageData(),null,2)],{type:'application/json'})), download: `${mySlug}.json` });
  a.click(); URL.revokeObjectURL(a.href);
};
$('#inImport').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try { const d = JSON.parse(await f.text()); state = { ...DEFAULT(), ...d }; delete state.uid; delete state.slug; save(); fillForms(); toast('✅ Backup importado'); }
  catch { toast('❌ Arquivo inválido'); }
  e.target.value = '';
};
const logout = async () => { closePanel(); await signOut(auth); };
$('#btnLogout').onclick = logout; $('#btnLogout2').onclick = logout;
$('#btnDelete').onclick = async () => {
  if (prompt(`Digite "${mySlug}" para excluir sua página definitivamente:`) !== mySlug) return;
  try { await deleteDoc(doc(db,'pages',mySlug)); await deleteDoc(doc(db,'users',user.uid)); mySlug = null; closePanel(); toast('Página excluída'); show('#screenClaim'); }
  catch { toast('Erro ao excluir'); }
};

// Compartilhar
$('#btnShare').onclick = async () => {
  const url = PUBLIC_MODE ? location.href : `${BASE_URL}/${mySlug}`;
  if (navigator.share) { try { await navigator.share({ title: state.name, url }); } catch {} }
  else { await navigator.clipboard.writeText(url); toast('🔗 Link copiado!'); }
};

/* ---------- start ---------- */
PUBLIC_MODE ? loadPublic() : loadEditor();
