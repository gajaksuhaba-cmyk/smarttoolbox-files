
// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function filterTools(q){
  q=q.toLowerCase();
  document.querySelectorAll('.tool-card').forEach(c=>{
    const name=c.querySelector('.tool-name').textContent.toLowerCase();
    const desc=c.querySelector('.tool-desc').textContent.toLowerCase();
    c.style.display=(name.includes(q)||desc.includes(q))?'':'none';
  });
}

function filterCat(cat,btnEl){
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
  if(btnEl)btnEl.classList.add('active');
  document.querySelectorAll('.tool-card').forEach(c=>{
    c.style.display=(cat==='all'||c.dataset.cat===cat)?'':'none';
  });
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function openTool(id){
  const t=TOOLS[id];
  if(!t)return;
  document.getElementById('modalTitle').innerHTML=t.icon+' '+t.name;
  document.getElementById('modalBody').innerHTML=t.render();
  document.getElementById('modalOverlay').classList.add('open');
  if(t.init)t.init();
}
function closeModal(){document.getElementById('modalOverlay').classList.remove('open')}
function handleOverlayClick(e){if(e.target===document.getElementById('modalOverlay'))closeModal()}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

// ─── EVENT DELEGATION (Blogger-safe: no inline HTML attributes on static markup) ──
document.addEventListener('DOMContentLoaded',function(){
  // Global search box
  const searchBox=document.getElementById('globalSearch');
  if(searchBox)searchBox.addEventListener('input',function(){filterTools(this.value);});

  // Category filter buttons
  document.querySelectorAll('[data-cat-filter]').forEach(function(btn){
    btn.addEventListener('click',function(){
      filterCat(this.getAttribute('data-cat-filter'),this);
    });
  });

  // Tool cards (open modal)
  document.querySelectorAll('[data-open-tool]').forEach(function(card){
    card.addEventListener('click',function(e){
      e.preventDefault();
      openTool(this.getAttribute('data-open-tool'));
    });
  });

  // Modal close button
  document.querySelectorAll('[data-action="close-modal"]').forEach(function(btn){
    btn.addEventListener('click',closeModal);
  });

  // Modal overlay (click outside to close)
  const overlay=document.getElementById('modalOverlay');
  if(overlay)overlay.addEventListener('click',handleOverlayClick);

  // ─── PAGE NAVIGATION (Blogger strips external hrefs on save, so we set them via JS) ──
  var PAGES={
    'about':'https://smarttoolbox30.blogspot.com/p/about-us.html',
    'privacy':'https://smarttoolbox30.blogspot.com/p/privacy-policy.html',
    'contact':'https://smarttoolbox30.blogspot.com/p/contact-us.html',
    'disclaimer':'https://smarttoolbox30.blogspot.com/p/disclaimer.html',
    'blog':'https://smarttoolbox30.blogspot.com/'
  };
  document.querySelectorAll('[data-page]').forEach(function(link){
    var key=link.getAttribute('data-page');
    if(PAGES[key]){
      link.href=PAGES[key];
      link.target='_self';
    }
  });
});

// ─── COPY HELPER ─────────────────────────────────────────────────────────────
function copyText(id){
  const el=document.getElementById(id);
  if(!el)return;
  navigator.clipboard.writeText(el.textContent||el.value).then(()=>{
    const btn=el.parentElement.querySelector('.copy-btn')||el.nextElementSibling;
    if(btn){const orig=btn.textContent;btn.textContent='Copied!';setTimeout(()=>btn.textContent=orig,1500);}
  });
}

// ─── TOOL DEFINITIONS ────────────────────────────────────────────────────────
const TOOLS={

// IP ADDRESS
ipAddress:{name:'My IP Address',icon:'📍',render:()=>`
  <p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">Your public IP address as seen by the internet. Fetched in real time.</p>
  <div id="ipResult" class="result-box">Detecting your IP address…</div>
  <div id="ipDetails" style="margin-top:1rem"></div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="detectIP()">🔄 Refresh</button>
  </div>`,
  init:()=>detectIP()
},

// USER AGENT
userAgent:{name:'User Agent Detector',icon:'🤖',render:()=>{
  const ua=navigator.userAgent;
  const browser=ua.includes('Firefox')?'Firefox':ua.includes('Edg')?'Edge':ua.includes('Chrome')?'Chrome':ua.includes('Safari')?'Safari':'Unknown';
  const os=ua.includes('Windows')?'Windows':ua.includes('Mac')?'macOS':ua.includes('Linux')?'Linux':ua.includes('Android')?'Android':ua.includes('iOS')?'iOS':'Unknown';
  return`<div class="info-row"><span class="info-label">Browser</span><span class="info-val">${browser}</span></div>
  <div class="info-row"><span class="info-label">OS</span><span class="info-val">${os}</span></div>
  <div class="info-row"><span class="info-label">Language</span><span class="info-val">${navigator.language}</span></div>
  <div class="info-row"><span class="info-label">Cookies Enabled</span><span class="info-val">${navigator.cookieEnabled?'✅ Yes':'❌ No'}</span></div>
  <div class="info-row"><span class="info-label">Do Not Track</span><span class="info-val">${navigator.doNotTrack==='1'?'Enabled':'Disabled'}</span></div>
  <div class="input-group mt-2"><label>Full User Agent String</label>
  <div class="copy-wrap"><div class="result-box" id="uaStr">${ua}</div><button class="copy-btn" onclick="copyText('uaStr')">Copy</button></div></div>`;
}},

// SCREEN SIZE
screenSize:{name:'Screen Size & Resolution',icon:'📐',render:()=>`
  <div class="info-row"><span class="info-label">Screen Width</span><span class="info-val">${screen.width}px</span></div>
  <div class="info-row"><span class="info-label">Screen Height</span><span class="info-val">${screen.height}px</span></div>
  <div class="info-row"><span class="info-label">Available Width</span><span class="info-val">${screen.availWidth}px</span></div>
  <div class="info-row"><span class="info-label">Available Height</span><span class="info-val">${screen.availHeight}px</span></div>
  <div class="info-row"><span class="info-label">Viewport Width</span><span class="info-val">${window.innerWidth}px</span></div>
  <div class="info-row"><span class="info-label">Viewport Height</span><span class="info-val">${window.innerHeight}px</span></div>
  <div class="info-row"><span class="info-label">Color Depth</span><span class="info-val">${screen.colorDepth}-bit</span></div>
  <div class="info-row"><span class="info-label">Pixel Ratio</span><span class="info-val">${window.devicePixelRatio}x</span></div>
  <div class="info-row"><span class="info-label">Orientation</span><span class="info-val">${screen.orientation?.type||'Unknown'}</span></div>`
},

// TIMEZONE
timezone:{name:'My Timezone',icon:'🕐',render:()=>{
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset=-(new Date().getTimezoneOffset());
  const now=new Date();
  return`<div class="info-row"><span class="info-label">Timezone</span><span class="info-val">${tz}</span></div>
  <div class="info-row"><span class="info-label">UTC Offset</span><span class="info-val">UTC${offset>=0?'+':''}${offset/60}</span></div>
  <div class="info-row"><span class="info-label">Local Time</span><span class="info-val" id="liveTime">${now.toLocaleTimeString()}</span></div>
  <div class="info-row"><span class="info-label">Local Date</span><span class="info-val">${now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span></div>
  <div class="info-row"><span class="info-label">DST Active</span><span class="info-val">${isDST(now)?'✅ Yes':'❌ No'}</span></div>`;},
  init:()=>{window._tzTimer=setInterval(()=>{const el=document.getElementById('liveTime');if(el)el.textContent=new Date().toLocaleTimeString();else clearInterval(window._tzTimer);},1000);}
},

// BROWSER INFO
browserInfo:{name:'Browser Information',icon:'🔍',render:()=>`
  <div class="info-row"><span class="info-label">JavaScript</span><span class="info-val text-green">✅ Enabled</span></div>
  <div class="info-row"><span class="info-label">Cookies</span><span class="info-val">${navigator.cookieEnabled?'✅ Enabled':'❌ Disabled'}</span></div>
  <div class="info-row"><span class="info-label">Online Status</span><span class="info-val">${navigator.onLine?'✅ Online':'❌ Offline'}</span></div>
  <div class="info-row"><span class="info-label">PDF Viewer</span><span class="info-val">${navigator.pdfViewerEnabled?'✅ Yes':'❌ No'}</span></div>
  <div class="info-row"><span class="info-label">Hardware Threads</span><span class="info-val">${navigator.hardwareConcurrency}</span></div>
  <div class="info-row"><span class="info-label">Max Touch Points</span><span class="info-val">${navigator.maxTouchPoints}</span></div>
  <div class="info-row"><span class="info-label">Memory (GB)</span><span class="info-val">${navigator.deviceMemory||'Unknown'}</span></div>
  <div class="info-row"><span class="info-label">WebGL Support</span><span class="info-val" id="webglStatus">Checking…</span></div>`,
  init:()=>{try{const c=document.createElement('canvas');const gl=c.getContext('webgl');document.getElementById('webglStatus').textContent=gl?'✅ Supported':'❌ Not supported';}catch(e){}}
},

// COOKIE TEST
cookieTest:{name:'Cookie Tester',icon:'🍪',render:()=>{
  const enabled=navigator.cookieEnabled;
  return`<div style="text-align:center;padding:2rem">
  <div style="font-size:4rem">${enabled?'✅':'❌'}</div>
  <h3 style="margin:.75rem 0;color:${enabled?'var(--green)':'var(--red)'}">${enabled?'Cookies are Enabled':'Cookies are Disabled'}</h3>
  <p style="color:var(--muted);font-size:.9rem">${enabled?'Your browser accepts cookies. Websites can store session data.':'Your browser has cookies disabled. This may affect site functionality.'}</p>
  </div>`;
}},

// WORD COUNTER
wordCounter:{name:'Word Counter',icon:'🔢',render:()=>`
  <div class="input-group">
    <label>Paste or type your text</label>
    <textarea id="wcText" placeholder="Start typing or paste text here…" oninput="updateWordCount()" style="min-height:160px"></textarea>
  </div>
  <div class="word-count-row">
    <div class="wc-item"><div class="wc-num" id="wcWords">0</div><div class="wc-lbl">Words</div></div>
    <div class="wc-item"><div class="wc-num" id="wcChars">0</div><div class="wc-lbl">Characters</div></div>
    <div class="wc-item"><div class="wc-num" id="wcCharsNs">0</div><div class="wc-lbl">Chars (no spaces)</div></div>
    <div class="wc-item"><div class="wc-num" id="wcSentences">0</div><div class="wc-lbl">Sentences</div></div>
    <div class="wc-item"><div class="wc-num" id="wcParagraphs">0</div><div class="wc-lbl">Paragraphs</div></div>
    <div class="wc-item"><div class="wc-num" id="wcRead">0 min</div><div class="wc-lbl">Reading Time</div></div>
  </div>
  <div class="btn-row mt-2">
    <button class="btn btn-secondary" onclick="document.getElementById('wcText').value='';updateWordCount()">Clear</button>
  </div>`
},

// CASE CONVERTER
caseConverter:{name:'Case Converter',icon:'🔠',render:()=>`
  <div class="input-group">
    <label>Input Text</label>
    <textarea id="ccInput" placeholder="Type your text here…" style="min-height:100px"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="caseConvert('upper')">UPPERCASE</button>
    <button class="btn btn-secondary" onclick="caseConvert('lower')">lowercase</button>
    <button class="btn btn-secondary" onclick="caseConvert('title')">Title Case</button>
    <button class="btn btn-secondary" onclick="caseConvert('sentence')">Sentence case</button>
    <button class="btn btn-secondary" onclick="caseConvert('camel')">camelCase</button>
    <button class="btn btn-secondary" onclick="caseConvert('snake')">snake_case</button>
    <button class="btn btn-secondary" onclick="caseConvert('kebab')">kebab-case</button>
  </div>
  <div class="input-group mt-2"><label>Result</label>
  <div class="copy-wrap"><div class="result-box" id="ccResult">Your converted text will appear here…</div><button class="copy-btn" onclick="copyText('ccResult')">Copy</button></div></div>`
},

// TEXT REVERSER
textReverse:{name:'Text Reverser',icon:'🔄',render:()=>`
  <div class="input-group"><label>Input Text</label>
    <textarea id="trInput" placeholder="Enter text to reverse…" style="min-height:100px"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="reverseText('chars')">Reverse Characters</button>
    <button class="btn btn-secondary" onclick="reverseText('words')">Reverse Words</button>
    <button class="btn btn-secondary" onclick="reverseText('lines')">Reverse Lines</button>
  </div>
  <div class="input-group mt-2"><label>Result</label>
  <div class="copy-wrap"><div class="result-box" id="trResult"></div><button class="copy-btn" onclick="copyText('trResult')">Copy</button></div></div>`
},

// TEXT DIFF
textDiff:{name:'Text Diff Checker',icon:'📊',render:()=>`
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    <div class="input-group"><label>Original Text</label>
      <textarea id="diffA" placeholder="Original text…" style="min-height:130px"></textarea>
    </div>
    <div class="input-group"><label>Modified Text</label>
      <textarea id="diffB" placeholder="Modified text…" style="min-height:130px"></textarea>
    </div>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="runDiff()">Compare Texts</button></div>
  <div id="diffResult" class="result-box mt-2" style="min-height:80px"></div>`
},

// LOREM IPSUM
loremIpsum:{name:'Lorem Ipsum Generator',icon:'📄',render:()=>`
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    <div class="input-group" style="flex:1;min-width:120px"><label>Amount</label>
      <input type="number" id="loremCount" value="3" min="1" max="20"/>
    </div>
    <div class="input-group" style="flex:1;min-width:140px"><label>Type</label>
      <select id="loremType">
        <option value="paragraphs">Paragraphs</option>
        <option value="sentences">Sentences</option>
        <option value="words">Words</option>
      </select>
    </div>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="genLorem()">Generate</button></div>
  <div class="copy-wrap mt-2"><div class="result-box" id="loremResult" style="min-height:100px"></div><button class="copy-btn" onclick="copyText('loremResult')">Copy</button></div>`
},

// DUPLICATE REMOVER
duplicateRemover:{name:'Duplicate Line Remover',icon:'🧹',render:()=>`
  <div class="input-group"><label>Input (one item per line)</label>
    <textarea id="dupInput" placeholder="Enter lines…" style="min-height:120px"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="removeDupes()">Remove Duplicates</button>
    <button class="btn btn-secondary" onclick="removeDupes(true)">Remove + Sort</button>
  </div>
  <div class="copy-wrap mt-2"><div class="result-box" id="dupResult" style="min-height:80px"></div><button class="copy-btn" onclick="copyText('dupResult')">Copy</button></div>`
},

// TEXT TO SLUG
textToSlug:{name:'Text to Slug',icon:'🔗',render:()=>`
  <div class="input-group"><label>Input Text</label>
    <input type="text" id="slugInput" placeholder="Your page title or text…" oninput="makeSlug()"/>
  </div>
  <div class="input-group"><label>URL Slug</label>
  <div class="copy-wrap"><div class="result-box" id="slugResult"></div><button class="copy-btn" onclick="copyText('slugResult')">Copy</button></div></div>`
},

// SORT LINES
sortLines:{name:'Line Sorter',icon:'📋',render:()=>`
  <div class="input-group"><label>Input (one item per line)</label>
    <textarea id="sortInput" placeholder="Enter lines to sort…" style="min-height:120px"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="sortLns('az')">A → Z</button>
    <button class="btn btn-secondary" onclick="sortLns('za')">Z → A</button>
    <button class="btn btn-secondary" onclick="sortLns('length')">By Length</button>
    <button class="btn btn-secondary" onclick="sortLns('random')">Shuffle</button>
  </div>
  <div class="copy-wrap mt-2"><div class="result-box" id="sortResult" style="min-height:80px"></div><button class="copy-btn" onclick="copyText('sortResult')">Copy</button></div>`
},

// JSON FORMATTER
jsonFormatter:{name:'JSON Formatter & Validator',icon:'{ }',render:()=>`
  <div class="input-group"><label>Paste JSON</label>
    <textarea id="jsonInput" placeholder='{"key":"value"}' style="min-height:140px;font-family:var(--mono);font-size:.82rem"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="formatJSON()">Beautify</button>
    <button class="btn btn-secondary" onclick="minifyJSON()">Minify</button>
    <button class="btn btn-secondary" onclick="validateJSON()">Validate</button>
  </div>
  <div class="copy-wrap mt-2"><div class="result-box" id="jsonResult" style="min-height:100px;font-size:.8rem"></div><button class="copy-btn" onclick="copyText('jsonResult')">Copy</button></div>`
},

// BASE64
base64:{name:'Base64 Encode / Decode',icon:'🔐',render:()=>`
  <div class="input-group"><label>Input Text</label>
    <textarea id="b64Input" placeholder="Enter text or Base64 string…" style="min-height:100px"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="doBase64('encode')">Encode → Base64</button>
    <button class="btn btn-secondary" onclick="doBase64('decode')">Decode ← Base64</button>
  </div>
  <div class="copy-wrap mt-2"><div class="result-box" id="b64Result" style="min-height:60px"></div><button class="copy-btn" onclick="copyText('b64Result')">Copy</button></div>`
},

// URL ENCODE
urlEncode:{name:'URL Encoder / Decoder',icon:'🌍',render:()=>`
  <div class="input-group"><label>Input</label>
    <textarea id="urlInput" placeholder="Enter URL or text…" style="min-height:80px"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="doURL('encode')">Encode</button>
    <button class="btn btn-secondary" onclick="doURL('decode')">Decode</button>
  </div>
  <div class="copy-wrap mt-2"><div class="result-box" id="urlResult"></div><button class="copy-btn" onclick="copyText('urlResult')">Copy</button></div>`
},

// HTML ENCODE
htmlEncode:{name:'HTML Entity Encoder',icon:'🏷️',render:()=>`
  <div class="input-group"><label>Input</label>
    <textarea id="htmlInput" placeholder="Enter text with special chars like < > & …" style="min-height:80px"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="doHTML('encode')">Encode to Entities</button>
    <button class="btn btn-secondary" onclick="doHTML('decode')">Decode Entities</button>
  </div>
  <div class="copy-wrap mt-2"><div class="result-box" id="htmlResult"></div><button class="copy-btn" onclick="copyText('htmlResult')">Copy</button></div>`
},

// CSS MINIFIER
cssMinifier:{name:'CSS Minifier',icon:'🎨',render:()=>`
  <div class="input-group"><label>CSS Code</label>
    <textarea id="cssInput" placeholder="Paste your CSS here…" style="min-height:160px;font-family:var(--mono);font-size:.8rem"></textarea>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="minifyCSS()">Minify CSS</button></div>
  <div id="cssSavings" style="margin:.5rem 0;font-size:.8rem;color:var(--muted)"></div>
  <div class="copy-wrap"><div class="result-box" id="cssResult" style="min-height:60px;font-size:.8rem"></div><button class="copy-btn" onclick="copyText('cssResult')">Copy</button></div>`
},

// REGEX TESTER
regexTester:{name:'Regex Tester',icon:'⚡',render:()=>`
  <div style="display:flex;gap:.5rem;margin-bottom:.75rem">
    <input type="text" id="regexPattern" placeholder="Regex pattern…" style="flex:1;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.6rem .9rem;color:var(--text);font-family:var(--mono);font-size:.88rem;outline:none"/>
    <input type="text" id="regexFlags" placeholder="flags" value="gi" style="width:70px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.6rem .7rem;color:var(--text);font-family:var(--mono);font-size:.88rem;outline:none;text-align:center"/>
    <button class="btn btn-primary" onclick="testRegex()">Test</button>
  </div>
  <div class="input-group"><label>Test String</label>
    <textarea id="regexInput" placeholder="Enter text to test against…" style="min-height:100px"></textarea>
  </div>
  <div class="result-box" id="regexResult" style="min-height:60px"></div>`
},

// COLOR PICKER
colorPicker:{name:'Color Picker & Converter',icon:'🎨',render:()=>`
  <div class="color-preview" id="colorPreview" style="background:#3b82f6"></div>
  <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1rem">
    <input type="color" id="colorInput" value="#3b82f6" oninput="updateColor(this.value)" style="width:60px;height:40px;border:none;background:none;cursor:pointer;border-radius:8px"/>
    <input type="text" id="hexInput" value="#3b82f6" placeholder="#hex" oninput="hexInputChange()" style="flex:1;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.5rem .8rem;color:var(--text);font-family:var(--mono);outline:none"/>
  </div>
  <div class="info-row"><span class="info-label">HEX</span><span class="info-val" id="outHex">#3b82f6</span></div>
  <div class="info-row"><span class="info-label">RGB</span><span class="info-val" id="outRgb">rgb(59,130,246)</span></div>
  <div class="info-row"><span class="info-label">HSL</span><span class="info-val" id="outHsl"></span></div>
  <div class="info-row"><span class="info-label">CSS Variable</span><span class="info-val" id="outVar">--color: #3b82f6</span></div>
  <div class="color-swatches" id="colorSwatches"></div>`,
  init:()=>{updateColor('#3b82f6');buildSwatches();}
},

// HASH GENERATOR
hashGenerator:{name:'Hash Generator',icon:'🔑',render:()=>`
  <div class="input-group"><label>Input Text</label>
    <textarea id="hashInput" placeholder="Enter text to hash…" style="min-height:80px"></textarea>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="generateHashes()">Generate Hashes</button></div>
  <div id="hashResults" class="mt-2"></div>`
},

// PASSWORD GENERATOR
passwordGenerator:{name:'Password Generator',icon:'🔑',render:()=>`
  <div class="input-group"><label>Password Length: <span id="pwLenVal">16</span></label>
    <div class="range-row"><input type="range" min="6" max="64" value="16" id="pwLen" oninput="updatePwLen()"/></div>
  </div>
  <div class="check-grid">
    <label class="check-item"><input type="checkbox" id="pwUpper" checked/>Uppercase (A-Z)</label>
    <label class="check-item"><input type="checkbox" id="pwLower" checked/>Lowercase (a-z)</label>
    <label class="check-item"><input type="checkbox" id="pwNumbers" checked/>Numbers (0-9)</label>
    <label class="check-item"><input type="checkbox" id="pwSymbols" checked/>Symbols (!@#$)</label>
    <label class="check-item"><input type="checkbox" id="pwNoAmbig"/>Exclude ambiguous</label>
  </div>
  <div class="btn-row mt-2"><button class="btn btn-primary" onclick="genPassword()">Generate Password</button></div>
  <div class="copy-wrap mt-2"><div class="result-box" id="pwResult" style="font-size:1.1rem;letter-spacing:.05em"></div><button class="copy-btn" onclick="copyText('pwResult')">Copy</button></div>
  <div id="pwStrength" class="mt-1"></div>`,
  init:()=>genPassword()
},

// PASSWORD STRENGTH
passwordStrength:{name:'Password Strength Checker',icon:'🛡️',render:()=>`
  <div class="input-group"><label>Enter Password</label>
    <input type="text" id="psInput" placeholder="Type a password to check…" oninput="checkPwStrength()"/>
  </div>
  <div id="psResult" class="mt-2"></div>`
},

// PRIVATE NOTE
privateNote:{name:'Private Note Encryptor',icon:'🔒',render:()=>`
  <div class="input-group"><label>Your Note</label>
    <textarea id="noteInput" placeholder="Enter your private note…" style="min-height:100px"></textarea>
  </div>
  <div class="input-group"><label>Passphrase</label>
    <input type="password" id="notePass" placeholder="Secret passphrase…"/>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="encryptNote()">🔒 Encrypt</button>
    <button class="btn btn-secondary" onclick="decryptNote()">🔓 Decrypt</button>
  </div>
  <div class="copy-wrap mt-2"><div class="result-box" id="noteResult" style="min-height:60px"></div><button class="copy-btn" onclick="copyText('noteResult')">Copy</button></div>`
},

// QR GENERATOR
qrGenerator:{name:'QR Code Generator',icon:'📱',render:()=>`
  <div class="input-group"><label>URL or Text</label>
    <input type="text" id="qrInput" placeholder="https://example.com or any text…" value="https://smarttoolbox30.blogspot.com"/>
  </div>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    <div class="input-group" style="flex:1"><label>Foreground Color</label>
      <input type="color" id="qrFg" value="#000000" style="width:100%;height:38px;border-radius:8px;border:1px solid var(--border);background:var(--card)"/>
    </div>
    <div class="input-group" style="flex:1"><label>Background Color</label>
      <input type="color" id="qrBg" value="#ffffff" style="width:100%;height:38px;border-radius:8px;border:1px solid var(--border);background:var(--card)"/>
    </div>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="generateQR()">Generate QR Code</button></div>
  <div class="qr-canvas-wrap"><canvas id="qr-canvas" width="200" height="200"></canvas></div>
  <div class="btn-row" style="justify-content:center;margin-top:.75rem">
    <button class="btn btn-green" onclick="downloadQR()">⬇ Download PNG</button>
  </div>`,
  init:()=>generateQR()
},

// UUID
uuidGenerator:{name:'UUID Generator',icon:'🆔',render:()=>`
  <div class="input-group"><label>Number of UUIDs</label>
    <input type="number" id="uuidCount" value="5" min="1" max="50"/>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="genUUIDs()">Generate UUIDs</button></div>
  <div class="copy-wrap mt-2"><div class="result-box" id="uuidResult" style="min-height:120px"></div><button class="copy-btn" onclick="copyText('uuidResult')">Copy All</button></div>`
},

// RANDOM NUMBER
randomNumber:{name:'Random Number Generator',icon:'🎲',render:()=>`
  <div style="display:flex;gap:1rem">
    <div class="input-group" style="flex:1"><label>Min</label><input type="number" id="rndMin" value="1"/></div>
    <div class="input-group" style="flex:1"><label>Max</label><input type="number" id="rndMax" value="100"/></div>
    <div class="input-group" style="flex:1"><label>Count</label><input type="number" id="rndCount" value="1" min="1" max="100"/></div>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="genRandom()">Generate</button></div>
  <div class="result-box" id="rndResult" style="font-size:2rem;font-weight:800;text-align:center;min-height:80px"></div>`
},

// META TAG GENERATOR
metaTagGenerator:{name:'Meta Tag Generator',icon:'🏷️',render:()=>`
  <div class="input-group"><label>Page Title</label><input type="text" id="mtTitle" placeholder="My Awesome Page"/></div>
  <div class="input-group"><label>Description (max 160 chars)</label><input type="text" id="mtDesc" placeholder="Brief page description…" maxlength="160"/></div>
  <div class="input-group"><label>Keywords (comma separated)</label><input type="text" id="mtKeywords" placeholder="tools, web, free, online"/></div>
  <div class="input-group"><label>Author</label><input type="text" id="mtAuthor" placeholder="Your Name"/></div>
  <div class="input-group"><label>Page URL (for canonical)</label><input type="text" id="mtUrl" placeholder="https://example.com/page"/></div>
  <div class="btn-row"><button class="btn btn-primary" onclick="genMetaTags()">Generate Meta Tags</button></div>
  <div class="copy-wrap mt-2"><div class="result-box" id="mtResult" style="font-size:.8rem;min-height:100px"></div><button class="copy-btn" onclick="copyText('mtResult')">Copy</button></div>`
},

// COLOR PALETTE
colorPaletteGen:{name:'Color Palette Generator',icon:'🌈',render:()=>`
  <div class="input-group"><label>Base Color</label>
    <input type="color" id="paletteBase" value="#3b82f6" oninput="genPalette()" style="width:80px;height:40px;border:none;background:none;cursor:pointer"/>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="genPalette()">Generate Palette</button>
    <button class="btn btn-secondary" onclick="randomPalette()">🎲 Random</button>
  </div>
  <div id="paletteResult" class="mt-2"></div>`,
  init:()=>genPalette()
},

// FAVICON GEN
faviconGen:{name:'Favicon Generator',icon:'🖼️',render:()=>`
  <div class="input-group"><label>Emoji or Character</label>
    <input type="text" id="favEmoji" value="🔧" maxlength="2" style="font-size:1.5rem;text-align:center"/>
  </div>
  <div class="input-group"><label>Background Color</label>
    <input type="color" id="favBg" value="#3b82f6"/>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="genFavicon()">Generate Favicon Code</button></div>
  <div class="copy-wrap mt-2"><div class="result-box" id="favResult" style="font-size:.8rem;min-height:60px"></div><button class="copy-btn" onclick="copyText('favResult')">Copy HTML</button></div>
  <canvas id="favCanvas" width="64" height="64" style="display:none"></canvas>`
},

// UNIT CONVERTER
unitConverter:{name:'Unit Converter',icon:'📏',render:()=>`
  <div class="input-group"><label>Category</label>
    <select id="unitCat" onchange="updateUnitOptions()">
      <option value="length">Length</option>
      <option value="weight">Weight / Mass</option>
      <option value="temp">Temperature</option>
      <option value="area">Area</option>
      <option value="speed">Speed</option>
      <option value="volume">Volume</option>
    </select>
  </div>
  <div style="display:flex;gap:1rem;align-items:flex-end;flex-wrap:wrap">
    <div class="input-group" style="flex:1"><label>From</label><select id="unitFrom"></select></div>
    <div class="input-group" style="flex:1"><label>Value</label><input type="number" id="unitValue" value="1" oninput="convertUnit()"/></div>
    <div class="input-group" style="flex:1"><label>To</label><select id="unitTo" onchange="convertUnit()"></select></div>
  </div>
  <div class="result-box" id="unitResult" style="font-size:1.3rem;font-weight:700;text-align:center"></div>`,
  init:()=>{updateUnitOptions();convertUnit();}
},

// NUMBER BASE
numberBase:{name:'Number Base Converter',icon:'🔢',render:()=>`
  <div class="input-group"><label>Input Number</label>
    <input type="text" id="nbInput" placeholder="Enter a number…" oninput="convertBase()"/>
  </div>
  <div class="input-group"><label>Input Base</label>
    <select id="nbFrom" onchange="convertBase()">
      <option value="2">Binary (2)</option>
      <option value="8">Octal (8)</option>
      <option value="10" selected>Decimal (10)</option>
      <option value="16">Hexadecimal (16)</option>
    </select>
  </div>
  <div class="info-row"><span class="info-label">Binary (2)</span><span class="info-val" id="nbBin">–</span></div>
  <div class="info-row"><span class="info-label">Octal (8)</span><span class="info-val" id="nbOct">–</span></div>
  <div class="info-row"><span class="info-label">Decimal (10)</span><span class="info-val" id="nbDec">–</span></div>
  <div class="info-row"><span class="info-label">Hexadecimal (16)</span><span class="info-val" id="nbHex">–</span></div>`
},

// TIMESTAMP
timestampConverter:{name:'Unix Timestamp Converter',icon:'⏱️',render:()=>`
  <div class="input-group"><label>Unix Timestamp → Date</label>
    <div style="display:flex;gap:.5rem"><input type="number" id="tsInput" placeholder="e.g. 1700000000" value="${Math.floor(Date.now()/1000)}"/><button class="btn btn-primary" onclick="tsToDate()">Convert</button></div>
  </div>
  <div class="result-box" id="tsResult" style="min-height:40px"></div>
  <div class="input-group mt-2"><label>Date → Unix Timestamp</label>
    <div style="display:flex;gap:.5rem"><input type="datetime-local" id="dtInput"/><button class="btn btn-secondary" onclick="dateToTs()">Convert</button></div>
  </div>
  <div class="result-box" id="dtResult" style="min-height:40px"></div>
  <div class="info-row mt-2"><span class="info-label">Current Timestamp</span><span class="info-val" id="currentTs">${Math.floor(Date.now()/1000)}</span></div>`,
  init:()=>{setInterval(()=>{const el=document.getElementById('currentTs');if(el)el.textContent=Math.floor(Date.now()/1000);},1000);}
},

// COLOR CONVERTER
colorConverter:{name:'Color Code Converter',icon:'🎨',render:()=>`
  <div class="input-group"><label>HEX Color</label>
    <div style="display:flex;gap:.5rem"><input type="text" id="ccHex" placeholder="#3b82f6"/><button class="btn btn-primary" onclick="convColor()">Convert</button></div>
  </div>
  <div id="ccResult" class="mt-2"></div>`
},

// AGE CALC
ageCalc:{name:'Age Calculator',icon:'🎂',render:()=>`
  <div class="input-group"><label>Your Date of Birth</label>
    <input type="date" id="ageInput"/>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="calcAge()">Calculate Age</button></div>
  <div id="ageResult" class="mt-2"></div>`
},

// PERCENTAGE CALC
percentageCalc:{name:'Percentage Calculator',icon:'%',render:()=>`
  <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem;margin-bottom:1rem">
    <div style="font-size:.8rem;color:var(--muted);margin-bottom:.5rem">What is X% of Y?</div>
    <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap">
      <input type="number" id="pct1" placeholder="%" style="width:80px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.5rem;color:var(--text);outline:none"/>
      <span style="color:var(--muted)">% of</span>
      <input type="number" id="pct2" placeholder="Number" style="width:100px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.5rem;color:var(--text);outline:none"/>
      <button class="btn btn-primary" onclick="calcPct1()">=</button>
      <span id="pctR1" style="font-size:1.2rem;font-weight:700;color:var(--accent)"></span>
    </div>
  </div>
  <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem;margin-bottom:1rem">
    <div style="font-size:.8rem;color:var(--muted);margin-bottom:.5rem">X is what % of Y?</div>
    <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap">
      <input type="number" id="pct3" placeholder="X" style="width:90px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.5rem;color:var(--text);outline:none"/>
      <span style="color:var(--muted)">is what % of</span>
      <input type="number" id="pct4" placeholder="Y" style="width:90px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.5rem;color:var(--text);outline:none"/>
      <button class="btn btn-primary" onclick="calcPct2()">=</button>
      <span id="pctR2" style="font-size:1.2rem;font-weight:700;color:var(--accent)"></span>
    </div>
  </div>
  <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem">
    <div style="font-size:.8rem;color:var(--muted);margin-bottom:.5rem">% change from X to Y</div>
    <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap">
      <input type="number" id="pct5" placeholder="From" style="width:90px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.5rem;color:var(--text);outline:none"/>
      <span style="color:var(--muted)">to</span>
      <input type="number" id="pct6" placeholder="To" style="width:90px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.5rem;color:var(--text);outline:none"/>
      <button class="btn btn-primary" onclick="calcPct3()">=</button>
      <span id="pctR3" style="font-size:1.2rem;font-weight:700;color:var(--accent)"></span>
    </div>
  </div>`
},

// SERP PREVIEW
metaPreview:{name:'Google SERP Preview',icon:'🔍',render:()=>`
  <div class="input-group"><label>Page Title (max 60 chars)</label>
    <input type="text" id="serpTitle" placeholder="My Awesome Web Page Title" maxlength="70" oninput="updateSERP()"/>
  </div>
  <div class="input-group"><label>URL</label>
    <input type="text" id="serpUrl" placeholder="https://yoursite.com/page" oninput="updateSERP()"/>
  </div>
  <div class="input-group"><label>Meta Description (max 160 chars)</label>
    <textarea id="serpDesc" placeholder="Brief description of your page…" maxlength="200" oninput="updateSERP()" style="min-height:70px"></textarea>
  </div>
  <div style="background:#fff;border-radius:12px;padding:1.25rem 1.5rem;margin-top:1rem">
    <div style="font-size:.75rem;color:#006621;margin-bottom:.2rem" id="serpUrlPrev">https://yoursite.com</div>
    <div style="font-size:1.1rem;color:#1a0dab;font-weight:400;margin-bottom:.2rem;font-family:Arial,sans-serif;cursor:pointer" id="serpTitlePrev">Page Title</div>
    <div style="font-size:.85rem;color:#545454;font-family:Arial,sans-serif;line-height:1.5" id="serpDescPrev">Meta description will appear here...</div>
  </div>
  <div id="serpHints" class="mt-2" style="font-size:.78rem"></div>`,
  init:()=>updateSERP()
},

// KEYWORD DENSITY
keywordDensity:{name:'Keyword Density Checker',icon:'📊',render:()=>`
  <div class="input-group"><label>Content</label>
    <textarea id="kdText" placeholder="Paste your article or page content…" style="min-height:140px"></textarea>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="analyzeKeywords()">Analyze Keywords</button></div>
  <div id="kdResult" class="mt-2"></div>`
},

// OPEN GRAPH
openGraphChecker:{name:'Open Graph Preview',icon:'📤',render:()=>`
  <div class="input-group"><label>Page Title</label><input type="text" id="ogTitle" placeholder="My Page Title" oninput="updateOG()"/></div>
  <div class="input-group"><label>Description</label><textarea id="ogDesc" placeholder="Description…" oninput="updateOG()" style="min-height:60px"></textarea></div>
  <div class="input-group"><label>Image URL</label><input type="text" id="ogImg" placeholder="https://example.com/image.jpg" oninput="updateOG()"/></div>
  <div style="background:#1c1e21;border-radius:12px;overflow:hidden;margin-top:1rem">
    <div id="ogImgPrev" style="background:#3a3b3c;height:140px;display:flex;align-items:center;justify-content:center;color:#999;font-size:.85rem">Image Preview</div>
    <div style="padding:1rem">
      <div style="font-size:.65rem;color:#8a8d91;text-transform:uppercase;margin-bottom:.2rem">EXAMPLE.COM</div>
      <div style="font-size:.95rem;font-weight:700;color:#e4e6eb;margin-bottom:.3rem" id="ogTitlePrev">Page Title</div>
      <div style="font-size:.82rem;color:#b0b3b8" id="ogDescPrev">Description...</div>
    </div>
  </div>`
},

// SLUG GENERATOR
slugGenerator:{name:'SEO Slug Generator',icon:'🔗',render:()=>`
  <div class="input-group"><label>Page Title</label>
    <input type="text" id="seoSlugInput" placeholder="How to Build a Better Website in 2024" oninput="genSEOSlug()"/>
  </div>
  <div class="input-group"><label>Generated Slug</label>
  <div class="copy-wrap"><div class="result-box" id="seoSlugResult"></div><button class="copy-btn" onclick="copyText('seoSlugResult')">Copy</button></div></div>
  <div id="seoSlugHints" style="font-size:.78rem;margin-top:.5rem"></div>`
},

// IMAGE TO BASE64
imageToBase64:{name:'Image to Base64',icon:'🔄',render:()=>`
  <div class="input-group"><label>Upload Image</label>
    <input type="file" id="imgB64File" accept="image/*" onchange="imgToBase64()" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.6rem;color:var(--text);width:100%"/>
  </div>
  <div id="imgB64Preview" style="margin:.75rem 0"></div>
  <div class="copy-wrap"><div class="result-box" id="imgB64Result" style="min-height:60px;font-size:.75rem;word-break:break-all"></div><button class="copy-btn" onclick="copyText('imgB64Result')">Copy</button></div>`
},

// COLOR EXTRACTOR
colorExtractor:{name:'Image Color Extractor',icon:'🎨',render:()=>`
  <div class="input-group"><label>Upload Image</label>
    <input type="file" id="colorExtFile" accept="image/*" onchange="extractColors()" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.6rem;color:var(--text);width:100%"/>
  </div>
  <canvas id="colorExtCanvas" style="display:none" width="200" height="200"></canvas>
  <div id="colorExtResult" class="mt-2"></div>`
},

// SVG VIEWER
svgViewer:{name:'SVG Viewer & Editor',icon:'◼',render:()=>`
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;height:320px">
    <div class="input-group" style="margin:0;display:flex;flex-direction:column">
      <label>SVG Code</label>
      <textarea id="svgInput" placeholder='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">&#10;  <circle cx="50" cy="50" r="40" fill="#3b82f6"/>&#10;</svg>' oninput="updateSVG()" style="flex:1;font-family:var(--mono);font-size:.75rem;resize:none;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.6rem;color:var(--text);outline:none"></textarea>
    </div>
    <div>
      <label style="display:block;font-size:.8rem;color:var(--muted);margin-bottom:.45rem">Preview</label>
      <div id="svgPreview" style="background:#fff;border-radius:8px;height:280px;display:flex;align-items:center;justify-content:center;overflow:hidden"></div>
    </div>
  </div>`
},

// STOPWATCH
stopwatch:{name:'Stopwatch & Timer',icon:'⏱️',render:()=>`
  <div style="text-align:center">
    <div class="timer-display" id="swDisplay">00:00.00</div>
    <div class="btn-row" style="justify-content:center">
      <button class="btn btn-primary" id="swStart" onclick="swToggle()">▶ Start</button>
      <button class="btn btn-secondary" onclick="swReset()">↺ Reset</button>
      <button class="btn btn-secondary" onclick="swLap()">◎ Lap</button>
    </div>
    <div id="swLaps" style="margin-top:1rem;max-height:150px;overflow-y:auto"></div>
  </div>
  <div style="margin-top:2rem;border-top:1px solid var(--border);padding-top:1.25rem">
    <div style="font-size:.85rem;font-weight:600;margin-bottom:.75rem">⏰ Countdown Timer</div>
    <div style="display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap">
      <input type="number" id="ctMin" placeholder="Min" min="0" max="99" style="width:70px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.5rem;color:var(--text);outline:none;text-align:center"/>
      <span style="line-height:2.2;color:var(--muted)">:</span>
      <input type="number" id="ctSec" placeholder="Sec" min="0" max="59" style="width:70px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.5rem;color:var(--text);outline:none;text-align:center"/>
      <button class="btn btn-primary" onclick="startCT()">Start Countdown</button>
    </div>
    <div class="timer-display" id="ctDisplay" style="font-size:2rem">00:00</div>
  </div>`
},

// NOTEPAD
notepad:{name:'Online Notepad',icon:'📓',render:()=>`
  <div class="input-group">
    <label>Your Notes <span style="color:var(--muted);font-size:.75rem">(auto-saved in browser)</span></label>
    <textarea id="notepadText" placeholder="Start writing your notes here…" style="min-height:280px" oninput="saveNote()"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-secondary" onclick="clearNote()">🗑 Clear</button>
    <button class="btn btn-green" onclick="downloadNote()">⬇ Download .txt</button>
    <span id="noteSaved" style="font-size:.78rem;color:var(--green);line-height:2.5"></span>
  </div>`,
  init:()=>{const s=localStorage.getItem('stb_note');if(s)document.getElementById('notepadText').value=s;}
},

// POMODORO
pomodoro:{name:'Pomodoro Timer',icon:'🍅',render:()=>`
  <div style="text-align:center">
    <div style="display:flex;gap:.5rem;justify-content:center;margin-bottom:1.5rem">
      <button class="btn btn-primary" id="pomWork" onclick="setPomoMode('work')">🍅 Work (25min)</button>
      <button class="btn btn-secondary" id="pomShort" onclick="setPomoMode('short')">☕ Short Break (5min)</button>
      <button class="btn btn-secondary" id="pomLong" onclick="setPomoMode('long')">🛌 Long Break (15min)</button>
    </div>
    <div class="timer-display" id="pomoDisplay" style="font-size:3.5rem">25:00</div>
    <div class="btn-row" style="justify-content:center">
      <button class="btn btn-primary" id="pomoStart" onclick="pomoToggle()">▶ Start</button>
      <button class="btn btn-secondary" onclick="pomoReset()">↺ Reset</button>
    </div>
    <div style="margin-top:1rem;color:var(--muted);font-size:.85rem" id="pomoSession">Session 1 of 4</div>
  </div>`
},

// READING TIME
readingTime:{name:'Reading Time Calculator',icon:'📖',render:()=>`
  <div class="input-group"><label>Paste Your Article</label>
    <textarea id="rtText" placeholder="Paste article content here…" style="min-height:160px" oninput="calcReadTime()"></textarea>
  </div>
  <div class="input-group"><label>Reading Speed (WPM)</label>
    <div class="range-row">
      <input type="range" min="100" max="400" value="200" id="rtWpm" oninput="document.getElementById('rtWpmVal').textContent=this.value;calcReadTime()"/>
      <span class="range-val" id="rtWpmVal">200</span> wpm
    </div>
  </div>
  <div id="rtResult" class="mt-2"></div>`
},

};// end TOOLS

// ─── TOOL LOGIC ──────────────────────────────────────────────────────────────

async function detectIP(){
  const el=document.getElementById('ipResult');
  if(!el)return;
  try{
    const r=await fetch('https://api.ipify.org?format=json');
    const d=await r.json();
    el.textContent=d.ip;
    const det=document.getElementById('ipDetails');
    if(det) det.innerHTML=`<div class="info-row"><span class="info-label">IPv4</span><span class="info-val">${d.ip}</span></div>
    <div class="info-row"><span class="info-label">Type</span><span class="info-val">Public IP</span></div>`;
  }catch(e){el.textContent='Could not detect IP. Check your connection.';el.classList.add('error');}
}

function isDST(d){
  const jan=new Date(d.getFullYear(),0,1).getTimezoneOffset();
  const jul=new Date(d.getFullYear(),6,1).getTimezoneOffset();
  return Math.min(jan,jul)!==d.getTimezoneOffset();
}

function updateWordCount(){
  const t=document.getElementById('wcText').value;
  const words=t.trim()?t.trim().split(/\s+/).length:0;
  document.getElementById('wcWords').textContent=words;
  document.getElementById('wcChars').textContent=t.length;
  document.getElementById('wcCharsNs').textContent=t.replace(/\s/g,'').length;
  document.getElementById('wcSentences').textContent=t.split(/[.!?]+/).filter(s=>s.trim()).length;
  document.getElementById('wcParagraphs').textContent=t.split(/\n\s*\n/).filter(p=>p.trim()).length||1;
  document.getElementById('wcRead').textContent=Math.ceil(words/200)+' min';
}

function caseConvert(type){
  const t=document.getElementById('ccInput').value;
  let r='';
  if(type==='upper')r=t.toUpperCase();
  else if(type==='lower')r=t.toLowerCase();
  else if(type==='title')r=t.replace(/\w\S*/g,w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase());
  else if(type==='sentence')r=t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g,m=>m.toUpperCase());
  else if(type==='camel')r=t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase());
  else if(type==='snake')r=t.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'');
  else if(type==='kebab')r=t.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  document.getElementById('ccResult').textContent=r;
}

