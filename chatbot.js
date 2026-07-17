// ── Uplyncio Max Chatbot — Premium Design ──
(function() {
  var MESSAGES = [];
  var IS_OPEN = false;
  var IS_TYPING = false;
  var HISTORY_LOADED = false;

  function getCurrentUserId() {
    try { return localStorage.getItem('uplyncio_currentUid') || null; } catch(e) { return null; }
  }

  function loadHistoryFromSupabase() {
    var uid = getCurrentUserId();
    if (!uid || HISTORY_LOADED) return;
    HISTORY_LOADED = true;
    fetch('/api/chatbot?user_id=' + encodeURIComponent(uid))
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
          MESSAGES = res.messages;
          var msgs = document.getElementById('ace-msgs');
          if (msgs) {
            msgs.innerHTML = '';
            MESSAGES.forEach(function(m) {
              if (m.role === 'user') appendMsg('user', m.content, '');
              else if (m.role === 'assistant') appendMsg('bot', m.content, '');
            });
          }
        }
      }).catch(function() {});
  }

  var STYLE = `
    #ace-btn{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border:none;cursor:pointer;z-index:99998;box-shadow:0 6px 24px rgba(59,130,246,.5);display:flex;align-items:center;justify-content:center;transition:all .25s;font-size:26px}
    #ace-btn:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(59,130,246,.6)}
    #ace-badge{position:absolute;top:-2px;right:-2px;background:#ef4444;color:#fff;font-size:9px;font-weight:800;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;font-family:Arial,sans-serif}
    #ace-box{position:fixed;bottom:96px;right:24px;width:380px;max-height:min(480px, calc(100vh - 120px));height:480px;background:#fff;border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.2),0 0 0 1px rgba(0,0,0,.05);z-index:99999;display:none;flex-direction:column;overflow:hidden;font-family:'Plus Jakarta Sans',Arial,sans-serif}
    #ace-box.open{display:flex;animation:aceUp .3s cubic-bezier(.34,1.56,.64,1)}
    @keyframes aceUp{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}

    /* Header */
    #ace-head{background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:16px 18px;display:flex;align-items:center;gap:12px;position:relative}
    #ace-av{width:42px;height:42px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.15)}
    #ace-av img,#ace-av svg{width:26px;height:26px}
    #ace-info{flex:1}
    #ace-info h4{color:#fff;font-size:15px;font-weight:700;margin:0 0 2px;font-family:Manrope,sans-serif}
    #ace-info p{color:rgba(255,255,255,.7);font-size:11.5px;margin:0;display:flex;align-items:center;gap:5px}
    #ace-info .dot-on{width:6px;height:6px;border-radius:50%;background:#4ade80;flex-shrink:0;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    .ace-hbtn{background:rgba(255,255,255,.15);border:none;color:#fff;cursor:pointer;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .2s}
    .ace-hbtn:hover{background:rgba(255,255,255,.25)}

    /* Messages */
    #ace-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;background:#f0f4fa}
    #ace-msgs::-webkit-scrollbar{width:4px}
    #ace-msgs::-webkit-scrollbar-thumb{background:#c7d2e0;border-radius:4px}
    .ace-row{display:flex;gap:8px;align-items:flex-end;max-width:88%}
    .ace-row.bot{align-self:flex-start}
    .ace-row.user{align-self:flex-end;flex-direction:row-reverse}
    .ace-av-sm{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#1d4ed8,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;color:#fff;font-weight:700;font-family:Manrope,sans-serif}
    .ace-bubble{padding:11px 14px;border-radius:16px;font-size:13.5px;line-height:1.6;word-break:break-word;position:relative}
    .bot .ace-bubble{background:#fff;color:#1a202c;border:1px solid #e5e9f0;border-bottom-left-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
    .user .ace-bubble{background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;border-bottom-right-radius:4px;box-shadow:0 2px 8px rgba(59,130,246,.3)}
    .ace-meta{display:flex;align-items:center;gap:8px;margin-top:4px;padding:0 2px}
    .bot .ace-meta{justify-content:flex-start}
    .user .ace-meta{justify-content:flex-end}
    .ace-time{font-size:10.5px;color:#94a3b8}
    .ace-actions{display:flex;gap:2px}
    .ace-abtn{background:none;border:1px solid #e2e8f0;border-radius:6px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;transition:all .15s;color:#94a3b8}
    .ace-abtn:hover{background:#eff6ff;border-color:#93c5fd;color:#3b82f6}
    .ace-abtn.liked{background:#dcfce7;border-color:#86efac;color:#16a34a}
    .ace-abtn.disliked{background:#fee2e2;border-color:#fca5a5;color:#ef4444}

    /* Typing */
    .ace-typing{display:flex;gap:4px;padding:11px 14px;background:#fff;border:1px solid #e5e9f0;border-radius:16px;border-bottom-left-radius:4px;width:fit-content}
    .ace-tdot{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:abounce 1.2s infinite}
    .ace-tdot:nth-child(2){animation-delay:.2s}
    .ace-tdot:nth-child(3){animation-delay:.4s}
    @keyframes abounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}

    /* Quick Replies */
    #ace-quick{padding:10px 14px;display:none;gap:7px;flex-wrap:wrap;border-top:1px solid #f0f2f5;background:#fff}
    .ace-qbtn{padding:7px 14px;background:#fff;border:1.5px solid #d1d9e6;color:#374151;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .15s}
    .ace-qbtn:hover{background:#eff6ff;border-color:#3b82f6;color:#3b82f6}

    /* Input */
    #ace-input-wrap{padding:12px 14px;border-top:1px solid #e8ecf1;display:flex;gap:8px;align-items:flex-end;background:#fff}
    #ace-input{flex:1;border:1.5px solid #e2e8f0;border-radius:24px;padding:10px 16px;font-size:13.5px;font-family:inherit;outline:none;resize:none;max-height:80px;overflow-y:auto;transition:border-color .2s;background:#f8faff;color:#1a202c}
    #ace-input:focus{border-color:#3b82f6;background:#fff}
    #ace-input::placeholder{color:#94a3b8}
    .ace-mic{width:36px;height:36px;border-radius:50%;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:18px;transition:color .2s}
    .ace-mic:hover{color:#3b82f6}
    #ace-send{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;flex-shrink:0;transition:all .2s;box-shadow:0 2px 8px rgba(59,130,246,.3)}
    #ace-send:hover{transform:scale(1.06);box-shadow:0 4px 14px rgba(59,130,246,.4)}
    #ace-send:disabled{opacity:.4;cursor:not-allowed;transform:none}
    @media(max-width:420px){#ace-box{width:calc(100vw - 16px);right:8px;bottom:90px;max-height:calc(100dvh - 120px);height:420px}}
  `;

  var QUICK_REPLIES = ['💰 Pricing', '📝 How to order', '🌐 Become Publisher', '👤 Talk to Human'];

  function init() {
    var s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);

    document.body.insertAdjacentHTML('beforeend', `
      <button id="ace-btn" onclick="aceToggle()" title="Chat with Max">
        <span id="ace-icon">💬</span>
        <span id="ace-badge" style="display:none">1</span>
      </button>
      <div id="ace-box">
        <div id="ace-head">
          <div id="ace-av">
            <svg width="26" height="26" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="14" fill="#0f1628"/>
              <rect x="8" y="22" width="22" height="16" rx="8" fill="none" stroke="#4f7cff" stroke-width="5"/>
              <rect x="34" y="22" width="22" height="16" rx="8" fill="none" stroke="#00d4aa" stroke-width="5"/>
              <rect x="31" y="26" width="6" height="8" fill="#0f1628"/>
            </svg>
          </div>
          <div id="ace-info">
            <h4>Max — AI Assistant</h4>
            <p><span class="dot-on"></span> Typically replies in seconds</p>
          </div>
          <button class="ace-hbtn" onclick="aceClearChat()" title="Clear chat">🗑</button>
          <button class="ace-hbtn" onclick="aceToggle()" title="Close">✕</button>
        </div>
        <div id="ace-msgs"></div>
        <div id="ace-quick"></div>
        <div id="ace-input-wrap">
          <textarea id="ace-input" placeholder="Type a message..." rows="1" onkeydown="aceKey(event)" oninput="aceResize(this)"></textarea>
          <button id="ace-send" onclick="aceSend()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    `);

    setTimeout(function() {
      if (!IS_OPEN && !localStorage.getItem('ace_welcomed')) {
        document.getElementById('ace-badge').style.display = 'flex';
        localStorage.setItem('ace_welcomed', '1');
      }
    }, 3000);
  }

  window.aceToggle = function() {
    IS_OPEN = !IS_OPEN;
    var box = document.getElementById('ace-box');
    var badge = document.getElementById('ace-badge');
    var btn = document.getElementById('ace-btn');
    if (IS_OPEN) {
      box.classList.add('open');
      if (badge) badge.style.display = 'none';
      btn.innerHTML = '<span style="font-size:22px">✕</span>';
      loadHistoryFromSupabase();
      if (MESSAGES.length === 0) {
        aceBotMsg("Hey there! 👋 I'm **Max**, your AI assistant at Uplyncio. How can I help you today?");
        renderQuickReplies(QUICK_REPLIES);
      }
      setTimeout(function() { document.getElementById('ace-input').focus(); }, 200);
    } else {
      box.classList.remove('open');
      btn.innerHTML = '<span id="ace-icon">💬</span>';
    }
  };

  window.aceClearChat = function() {
    if (!confirm('Clear your entire chat history with Max?')) return;
    MESSAGES = [];
    HISTORY_LOADED = false;
    var msgs = document.getElementById('ace-msgs');
    if (msgs) msgs.innerHTML = '';
    var uid = getCurrentUserId();
    if (uid) {
      fetch('/api/chatbot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_history', userId: uid, messages: [] })
      }).catch(function(){});
    }
    setTimeout(function() {
      aceBotMsg("Chat cleared! 🗑️ Starting fresh — what can I help you with?");
      renderQuickReplies(QUICK_REPLIES);
    }, 200);
  };

  window.aceKey = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); aceSend(); }
  };
  window.aceResize = function(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 80) + 'px';
  };
  window.aceSend = function() {
    var input = document.getElementById('ace-input');
    var text = input.value.trim();
    if (!text || IS_TYPING) return;
    input.value = '';
    input.style.height = 'auto';
    aceUserMsg(text);
    aceGetReply(text);
  };
  window.aceQuick = function(text) {
    aceUserMsg(text);
    aceGetReply(text);
    renderQuickReplies([]);
  };

  function aceUserMsg(text) {
    MESSAGES.push({ role: 'user', content: text });
    var t = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    appendMsg('user', text, t);
  }

  function aceBotMsg(text) {
    var t = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    appendMsg('bot', text, t);
    MESSAGES.push({ role: 'assistant', content: text });
  }

  var _msgId = 0;
  function appendMsg(role, text, time) {
    var msgs = document.getElementById('ace-msgs');
    _msgId++;
    var mid = 'ace-m-' + _msgId;
    var html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    var actions = '';
    if (role === 'bot') {
      actions = '<div class="ace-actions">'
        + '<button class="ace-abtn" onclick="aceFeedback(this,\'like\',\'' + mid + '\')" title="Helpful">👍</button>'
        + '<button class="ace-abtn" onclick="aceFeedback(this,\'dislike\',\'' + mid + '\')" title="Not helpful">👎</button>'
        + '</div>';
    }

    var av = role === 'bot'
      ? '<div class="ace-av-sm"><svg width="14" height="14" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fff"/><rect x="8" y="22" width="22" height="16" rx="8" fill="none" stroke="#3b82f6" stroke-width="5"/><rect x="34" y="22" width="22" height="16" rx="8" fill="none" stroke="#00d4aa" stroke-width="5"/></svg></div>'
      : '';

    var row = document.createElement('div');
    row.className = 'ace-row ' + role;
    row.innerHTML = av
      + '<div style="display:flex;flex-direction:column;gap:4px">'
        + '<div class="ace-bubble">' + html + '</div>'
        + '<div class="ace-meta">'
          + actions
          + '<span class="ace-time">' + time + '</span>'
        + '</div>'
      + '</div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  window.aceFeedback = function(btn, type, mid) {
    var parent = btn.parentElement;
    parent.querySelectorAll('.ace-abtn').forEach(function(b) { b.classList.remove('liked','disliked'); });
    btn.classList.add(type === 'like' ? 'liked' : 'disliked');
  };

  function showTyping() {
    var msgs = document.getElementById('ace-msgs');
    var row = document.createElement('div');
    row.id = 'ace-typing-ind';
    row.className = 'ace-row bot';
    row.innerHTML = '<div class="ace-av-sm"><svg width="14" height="14" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fff"/><rect x="8" y="22" width="22" height="16" rx="8" fill="none" stroke="#3b82f6" stroke-width="5"/><rect x="34" y="22" width="22" height="16" rx="8" fill="none" stroke="#00d4aa" stroke-width="5"/></svg></div>'
      + '<div class="ace-typing"><div class="ace-tdot"></div><div class="ace-tdot"></div><div class="ace-tdot"></div></div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function hideTyping() {
    var el = document.getElementById('ace-typing-ind');
    if (el) el.remove();
  }

  function renderQuickReplies(replies) {
    var qw = document.getElementById('ace-quick');
    if (!qw) return;
    qw.innerHTML = replies.map(function(r) {
      return '<button class="ace-qbtn" onclick="aceQuick(\'' + r.replace(/'/g, "\\'") + '\')">' + r + '</button>';
    }).join('');
    qw.style.display = replies.length ? 'flex' : 'none';
  }

  async function aceGetReply(text) {
    IS_TYPING = true;
    document.getElementById('ace-send').disabled = true;
    showTyping();

    if(text.toLowerCase().includes('human') || text.toLowerCase().includes('talk to') || text.toLowerCase().includes('agent') || text.toLowerCase().includes('support')){
      hideTyping(); IS_TYPING=false; document.getElementById('ace-send').disabled=false;
      aceHumanHandoff(); return;
    }
    var userType = 'visitor';
    try {
      var u = JSON.parse(localStorage.getItem('uplyncio_user') || 'null');
      if (u) userType = u.role || 'buyer';
    } catch(e) {}

    try {
      var r = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: MESSAGES.slice(-20),
          userType: userType,
          userId: getCurrentUserId()
        })
      });
      var data = await r.json();
      hideTyping();
      if (data.reply) {
        aceBotMsg(data.reply);
        var lw = text.toLowerCase();
        if (lw.includes('price') || lw.includes('cost')) {
          renderQuickReplies(['📝 How to order', '🌐 Become Publisher', '📞 Talk to human']);
        } else if (lw.includes('publisher')) {
          renderQuickReplies(['💰 Publisher pricing', '📝 How to sign up', '💬 Contact support']);
        } else {
          renderQuickReplies(['💰 Pricing', '📝 Place an order', '📞 Contact support']);
        }
      } else {
        aceBotMsg('Sorry, I couldn\'t get a response. Please email info@uplyncio.com for help.');
      }
    } catch(e) {
      hideTyping();
      aceBotMsg('I\'m having connection issues. Please email **info@uplyncio.com** and we\'ll help you within 24 hours! 🙏');
    }
    IS_TYPING = false;
    document.getElementById('ace-send').disabled = false;
  }


  window.aceHumanHandoff = function(){
    var msgs = document.getElementById('ace-msgs');
    var row = document.createElement('div');
    row.className = 'ace-row bot';
    row.innerHTML = '<div class="ace-av-sm"><svg width="14" height="14" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fff"/><rect x="8" y="22" width="22" height="16" rx="8" fill="none" stroke="#3b82f6" stroke-width="5"/><rect x="34" y="22" width="22" height="16" rx="8" fill="none" stroke="#00d4aa" stroke-width="5"/></svg></div>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'
    +'<div class="ace-bubble" style="padding:16px">'
    +'<div style="font-weight:700;color:#1a202c;margin-bottom:10px">👤 Connect with our team:</div>'
    +'<a href="https://wa.me/923000000000?text=Hi%20Uplyncio%20team%2C%20I%20need%20help%20with..." target="_blank" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#dcfce7;border:1px solid #86efac;border-radius:10px;text-decoration:none;color:#166534;font-weight:700;font-size:13px;margin-bottom:8px"><span style="font-size:18px">💬</span>WhatsApp — Instant Reply</a>'
    +'<a href="mailto:info@uplyncio.com?subject=Support Request" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;text-decoration:none;color:#1e40af;font-weight:700;font-size:13px;margin-bottom:8px"><span style="font-size:18px">✉️</span>Email — info@uplyncio.com</a>'
    +'<a href="https://uplyncio.com/contact.html" target="_blank" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#f5f3ff;border:1px solid #c4b5fd;border-radius:10px;text-decoration:none;color:#5b21b6;font-weight:700;font-size:13px"><span style="font-size:18px">📋</span>Contact Form</a>'
    +'</div>'
    +'<div class="ace-meta"><span class="ace-time">' + new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) + '</span></div>'
    +'</div>';
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    MESSAGES.push({role:'assistant',content:'Connect with team: WhatsApp, Email, or Contact Form'});
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
