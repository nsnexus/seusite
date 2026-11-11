/* Temas e ícones */
export const THEMES = {
  noite:   { nome:'Noite',    bg1:'#0f172a', bg2:'#1e293b', accent:'#22d3ee', accent2:'#a78bfa', text:'#f8fafc', muted:'#cbd5e1' },
  vale:    { nome:'Verde & Ouro', bg1:'#003d3b', bg2:'#007E7A', accent:'#ECB11F', accent2:'#00b3ad', text:'#ffffff', muted:'#d7f1ef' },
  sunset:  { nome:'Pôr do sol', bg1:'#ff7e5f', bg2:'#6a3093', accent:'#ffd166', accent2:'#ef476f', text:'#ffffff', muted:'#ffe8dc' },
  oceano:  { nome:'Oceano',   bg1:'#0f2027', bg2:'#2c5364', accent:'#00f5d4', accent2:'#00bbf9', text:'#ffffff', muted:'#cfe8ef' },
  rosa:    { nome:'Rosa',     bg1:'#ff9a9e', bg2:'#a18cd1', accent:'#ffffff', accent2:'#ff6fb5', text:'#ffffff', muted:'#fff0f5' },
  neon:    { nome:'Neon',     bg1:'#050505', bg2:'#111111', accent:'#39ff14', accent2:'#00e5ff', text:'#ffffff', muted:'#bdbdbd' },
  claro:   { nome:'Claro',    bg1:'#f8fafc', bg2:'#e2e8f0', accent:'#6366f1', accent2:'#ec4899', text:'#0f172a', muted:'#475569' },
  floresta:{ nome:'Floresta', bg1:'#134e5e', bg2:'#71b280', accent:'#fef08a', accent2:'#bbf7d0', text:'#ffffff', muted:'#ecfdf5' },
  roxo:    { nome:'Galáxia',  bg1:'#1a002e', bg2:'#4a148c', accent:'#e040fb', accent2:'#7c4dff', text:'#ffffff', muted:'#e1bee7' },
};

export const SOCIAL_ICONS = {
  instagram:'<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.2c-.1-1.6-.4-3-1.6-4.2S17.7 1.4 16.1 1.3C14.4 1.2 9.6 1.2 7.9 1.3 6.3 1.4 4.9 1.7 3.7 2.9S2.1 5.6 2 7.2c-.1 1.7-.1 6.5 0 8.2.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.5.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.5 0-8.2zm-2.2 10.6a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.8.4s-4.5.1-5.8-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.8s-.1-4.5.4-5.8a3.3 3.3 0 0 1 1.9-1.9c1.3-.5 4.4-.4 5.8-.4s4.5-.1 5.8.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.8s.1 4.5-.4 5.8z"/></svg>',
  whatsapp:'<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.9L.2 24l6.3-1.6A11.8 11.8 0 0 0 23.8 12a11.7 11.7 0 0 0-3.4-8.4z"/></svg>',
  tiktok:'<svg viewBox="0 0 24 24"><path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2V2h-3.4v13.7a2.9 2.9 0 1 1-2-2.8V9.4a6.3 6.3 0 1 0 5.4 6.3V8.7a8.2 8.2 0 0 0 4.8 1.5V6.8z"/></svg>',
  youtube:'<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/></svg>',
  linkedin:'<svg viewBox="0 0 24 24"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zm1.8 13.1H3.6V9h3.6zM22.2 0H1.8A1.7 1.7 0 0 0 0 1.7v20.6A1.7 1.7 0 0 0 1.8 24h20.4a1.8 1.8 0 0 0 1.8-1.7V1.7A1.8 1.8 0 0 0 22.2 0z"/></svg>',
  email:'<svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/></svg>',
};