function reverseText(mode){
  const t=document.getElementById('trInput').value;
  let r='';
  if(mode==='chars')r=[...t].reverse().join('');
  else if(mode==='words')r=t.split(/\s+/).reverse().join(' ');
  else if(mode==='lines')r=t.split('\n').reverse().join('\n');
  document.getElementById('trResult').textContent=r;
}

function runDiff(){
  const a=document.getElementById('diffA').value.split('\n');
  const b=document.getElementById('diffB').value.split('\n');
  let html='';
  const max=Math.max(a.length,b.length);
  let diffs=0;
  for(let i=0;i<max;i++){
    if(a[i]===b[i])html+=`<div style="font-size:.82rem;font-family:var(--mono);padding:.1rem 0;opacity:.6">&nbsp;${escHTML(a[i]||'')}</div>`;
    else{
      if(a[i]!==undefined)html+=`<div style="font-size:.82rem;font-family:var(--mono);background:rgba(239,68,68,.1);padding:.1rem .5rem;border-radius:3px;color:var(--red)">− ${escHTML(a[i])}</div>`;
      if(b[i]!==undefined)html+=`<div style="font-size:.82rem;font-family:var(--mono);background:rgba(16,185,129,.1);padding:.1rem .5rem;border-radius:3px;color:var(--green)">+ ${escHTML(b[i])}</div>`;
      diffs++;
    }
  }
  document.getElementById('diffResult').innerHTML=html||(diffs===0?'<span style="color:var(--green)">✅ Texts are identical</span>':'');
}
function escHTML(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

const LOREM_WORDS=['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat'];
function genLorem(){
  const count=parseInt(document.getElementById('loremCount').value)||3;
  const type=document.getElementById('loremType').value;
  let result='';
  if(type==='words'){result=Array.from({length:count},()=>LOREM_WORDS[Math.floor(Math.random()*LOREM_WORDS.length)]).join(' ');}
  else if(type==='sentences'){result=Array.from({length:count},()=>{const wc=8+Math.floor(Math.random()*10);return(Array.from({length:wc},()=>LOREM_WORDS[Math.floor(Math.random()*LOREM_WORDS.length)]).join(' '))+'.'}).join(' ');}
  else{result=Array.from({length:count},()=>{const sc=3+Math.floor(Math.random()*4);return Array.from({length:sc},()=>{const wc=8+Math.floor(Math.random()*10);return(Array.from({length:wc},()=>LOREM_WORDS[Math.floor(Math.random()*LOREM_WORDS.length)]).join(' '))+'. '}).join('')}).join('\n\n');}
  document.getElementById('loremResult').textContent=result;
}

function removeDupes(sort=false){
  const lines=document.getElementById('dupInput').value.split('\n');
  let unique=[...new Set(lines.filter(l=>l.trim()))];
  if(sort)unique.sort((a,b)=>a.localeCompare(b));
  document.getElementById('dupResult').textContent=unique.join('\n');
}

function makeSlug(){
  const v=document.getElementById('slugInput').value;
  const slug=v.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');
  document.getElementById('slugResult').textContent=slug;
}

function sortLns(mode){
  const lines=document.getElementById('sortInput').value.split('\n').filter(l=>l.trim());
  let sorted;
  if(mode==='az')sorted=[...lines].sort((a,b)=>a.localeCompare(b));
  else if(mode==='za')sorted=[...lines].sort((a,b)=>b.localeCompare(a));
  else if(mode==='length')sorted=[...lines].sort((a,b)=>a.length-b.length);
  else sorted=[...lines].sort(()=>Math.random()-.5);
  document.getElementById('sortResult').textContent=sorted.join('\n');
}

function formatJSON(){
  try{const j=JSON.parse(document.getElementById('jsonInput').value);document.getElementById('jsonResult').textContent=JSON.stringify(j,null,2);document.getElementById('jsonResult').className='result-box success';}
  catch(e){document.getElementById('jsonResult').textContent='❌ Invalid JSON: '+e.message;document.getElementById('jsonResult').className='result-box error';}
}
function minifyJSON(){
  try{const j=JSON.parse(document.getElementById('jsonInput').value);document.getElementById('jsonResult').textContent=JSON.stringify(j);document.getElementById('jsonResult').className='result-box success';}
  catch(e){document.getElementById('jsonResult').textContent='❌ Invalid JSON: '+e.message;document.getElementById('jsonResult').className='result-box error';}
}
function validateJSON(){
  try{JSON.parse(document.getElementById('jsonInput').value);document.getElementById('jsonResult').textContent='✅ Valid JSON!';document.getElementById('jsonResult').className='result-box success';}
  catch(e){document.getElementById('jsonResult').textContent='❌ '+e.message;document.getElementById('jsonResult').className='result-box error';}
}

function doBase64(mode){
  const v=document.getElementById('b64Input').value;
  try{document.getElementById('b64Result').textContent=mode==='encode'?btoa(unescape(encodeURIComponent(v))):decodeURIComponent(escape(atob(v)));}
  catch(e){document.getElementById('b64Result').textContent='❌ Error: '+e.message;document.getElementById('b64Result').className='result-box error';}
}

function doURL(mode){
  const v=document.getElementById('urlInput').value;
  try{document.getElementById('urlResult').textContent=mode==='encode'?encodeURIComponent(v):decodeURIComponent(v);}
  catch(e){document.getElementById('urlResult').textContent='❌ '+e.message;}
}

function doHTML(mode){
  const v=document.getElementById('htmlInput').value;
  const el=document.createElement('div');
  if(mode==='encode'){el.textContent=v;document.getElementById('htmlResult').textContent=el.innerHTML;}
  else{el.innerHTML=v;document.getElementById('htmlResult').textContent=el.textContent;}
}

function minifyCSS(){
  const css=document.getElementById('cssInput').value;
  const orig=css.length;
  const min=css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*{\s*/g,'{').replace(/\s*}\s*/g,'}').replace(/\s*:\s*/g,':').replace(/\s*;\s*/g,';').replace(/;\}/g,'}').trim();
  document.getElementById('cssResult').textContent=min;
  const saved=orig-min.length;
  document.getElementById('cssSavings').textContent=`Saved ${saved} bytes (${Math.round(saved/orig*100)}% reduction)`;
}

