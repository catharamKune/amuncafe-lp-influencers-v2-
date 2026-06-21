# AMUN Café — LP Influencers v2

Landing page de candidatura de criadores de conteúdo (influencers) para o AMUN Café.
Página única, autossuficiente, bilingue **PT / EN**, com design clean e envio das
respostas para uma planilha do Google Sheets.

Para usar em **TikTok / Instagram** (link na bio, anúncios, stories).

## Ficheiros

| Ficheiro | Função |
|----------|--------|
| `index.html` | A landing page completa (HTML + CSS + JS, tudo num só ficheiro). |
| `apps-script/Code.gs` | Script do Google Sheets que recebe e regista cada candidatura. |
| `serve.mjs` | Servidor local para pré-visualizar (`node serve.mjs` → http://localhost:3000). |

## 1. Ligar à planilha do Google Sheets (uma vez, ~2 min)

> O link "normal" da planilha **não** recebe dados. É preciso publicar um pequeno
> Apps Script a partir dela. Faz-se uma vez.

1. Abre a **planilha** onde queres receber as candidaturas.
2. Menu **Extensões → Apps Script**.
3. Apaga o código que estiver lá e **cola o conteúdo de `apps-script/Code.gs`**.
4. Clica em **Guardar** (ícone do disquete).
5. Clica em **Implementar → Nova implementação**.
6. Em "Selecionar tipo" escolhe **App da Web**.
7. Configura:
   - **Executar como:** Eu (a tua conta)
   - **Quem tem acesso:** Qualquer pessoa
8. Clica em **Implementar** e autoriza o acesso (segue os ecrãs do Google).
9. Copia o **URL da app da Web** (termina em `/exec`).

## 2. Ligar a página ao script

No `index.html`, no topo do `<script>`, substitui:

```js
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_EXEC_URL_HERE';
```

pelo URL `/exec` que copiaste:

```js
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
```

> Enquanto o URL não estiver configurado, o formulário continua a funcionar
> (mostra o ecrã de sucesso) mas **não grava** na planilha.

## 3. Testar

- Local: `node serve.mjs` e abre http://localhost:3000
- Preenche e envia uma candidatura de teste → confirma que aparece uma linha nova
  na planilha (os cabeçalhos são criados automaticamente na 1ª submissão).

## 4. Publicar

Sobe os ficheiros para o GitHub e publica como preferires
(ex.: Cloudflare Worker, tal como a versão anterior). O `index.html` é estático,
não precisa de build.

## Notas

- Idioma: alterna PT/EN no canto superior direito; conteúdo escrito em
  **português de Portugal**.
- Privacidade: o rodapé indica que os dados servem apenas para gestão da parceria.
- Campos obrigatórios validados no browser; campos opcionais estão assinalados.
