/* Tudo que a Bruna pode querer trocar fica aqui. */
window.CONFIG = {
  nome: 'Bruna Cavallaro',
  whatsapp: '5512988980863', // (12) 98898-0863, da bio do Instagram
  instagram: 'nutribrunacavallaro',
  crn: '', // ex.: 'CRN-3 00000'. Enquanto vazio, o site mostra "CRN {{PREENCHER}}"
  cidade: 'São José dos Campos · SP',
  endereco: '', // ex.: 'Rua ..., 123 · Jardim Aquarius'. Vazio = linha escondida
  mensagem: 'Olá, Bruna! Vi seu site e quero agendar uma consulta.'
};

window.linkWA = function (msg) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg || CONFIG.mensagem);
};