function testRegex(){
  const pat=document.getElementById('regexPattern').value;
  const flags=document.getElementById('regexFlags').value;
  const text=document.getElementById('regexInput').value;
  try{
    const re=new RegExp(pat,flags);
    const matches=[...text.matchAll(new RegExp(pat,flags.includes('g')?flags:flags+'g'))];
    document.getElementById('regexResult').innerHTML=matches.length
      ?`<span style="color:var(--green)">✅ ${matches.length} match(es) found</span>\n`+matches.map((m,i)=>`Match ${i+1}: "${m[0]}" at index ${m.index}`).join('\n')
      :'<span style="color:var(--red)">❌ No matches found</span>';
  }catch(e){document.getElementById('regexResult').textContent='❌ Invalid regex: '+e.message;}
}

function hexToRGB(hex){hex=hex.replace('#','');const r=parseInt(hex.substr(0,2),16),g=parseInt(hex.substr(2,2),16),b=parseInt(hex.substr(4,2),16);return{r,g,b};}
function rgbToHSL(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;if(max===min){h=s=0;}else{const d=max-min;s=l>.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}return{h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};}

function updateColor(hex){
  if(!/^#[0-9a-f]{6}$/i.test(hex))return;
  document.getElementById('colorPreview').style.background=hex;
  document.getElementById('colorInput').value=hex;
  document.getElementById('hexInput').value=hex;
  document.getElementById('outHex').textContent=hex.toUpperCase();
  const {r,g,b}=hexToRGB(hex);
  document.getElementById('outRgb').textContent=`rgb(${r}, ${g}, ${b})`;
  const {h,s,l}=rgbToHSL(r,g,b);
  document.getElementById('outHsl').textContent=`hsl(${h}, ${s}%, ${l}%)`;
  document.getElementById('outVar').textContent=`--color: ${hex.toUpperCase()};`;
}
function hexInputChange(){const v=document.getElementById('hexInput').value;if(/^#?[0-9a-f]{6}$/i.test(v))updateColor(v.startsWith('#')?v:'#'+v);}
function buildSwatches(){
  const colors=['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#f97316','#84cc16','#6366f1'];
  document.getElementById('colorSwatches').innerHTML=colors.map(c=>`<div class="swatch" style="background:${c}" onclick="updateColor('${c}')" title="${c}"></div>`).join('');
}

async function generateHashes(){
  const text=document.getElementById('hashInput').value;
  if(!text){document.getElementById('hashResults').innerHTML='<div class="result-box error">Please enter some text first</div>';return;}
  const enc=new TextEncoder();
  const data=enc.encode(text);
  const hashFn=async(alg)=>{const buf=await crypto.subtle.digest(alg,data);return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');};
  const [sha1,sha256,sha512]=await Promise.all([hashFn('SHA-1'),hashFn('SHA-256'),hashFn('SHA-512')]);
  document.getElementById('hashResults').innerHTML=`
    <div class="info-row"><span class="info-label">SHA-1</span></div>
    <div class="copy-wrap"><div class="result-box" id="h1" style="font-size:.75rem">${sha1}</div><button class="copy-btn" onclick="copyText('h1')">Copy</button></div>
    <div class="info-row mt-1"><span class="info-label">SHA-256</span></div>
    <div class="copy-wrap"><div class="result-box" id="h256" style="font-size:.75rem">${sha256}</div><button class="copy-btn" onclick="copyText('h256')">Copy</button></div>
    <div class="info-row mt-1"><span class="info-label">SHA-512</span></div>
    <div class="copy-wrap"><div class="result-box" id="h512" style="font-size:.72rem;word-break:break-all">${sha512}</div><button class="copy-btn" onclick="copyText('h512')">Copy</button></div>`;
}

function updatePwLen(){document.getElementById('pwLenVal').textContent=document.getElementById('pwLen').value;genPassword();}
function genPassword(){
  const len=parseInt(document.getElementById('pwLen').value);
  const upper=document.getElementById('pwUpper').checked;
  const lower=document.getElementById('pwLower').checked;
  const numbers=document.getElementById('pwNumbers').checked;
  const symbols=document.getElementById('pwSymbols').checked;
  const noAmbig=document.getElementById('pwNoAmbig').checked;
  let chars='';
  if(upper)chars+=noAmbig?'ABCDEFGHJKMNPQRSTUVWXYZ':'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if(lower)chars+=noAmbig?'abcdefghjkmnpqrstuvwxyz':'abcdefghijklmnopqrstuvwxyz';
  if(numbers)chars+=noAmbig?'23456789':'0123456789';
  if(symbols)chars+='!@#$%^&*()-_=+[]{}|;:,.<>?';
  if(!chars){document.getElementById('pwResult').textContent='Select at least one option';return;}
  const arr=new Uint32Array(len);crypto.getRandomValues(arr);
  const pw=Array.from(arr).map(n=>chars[n%chars.length]).join('');
  document.getElementById('pwResult').textContent=pw;
  showPwStrength(pw,document.getElementById('pwStrength'));
}
function showPwStrength(pw,el){
  if(!el)return;
  let score=0;
  if(pw.length>=8)score++;if(pw.length>=12)score++;if(pw.length>=16)score++;
  if(/[A-Z]/.test(pw))score++;if(/[a-z]/.test(pw))score++;
  if(/[0-9]/.test(pw))score++;if(/[^A-Za-z0-9]/.test(pw))score++;
  const labels=['Very Weak','Weak','Fair','Good','Strong','Very Strong'];
  const colors=['#ef4444','#f97316','#f59e0b','#84cc16','#10b981','#06b6d4'];
  const idx=Math.min(Math.floor(score/7*5),5);
  el.innerHTML=`<div style="display:flex;align-items:center;gap:.75rem;font-size:.82rem"><span style="color:${colors[idx]};font-weight:600">${labels[idx]}</span><div style="flex:1;background:var(--card);border-radius:4px;height:6px"><div style="width:${(idx+1)/6*100}%;background:${colors[idx]};height:100%;border-radius:4px;transition:width .3s"></div></div></div>`;
}
function checkPwStrength(){
  const pw=document.getElementById('psInput').value;
  const el=document.getElementById('psResult');
  if(!pw){el.innerHTML='';return;}
  showPwStrength(pw,el);
  const checks=[
    {label:'At least 8 characters',pass:pw.length>=8},
    {label:'At least 12 characters',pass:pw.length>=12},
    {label:'Uppercase letters',pass:/[A-Z]/.test(pw)},
    {label:'Lowercase letters',pass:/[a-z]/.test(pw)},
    {label:'Numbers',pass:/[0-9]/.test(pw)},
    {label:'Special characters',pass:/[^A-Za-z0-9]/.test(pw)},
  ];
  el.innerHTML+=checks.map(c=>`<div style="font-size:.8rem;display:flex;gap:.5rem;margin:.2rem 0"><span>${c.pass?'✅':'❌'}</span><span style="color:${c.pass?'var(--green)':'var(--muted)'}">${c.label}</span></div>`).join('');
}

function simpleEncrypt(text,key){
  let result='';
  for(let i=0;i<text.length;i++){result+=String.fromCharCode(text.charCodeAt(i)^key.charCodeAt(i%key.length));}
  return btoa(result);
}
function simpleDecrypt(enc,key){
  try{const text=atob(enc);let result='';for(let i=0;i<text.length;i++){result+=String.fromCharCode(text.charCodeAt(i)^key.charCodeAt(i%key.length));}return result;}
  catch{return null;}
}
function encryptNote(){
  const note=document.getElementById('noteInput').value;
  const pass=document.getElementById('notePass').value;
  if(!note||!pass){document.getElementById('noteResult').textContent='Please enter both note and passphrase';document.getElementById('noteResult').className='result-box error';return;}
  document.getElementById('noteResult').textContent='ENCRYPTED:'+simpleEncrypt(note,pass);
  document.getElementById('noteResult').className='result-box success';
}
function decryptNote(){
  const enc=document.getElementById('noteInput').value.replace('ENCRYPTED:','');
  const pass=document.getElementById('notePass').value;
  const dec=simpleDecrypt(enc,pass);
  if(dec===null){document.getElementById('noteResult').textContent='❌ Invalid encrypted text or wrong passphrase';document.getElementById('noteResult').className='result-box error';return;}
  document.getElementById('noteResult').textContent=dec;
  document.getElementById('noteResult').className='result-box success';
}

// QR CODE (canvas-based, no library needed - simple version)
function generateQR(){
  const text=document.getElementById('qrInput')?.value||'SmartToolBox30';
  const fg=document.getElementById('qrFg')?.value||'#000000';
  const bg=document.getElementById('qrBg')?.value||'#ffffff';
  const canvas=document.getElementById('qr-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  // Simple visual QR placeholder with actual text encoding reference
  ctx.fillStyle=bg;ctx.fillRect(0,0,200,200);
  // Draw finder patterns
  function drawFinder(x,y){ctx.fillStyle=fg;ctx.fillRect(x,y,49,49);ctx.fillStyle=bg;ctx.fillRect(x+7,y+7,35,35);ctx.fillStyle=fg;ctx.fillRect(x+14,y+14,21,21);}
  drawFinder(10,10);drawFinder(141,10);drawFinder(10,141);
  // Draw data dots based on text hash
  let hash=0;for(let i=0;i<text.length;i++)hash=(hash*31+text.charCodeAt(i))&0xffffffff;
  for(let r=0;r<15;r++){for(let c=0;c<15;c++){
    const px=60+c*5,py=60+r*5;
    if(((hash>>(r*15+c)%32)&1)||(r+c)%3===0){ctx.fillStyle=fg;ctx.fillRect(px,py,4,4);}
    else{ctx.fillStyle=bg;ctx.fillRect(px,py,4,4);}
  }}
  // Border quiet zone
  ctx.strokeStyle=fg;ctx.lineWidth=2;ctx.strokeRect(55,55,95,95);
}
function downloadQR(){
  const canvas=document.getElementById('qr-canvas');
  const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='qrcode-smarttoolbox.png';a.click();
}

function genUUIDs(){
  const count=Math.min(parseInt(document.getElementById('uuidCount').value)||5,50);
  const uuids=Array.from({length:count},()=>{
    return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16);});
  });
  document.getElementById('uuidResult').textContent=uuids.join('\n');
}

function genRandom(){
  const min=parseInt(document.getElementById('rndMin').value);
  const max=parseInt(document.getElementById('rndMax').value);
  const count=parseInt(document.getElementById('rndCount').value)||1;
  const nums=Array.from({length:count},()=>Math.floor(Math.random()*(max-min+1))+min);
  document.getElementById('rndResult').textContent=count===1?nums[0]:nums.join(', ');
}

function genMetaTags(){
  const title=document.getElementById('mtTitle').value;
  const desc=document.getElementById('mtDesc').value;
  const kw=document.getElementById('mtKeywords').value;
  const author=document.getElementById('mtAuthor').value;
  const url=document.getElementById('mtUrl').value;
  let tags=`<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
  if(title)tags+=`<title>${title}</title>\n<meta property="og:title" content="${title}">\n<meta name="twitter:title" content="${title}">\n`;
  if(desc)tags+=`<meta name="description" content="${desc}">\n<meta property="og:description" content="${desc}">\n<meta name="twitter:description" content="${desc}">\n`;
  if(kw)tags+=`<meta name="keywords" content="${kw}">\n`;
  if(author)tags+=`<meta name="author" content="${author}">\n`;
  if(url)tags+=`<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">\n`;
  tags+=`<meta name="robots" content="index, follow">\n<meta property="og:type" content="website">\n<meta name="twitter:card" content="summary_large_image">`;
  document.getElementById('mtResult').textContent=tags;
}

function genPalette(){
  const base=document.getElementById('paletteBase').value;
  const {r,g,b}=hexToRGB(base);
  const {h,s}=rgbToHSL(r,g,b);
  const shades=[10,20,30,40,50,60,70,80,90].map(l=>`hsl(${h},${s}%,${l}%)`);
  document.getElementById('paletteResult').innerHTML=`<div style="display:flex;gap:.4rem;flex-wrap:wrap">${shades.map((c,i)=>`<div style="text-align:center"><div style="width:60px;height:60px;border-radius:8px;background:${c};border:1px solid var(--border);cursor:pointer" title="${c}" onclick="navigator.clipboard.writeText('${c}')"></div><div style="font-size:.6rem;color:var(--muted);margin-top:.2rem">${i*10+10}%</div></div>`).join('')}</div><p style="font-size:.75rem;color:var(--muted);margin-top:.5rem">Click any swatch to copy its HSL value</p>`;
}
function randomPalette(){
  const h=Math.floor(Math.random()*360);
  document.getElementById('paletteBase').value=`#${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}`;
  genPalette();
}

function genFavicon(){
  const emoji=document.getElementById('favEmoji').value||'🔧';
  const bg=document.getElementById('favBg').value;
  const canvas=document.getElementById('favCanvas');
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=bg;ctx.fillRect(0,0,64,64);
  ctx.font='40px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(emoji,32,35);
  const dataUrl=canvas.toDataURL('image/png');
  document.getElementById('favResult').textContent=`<link rel="icon" href="${dataUrl}" type="image/png">\n<!-- or use emoji directly: -->\n<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>">`;
}

const UNITS={
  length:{units:['Meter','Kilometer','Mile','Foot','Inch','Yard','Centimeter','Millimeter'],toBase:{Meter:1,Kilometer:1000,Mile:1609.34,Foot:.3048,Inch:.0254,Yard:.9144,Centimeter:.01,Millimeter:.001}},
  weight:{units:['Kilogram','Gram','Pound','Ounce','Ton','Milligram'],toBase:{Kilogram:1,Gram:.001,Pound:.453592,Ounce:.0283495,Ton:1000,Milligram:.000001}},
  temp:{units:['Celsius','Fahrenheit','Kelvin'],special:true},
  area:{units:['Square Meter','Square Kilometer','Square Mile','Square Foot','Acre','Hectare'],toBase:{'Square Meter':1,'Square Kilometer':1e6,'Square Mile':2589988.11,'Square Foot':.092903,Acre:4046.86,Hectare:10000}},
  speed:{units:['Meter/Second','Kilometer/Hour','Miles/Hour','Knot','Foot/Second'],toBase:{'Meter/Second':1,'Kilometer/Hour':0.277778,'Miles/Hour':0.44704,Knot:0.514444,'Foot/Second':0.3048}},
  volume:{units:['Liter','Milliliter','Gallon (US)','Fluid Ounce','Cup','Pint','Quart','Cubic Meter'],toBase:{Liter:1,Milliliter:.001,'Gallon (US)':3.78541,'Fluid Ounce':.0295735,Cup:.236588,Pint:.473176,Quart:.946353,'Cubic Meter':1000}}
};
function updateUnitOptions(){
  const cat=document.getElementById('unitCat').value;
  const u=UNITS[cat].units;
  ['unitFrom','unitTo'].forEach((id,i)=>{document.getElementById(id).innerHTML=u.map((un,j)=>`<option ${j===(i?1:0)?'selected':''}>${un}</option>`).join('');});
  convertUnit();
}
function convertUnit(){
  const cat=document.getElementById('unitCat')?.value;const val=parseFloat(document.getElementById('unitValue')?.value)||0;
  const from=document.getElementById('unitFrom')?.value;const to=document.getElementById('unitTo')?.value;
  const el=document.getElementById('unitResult');if(!el)return;
  if(cat==='temp'){
    let c;
    if(from==='Celsius')c=val;else if(from==='Fahrenheit')c=(val-32)*5/9;else c=val-273.15;
    let r;
    if(to==='Celsius')r=c;else if(to==='Fahrenheit')r=c*9/5+32;else r=c+273.15;
    el.textContent=`${val} ${from} = ${r.toFixed(4)} ${to}`;
  }else{
    const u=UNITS[cat].toBase;
    const r=val*u[from]/u[to];
    el.textContent=`${val} ${from} = ${r.toLocaleString(undefined,{maximumFractionDigits:6})} ${to}`;
  }
}

function convertBase(){
  const v=document.getElementById('nbInput').value.trim();
  const base=parseInt(document.getElementById('nbFrom').value);
  if(!v){['Bin','Oct','Dec','Hex'].forEach(id=>document.getElementById('nb'+id).textContent='–');return;}
  try{
    const dec=parseInt(v,base);
    document.getElementById('nbBin').textContent=dec.toString(2);
    document.getElementById('nbOct').textContent=dec.toString(8);
    document.getElementById('nbDec').textContent=dec.toString(10);
    document.getElementById('nbHex').textContent=dec.toString(16).toUpperCase();
  }catch{['Bin','Oct','Dec','Hex'].forEach(id=>document.getElementById('nb'+id).textContent='Error');}
}

function tsToDate(){
  const ts=parseInt(document.getElementById('tsInput').value);
  if(isNaN(ts)){document.getElementById('tsResult').textContent='Invalid timestamp';return;}
  const d=new Date(ts*1000);
  document.getElementById('tsResult').textContent=d.toString()+'\nUTC: '+d.toUTCString()+'\nISO: '+d.toISOString();
}
function dateToTs(){
  const v=document.getElementById('dtInput').value;
  if(!v)return;
  document.getElementById('dtResult').textContent=Math.floor(new Date(v).getTime()/1000);
}

function convColor(){
  const hex=document.getElementById('ccHex').value;
  if(!/^#?[0-9a-f]{6}$/i.test(hex)){document.getElementById('ccResult').innerHTML='<div class="result-box error">Invalid hex color</div>';return;}
  const h=hex.startsWith('#')?hex:'#'+hex;
  const {r,g,b}=hexToRGB(h);
  const {h:hh,s,l}=rgbToHSL(r,g,b);
  const C=Math.min(r,g,b)/255;const M=1-Math.min(r,g,b)/255;const cmyk=`cmyk(${Math.round((1-r/255-C)/M*100||0)}%, ${Math.round((1-g/255-C)/M*100||0)}%, ${Math.round((1-b/255-C)/M*100||0)}%, ${Math.round(C*100)}%)`;
  document.getElementById('ccResult').innerHTML=`<div style="width:100%;height:60px;border-radius:8px;background:${h};border:1px solid var(--border);margin-bottom:.75rem"></div>
  <div class="info-row"><span class="info-label">HEX</span><span class="info-val">${h.toUpperCase()}</span></div>
  <div class="info-row"><span class="info-label">RGB</span><span class="info-val">rgb(${r}, ${g}, ${b})</span></div>
  <div class="info-row"><span class="info-label">HSL</span><span class="info-val">hsl(${hh}, ${s}%, ${l}%)</span></div>
  <div class="info-row"><span class="info-label">CMYK</span><span class="info-val">${cmyk}</span></div>`;
}

function calcAge(){
  const dob=new Date(document.getElementById('ageInput').value);
  if(!dob||isNaN(dob)){document.getElementById('ageResult').innerHTML='<div class="result-box error">Please enter a valid date</div>';return;}
  const now=new Date();
  let years=now.getFullYear()-dob.getFullYear();
  let months=now.getMonth()-dob.getMonth();
  let days=now.getDate()-dob.getDate();
  if(days<0){months--;days+=new Date(now.getFullYear(),now.getMonth(),0).getDate();}
  if(months<0){years--;months+=12;}
  const totalDays=Math.floor((now-dob)/(1000*60*60*24));
  document.getElementById('ageResult').innerHTML=`
    <div class="info-row"><span class="info-label">Age</span><span class="info-val">${years} years, ${months} months, ${days} days</span></div>
    <div class="info-row"><span class="info-label">Total Days</span><span class="info-val">${totalDays.toLocaleString()}</span></div>
    <div class="info-row"><span class="info-label">Total Weeks</span><span class="info-val">${Math.floor(totalDays/7).toLocaleString()}</span></div>
    <div class="info-row"><span class="info-label">Next Birthday</span><span class="info-val">${nextBday(dob)}</span></div>`;
}
function nextBday(dob){
  const now=new Date();let next=new Date(now.getFullYear(),dob.getMonth(),dob.getDate());
  if(next<=now)next.setFullYear(now.getFullYear()+1);
  const days=Math.floor((next-now)/(1000*60*60*24));
  return `In ${days} days (${next.toDateString()})`;
}

function calcPct1(){const a=parseFloat(document.getElementById('pct1').value),b=parseFloat(document.getElementById('pct2').value);document.getElementById('pctR1').textContent=(a/100*b).toFixed(4);}
function calcPct2(){const a=parseFloat(document.getElementById('pct3').value),b=parseFloat(document.getElementById('pct4').value);document.getElementById('pctR2').textContent=(a/b*100).toFixed(4)+'%';}
function calcPct3(){const a=parseFloat(document.getElementById('pct5').value),b=parseFloat(document.getElementById('pct6').value);const ch=(b-a)/a*100;document.getElementById('pctR3').textContent=(ch>0?'+':'')+ch.toFixed(4)+'%';}

function updateSERP(){
  const t=document.getElementById('serpTitle')?.value||'';
  const u=document.getElementById('serpUrl')?.value||'https://yoursite.com';
  const d=document.getElementById('serpDesc')?.value||'';
  const titleEl=document.getElementById('serpTitlePrev');const urlEl=document.getElementById('serpUrlPrev');const descEl=document.getElementById('serpDescPrev');
  if(titleEl)titleEl.textContent=t.length>60?t.slice(0,57)+'…':t;
  if(urlEl)urlEl.textContent=u;
  if(descEl)descEl.textContent=d.length>160?d.slice(0,157)+'…':d;
  const hints=document.getElementById('serpHints');
  if(hints){
    const msgs=[];
    if(t.length<50)msgs.push(`<span style="color:var(--orange)">⚠ Title too short (${t.length}/60 chars)</span>`);
    else if(t.length>60)msgs.push(`<span style="color:var(--red)">❌ Title too long (${t.length}/60 chars)</span>`);
    else msgs.push(`<span style="color:var(--green)">✅ Title length good (${t.length}/60)</span>`);
    if(d.length<120)msgs.push(`<span style="color:var(--orange)">⚠ Description too short (${d.length}/160 chars)</span>`);
    else if(d.length>160)msgs.push(`<span style="color:var(--red)">❌ Description too long (${d.length}/160 chars)</span>`);
    else msgs.push(`<span style="color:var(--green)">✅ Description length good (${d.length}/160)</span>`);
    hints.innerHTML=msgs.join('<br/>');
  }
}

function analyzeKeywords(){
  const text=document.getElementById('kdText').value.toLowerCase().replace(/[^a-z\s]/g,' ');
  const words=text.split(/\s+/).filter(w=>w.length>3);
  const freq={};words.forEach(w=>{freq[w]=(freq[w]||0)+1;});
  const sorted=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,15);
  const total=words.length;
  document.getElementById('kdResult').innerHTML=`<div style="font-size:.8rem;color:var(--muted);margin-bottom:.5rem">Top keywords (${total} total words analyzed):</div>`+sorted.map(([w,c])=>`<div class="info-row"><span class="info-label">${w}</span><span class="info-val">${c}x · ${(c/total*100).toFixed(2)}%</span></div>`).join('');
}

function updateOG(){
  const title=document.getElementById('ogTitle')?.value||'Page Title';
  const desc=document.getElementById('ogDesc')?.value||'Description...';
  const img=document.getElementById('ogImg')?.value;
  const tp=document.getElementById('ogTitlePrev');const dp=document.getElementById('ogDescPrev');const ip=document.getElementById('ogImgPrev');
  if(tp)tp.textContent=title;if(dp)dp.textContent=desc;
  if(ip&&img){ip.style.background='';ip.innerHTML=`<img src="${img}" style="width:100%;height:140px;object-fit:cover" onerror="this.parentElement.textContent='Image not found'">`;}
}

function genSEOSlug(){
  const v=document.getElementById('seoSlugInput').value;
  const slug=v.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');
  document.getElementById('seoSlugResult').textContent=slug;
  const hints=document.getElementById('seoSlugHints');
  const msgs=[];
  if(slug.length>60)msgs.push(`<span style="color:var(--red)">❌ Slug is ${slug.length} chars – keep under 60 for best SEO</span>`);
  else msgs.push(`<span style="color:var(--green)">✅ Slug length: ${slug.length} chars – good for SEO</span>`);
  if(slug.includes('--'))msgs.push('<span style="color:var(--orange)">⚠ Contains double hyphens</span>');
  if(hints)hints.innerHTML=msgs.join('<br/>');
}

function imgToBase64(){
  const file=document.getElementById('imgB64File').files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const b64=e.target.result;
    document.getElementById('imgB64Result').textContent=b64;
    document.getElementById('imgB64Preview').innerHTML=`<img src="${b64}" style="max-width:100%;max-height:150px;border-radius:8px;margin:.5rem 0"/>`;
  };
  reader.readAsDataURL(file);
}

function extractColors(){
  const file=document.getElementById('colorExtFile').files[0];
  if(!file)return;
  const img=new Image();
  img.onload=()=>{
    const canvas=document.getElementById('colorExtCanvas');
    const ctx=canvas.getContext('2d');
    ctx.drawImage(img,0,0,200,200);
    const d=ctx.getImageData(0,0,200,200).data;
    const colorMap={};
    for(let i=0;i<d.length;i+=16){
      const r=Math.round(d[i]/32)*32,g=Math.round(d[i+1]/32)*32,b=Math.round(d[i+2]/32)*32;
      const key=`rgb(${r},${g},${b})`;colorMap[key]=(colorMap[key]||0)+1;
    }
    const top=Object.entries(colorMap).sort((a,b)=>b[1]-a[1]).slice(0,10);
    document.getElementById('colorExtResult').innerHTML=`<div style="font-size:.82rem;font-weight:600;margin-bottom:.5rem">Dominant Colors:</div><div style="display:flex;gap:.5rem;flex-wrap:wrap">${top.map(([c])=>`<div style="text-align:center"><div style="width:50px;height:50px;border-radius:8px;background:${c};border:1px solid var(--border);cursor:pointer" onclick="navigator.clipboard.writeText('${c}')" title="Click to copy ${c}"></div><div style="font-size:.6rem;margin-top:.2rem;color:var(--muted)">${c}</div></div>`).join('')}</div><p style="font-size:.72rem;color:var(--muted);margin-top:.5rem">Click any color to copy</p>`;
  };
  img.src=URL.createObjectURL(file);
}

function updateSVG(){
  const code=document.getElementById('svgInput').value;
  document.getElementById('svgPreview').innerHTML=code;
}

// STOPWATCH
let swInterval=null,swMs=0,swRunning=false,swLapCount=0;
function swToggle(){
  if(swRunning){clearInterval(swInterval);swRunning=false;document.getElementById('swStart').textContent='▶ Resume';}
  else{const start=Date.now()-swMs;swInterval=setInterval(()=>{swMs=Date.now()-start;document.getElementById('swDisplay').textContent=fmtSW(swMs);},10);swRunning=true;document.getElementById('swStart').textContent='⏸ Pause';}
}
function swReset(){clearInterval(swInterval);swRunning=false;swMs=0;swLapCount=0;document.getElementById('swDisplay').textContent='00:00.00';document.getElementById('swStart').textContent='▶ Start';document.getElementById('swLaps').innerHTML='';}
function swLap(){if(!swRunning)return;swLapCount++;document.getElementById('swLaps').insertAdjacentHTML('afterbegin',`<div style="font-size:.78rem;font-family:var(--mono);color:var(--muted);padding:.15rem 0;border-bottom:1px solid var(--border)">Lap ${swLapCount}: ${fmtSW(swMs)}</div>`);}
function fmtSW(ms){const m=Math.floor(ms/60000),s=Math.floor((ms%60000)/1000),cs=Math.floor((ms%1000)/10);return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;}
// Countdown
let ctInterval=null;
function startCT(){
  clearInterval(ctInterval);
  let remaining=(parseInt(document.getElementById('ctMin').value)||0)*60+(parseInt(document.getElementById('ctSec').value)||0);
  if(!remaining)return;
  function tick(){remaining--;document.getElementById('ctDisplay').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;if(remaining<=0){clearInterval(ctInterval);document.getElementById('ctDisplay').textContent='00:00';document.title='⏰ Time is up! – SmartToolBox';}}
  ctInterval=setInterval(tick,1000);tick();
}

function saveNote(){
  try{localStorage.setItem('stb_note',document.getElementById('notepadText').value);}catch{}
  document.getElementById('noteSaved').textContent='✅ Saved';setTimeout(()=>{const e=document.getElementById('noteSaved');if(e)e.textContent='';},1500);
}
function clearNote(){document.getElementById('notepadText').value='';try{localStorage.removeItem('stb_note');}catch{}}
function downloadNote(){
  const text=document.getElementById('notepadText').value;
  const blob=new Blob([text],{type:'text/plain'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='notes-smarttoolbox.txt';a.click();
}

// POMODORO
let pomoMode='work',pomoRemaining=25*60,pomoRunning=false,pomoInterval=null,pomoSession=1;
const POMO_TIMES={work:25*60,short:5*60,long:15*60};
function setPomoMode(m){pomoMode=m;clearInterval(pomoInterval);pomoRunning=false;pomoRemaining=POMO_TIMES[m];document.getElementById('pomoStart').textContent='▶ Start';updatePomoDisplay();}
function pomoToggle(){
  if(pomoRunning){clearInterval(pomoInterval);pomoRunning=false;document.getElementById('pomoStart').textContent='▶ Resume';}
  else{pomoInterval=setInterval(()=>{pomoRemaining--;updatePomoDisplay();if(pomoRemaining<=0){clearInterval(pomoInterval);pomoRunning=false;document.getElementById('pomoStart').textContent='▶ Start';if(pomoMode==='work'){pomoSession++;document.getElementById('pomoSession').textContent=`Session ${pomoSession} of 4`;}}},1000);pomoRunning=true;document.getElementById('pomoStart').textContent='⏸ Pause';}
}
function pomoReset(){clearInterval(pomoInterval);pomoRunning=false;pomoRemaining=POMO_TIMES[pomoMode];document.getElementById('pomoStart').textContent='▶ Start';updatePomoDisplay();}
function updatePomoDisplay(){const m=Math.floor(pomoRemaining/60),s=pomoRemaining%60;const el=document.getElementById('pomoDisplay');if(el)el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}

function calcReadTime(){
  const text=document.getElementById('rtText').value;
  const wpm=parseInt(document.getElementById('rtWpm').value)||200;
  const words=text.trim()?text.trim().split(/\s+/).length:0;
  const mins=words/wpm;
  const el=document.getElementById('rtResult');
  if(!words){el.innerHTML='';return;}
  el.innerHTML=`<div class="info-row"><span class="info-label">Word Count</span><span class="info-val">${words.toLocaleString()}</span></div>
  <div class="info-row"><span class="info-label">Reading Time</span><span class="info-val">${mins<1?'< 1 min':Math.ceil(mins)+' min'} (at ${wpm} wpm)</span></div>
  <div class="info-row"><span class="info-label">Speaking Time</span><span class="info-val">${Math.ceil(words/130)} min (at 130 wpm)</span></div>
  <div class="info-row"><span class="info-label">Character Count</span><span class="info-val">${text.length.toLocaleString()}</span></div>`;
}

