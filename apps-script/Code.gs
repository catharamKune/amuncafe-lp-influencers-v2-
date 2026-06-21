/**
 * AMUN Café — Recetor do Formulário de Influencers
 * ------------------------------------------------------------------
 * Versão revista (a partir do teu script) com 3 melhorias importantes:
 *   1) Escreve na ABA CERTA da planilha (a do teu link, gid 514390863),
 *      em vez de getActiveSheet() que escreve sempre na 1ª aba.
 *   2) Cria automaticamente a linha de CABEÇALHOS na primeira submissão.
 *   3) LockService para evitar colisões se 2 pessoas enviarem ao mesmo tempo.
 * Mantém a tua notificação por email.
 *
 * Publicar: Implementar → Nova implementação → "App da Web"
 *   - Executar como: Eu
 *   - Quem tem acesso: Qualquer pessoa
 *   - Copiar o URL /exec e colar em GOOGLE_SCRIPT_URL no index.html
 * ------------------------------------------------------------------
 */

var SPREADSHEET_ID = '1gHdvo516l0GzaD6lMRINq0-gBs-ISFdjsgXZzHiiGYM';
var SHEET_GID = 514390863;                 // a aba que está no teu link (#gid=...)
var NOTIFY_EMAIL = 'marketing@amuncafe.com, contato@galeriaoliveira.art';

// Ordem das colunas — IGUAL ao teu appendRow (language fica em último).
var FIELDS = [
  'submitted_at', 'name', 'email', 'phone', 'city',
  'instagram', 'tiktok', 'followers_ig', 'followers_tt', 'engagement', 'portfolio',
  'content_type', 'niche', 'example_collab', 'why_amun',
  'guests', 'preferred_date1', 'preferred_date2', 'preferred_time', 'dietary',
  'deliverable', 'delivery_days', 'share_raw', 'notes', 'how_found', 'language'
];

var HEADERS = [
  'Data/Hora', 'Nome', 'Email', 'Telemóvel', 'Cidade',
  'Instagram', 'TikTok', 'Seguidores IG', 'Seguidores TT', 'Engajamento (%)', 'Portfólio',
  'Tipo de conteúdo', 'Nicho', 'Exemplo colaboração', 'Motivação',
  'Nº pessoas', 'Data preferida', 'Data alternativa', 'Horário', 'Restrições alimentares',
  'Entregáveis', 'Prazo de entrega', 'Partilha material original', 'Notas', 'Como conheceu', 'Idioma'
];

function getTargetSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === SHEET_GID) return sheets[i];
  }
  return sheets[0]; // fallback: primeira aba
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = getTargetSheet(ss);
    var data = (e && e.parameter) ? e.parameter : {};

    // Cabeçalhos na primeira utilização.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(FIELDS.map(function (key) {
      return data[key] !== undefined ? data[key] : '';
    }));

    // Notificação por email (opcional).
    try {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        '✨ Nova candidatura — AMUN Café',
        'Nova candidatura recebida de ' + (data.name || '') + ' (' + (data.email || '') + ').\n\n' +
        'Instagram: ' + (data.instagram || '') + '\n' +
        'Seguidores IG: ' + (data.followers_ig || '') + '\n\n' +
        'Mensagem:\n' + (data.why_amun || '')
      );
    } catch (mailErr) {
      // Se o email falhar, a candidatura já ficou guardada na planilha.
    }

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

// GET simples para testar se a app está no ar.
function doGet() {
  return ContentService.createTextOutput('AMUN Café — recetor ativo');
}
