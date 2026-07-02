// ── Uplyncio Chatbot Widget ──
(function() {
  var MESSAGES = [];
  var IS_OPEN = false;
  var IS_TYPING = false;
  var HISTORY_LOADED = false;

  function getCurrentUserId() {
    try {
      return localStorage.getItem('uplyncio_currentUid') || null;
    } catch(e) { return null; }
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
          var msgs = document.getElementById('uply-msgs');
          if (msgs) {
            msgs.innerHTML = '';
            MESSAGES.forEach(function(m) {
              var t = '';
              if (m.role === 'user') appendMsg('user', m.content, t);
              else if (m.role === 'assistant') appendMsg('bot', m.content, t);
            });
          }
        }
      }).catch(function() {});
  }

  var STYLE = `
    #uply-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#4f7cff,#00d4aa);border:none;cursor:pointer;z-index:99998;box-shadow:0 4px 20px rgba(79,124,255,.5);display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;font-size:24px}
    #uply-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(79,124,255,.6)}
    #uply-badge{position:absolute;top:-3px;right:-3px;background:#ef4444;color:#fff;font-size:9px;font-weight:800;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;font-family:Arial,sans-serif}
    #uply-box{position:fixed;bottom:92px;right:24px;width:360px;height:520px;background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.2);z-index:99999;display:none;flex-direction:column;overflow:hidden;font-family:'Plus Jakarta Sans',Arial,sans-serif;border:1px solid rgba(0,0,0,.08)}
    #uply-box.open{display:flex;animation:upfade .25s ease}
    @keyframes upfade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    #uply-head{background:linear-gradient(135deg,#0f1628,#1a2d5a);padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:2px solid #4f7cff}
    #uply-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f7cff,#00d4aa);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    #uply-title{flex:1}
    #uply-title h4{color:#fff;font-size:14px;font-weight:700;margin:0 0 1px}
    #uply-title p{color:#00d4aa;font-size:11px;margin:0;font-weight:600}
    #uply-close{background:rgba(255,255,255,.1);border:none;color:#fff;font-size:18px;cursor:pointer;width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center}
    #uply-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f8faff}
    #uply-msgs::-webkit-scrollbar{width:4px}
    #uply-msgs::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
    .uply-msg{max-width:82%;display:flex;flex-direction:column;gap:3px}
    .uply-msg.bot{align-self:flex-start}
    .uply-msg.user{align-self:flex-end}
    .uply-bubble{padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.55;word-break:break-word}
    .bot .uply-bubble{background:#fff;color:#1a202c;border:1px solid #e2e8f0;border-bottom-left-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
    .user .uply-bubble{background:linear-gradient(135deg,#4f7cff,#6366f1);color:#fff;border-bottom-right-radius:4px}
    .uply-time{font-size:10px;color:#94a3b8;padding:0 4px}
    .bot .uply-time{align-self:flex-start}
    .user .uply-time{align-self:flex-end}
    .uply-typing{display:flex;gap:4px;padding:10px 13px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;border-bottom-left-radius:4px;width:fit-content}
    .uply-dot{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:bounce 1.2s infinite}
    .uply-dot:nth-child(2){animation-delay:.2s}
    .uply-dot:nth-child(3){animation-delay:.4s}
    @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
    #uply-quick{padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid #f1f5f9;background:#fff}
    .uply-qbtn{padding:5px 10px;background:#f0f4ff;border:1px solid #c7d7ff;color:#4f7cff;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .15s}
    .uply-qbtn:hover{background:#4f7cff;color:#fff;border-color:#4f7cff}
    #uply-input-wrap{padding:10px 12px;border-top:1px solid #e2e8f0;display:flex;gap:8px;background:#fff}
    #uply-input{flex:1;border:1.5px solid #e2e8f0;border-radius:20px;padding:9px 14px;font-size:13px;font-family:inherit;outline:none;resize:none;max-height:80px;overflow-y:auto;transition:border-color .2s}
    #uply-input:focus{border-color:#4f7cff}
    #uply-send{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f7cff,#6366f1);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;flex-shrink:0;transition:opacity .2s;align-self:flex-end}
    #uply-send:disabled{opacity:.4;cursor:not-allowed}
    @media(max-width:420px){#uply-box{width:calc(100vw - 20px);right:10px;bottom:80px;height:480px}}
  `;

  var QUICK_REPLIES = ['💰 Pricing', '📝 How to order', '🌐 Become Publisher', '⭐ DA 50+ links', '💬 Contact support'];

  function init() {
    // Inject styles
    var s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);

    // Chatbot button
    document.body.insertAdjacentHTML('beforeend', `
      <button id="uply-btn" onclick="uplyToggle()" title="Chat with Ace AI">
        <span id="uply-icon">💬</span>
        <span id="uply-badge" style="display:none">1</span>
      </button>
      <div id="uply-box">
        <div id="uply-head">
          <div id="uply-avatar">🤖</div>
          <div id="uply-title">
            <h4>Ace — AI Assistant</h4>
            <p>● Online — Instant replies</p>
          </div>
          <button onclick="ulyClearChat()" title="Clear chat history" style="background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.6);font-size:13px;cursor:pointer;width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center" title="Clear history">🗑</button>
          <button id="uply-close" onclick="uplyToggle()">✕</button>
        </div>
        <div id="uply-msgs"></div>
        <div id="uply-quick"></div>
        <div id="uply-input-wrap">
          <textarea id="uply-input" placeholder="Ask Ace anything..." rows="1" onkeydown="uplyKey(event)" oninput="uplyResize(this)"></textarea>
          <button id="uply-send" onclick="ulySend()">➤</button>
        </div>
      </div>
    `);

    // Show welcome message after 3s
    setTimeout(function() {
      if (!IS_OPEN && !localStorage.getItem('ace_welcomed')) {
        document.getElementById('uply-badge').style.display = 'flex';
        localStorage.setItem('ace_welcomed', '1');
      }
    }, 3000);

    // Add welcome message when first opened - don't render quick replies at init
    // renderQuickReplies(QUICK_REPLIES); // removed - causes black bar on load
  }

  window.uplyToggle = function() {
    IS_OPEN = !IS_OPEN;
    var box = document.getElementById('uply-box');
    var badge = document.getElementById('uply-badge');
    if (IS_OPEN) {
      box.classList.add('open');
      badge.style.display = 'none';
      document.getElementById('uply-input').focus();
      if (MESSAGES.length === 0) {
        // Try loading from Supabase first
        loadHistoryFromSupabase();
        // Show welcome only after small delay (if no history found)
        setTimeout(function() {
          if (MESSAGES.length === 0) {
            uplyBotMsg("👋 Hi! I'm **Ace**, Uplyncio's AI assistant.\n\nI can help you with:\n• Guest posting pricing & orders\n• Becoming a publisher\n• Link building services\n• Any question about our platform\n\nWhat can I help you with today?");
          }
        }, 800);
      }
    } else {
      box.classList.remove('open');
    }
  };

  window.ulyClearChat = function() {
    if (!confirm('Clear your entire chat history with Ace?')) return;
    MESSAGES = [];
    HISTORY_LOADED = false;
    var msgs = document.getElementById('uply-msgs');
    if (msgs) msgs.innerHTML = '';
    // Delete from Supabase
    var uid = getCurrentUserId();
    if (uid) {
      fetch('/api/chatbot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_history', userId: uid, messages: [] })
      }).catch(function(){});
    }
    // Show fresh greeting
    setTimeout(function() {
      uplyBotMsg("Chat cleared! 🗑 Starting fresh — what can I help you with? 😊");
    }, 200);
  };

  window.uplyKey = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ulySend();
    }
  };

  window.uplyResize = function(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 80) + 'px';
  };

  window.ulySend = function() {
    var input = document.getElementById('uply-input');
    var text = input.value.trim();
    if (!text || IS_TYPING) return;
    input.value = '';
    input.style.height = 'auto';
    uplyUserMsg(text);
    uplyGetReply(text);
  };

  window.uplyQuick = function(text) {
    uplyUserMsg(text);
    uplyGetReply(text);
    renderQuickReplies([]);
  };

  function uplyUserMsg(text) {
    MESSAGES.push({ role: 'user', content: text });
    var t = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    appendMsg('user', text, t);
  }

  function uplyBotMsg(text) {
    var t = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    appendMsg('bot', text, t);
    MESSAGES.push({ role: 'assistant', content: text });
  }

  function appendMsg(role, text, time) {
    var msgs = document.getElementById('uply-msgs');
    var div = document.createElement('div');
    div.className = 'uply-msg ' + role;
    // Simple markdown: **bold**, newlines
    var html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    div.innerHTML = '<div class="uply-bubble">' + html + '</div><div class="uply-time">' + time + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = document.getElementById('uply-msgs');
    var div = document.createElement('div');
    div.id = 'uply-typing-ind';
    div.className = 'uply-msg bot';
    div.innerHTML = '<div class="uply-typing"><div class="uply-dot"></div><div class="uply-dot"></div><div class="uply-dot"></div></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('uply-typing-ind');
    if (el) el.remove();
  }

  function renderQuickReplies(replies) {
    var qw = document.getElementById('uply-quick');
    qw.innerHTML = replies.map(function(r) {
      return '<button class="uply-qbtn" onclick="uplyQuick(\'' + r.replace(/'/g, "\\'") + '\')">' + r + '</button>';
    }).join('');
    qw.style.display = replies.length ? 'flex' : 'none';
  }

  async function uplyGetReply(text) {
    IS_TYPING = true;
    document.getElementById('uply-send').disabled = true;
    showTyping();

    // Detect user type from page or localStorage
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
        uplyBotMsg(data.reply);
        // Show context-based quick replies after response
        var lowerText = text.toLowerCase();
        if (lowerText.includes('price') || lowerText.includes('cost')) {
          renderQuickReplies(['📝 How to order', '🌐 Become Publisher', '📞 Talk to human']);
        } else if (lowerText.includes('publisher')) {
          renderQuickReplies(['💰 Publisher pricing', '📝 How to sign up', '💬 Contact support']);
        } else {
          renderQuickReplies(['💰 Pricing', '📝 Place an order', '📞 Contact support']);
        }
      } else {
        uplyBotMsg('Sorry, I couldn\'t get a response. Please email info@uplyncio.com for help.');
      }
    } catch(e) {
      hideTyping();
      uplyBotMsg('I\'m having connection issues. Please email **info@uplyncio.com** and we\'ll help you within 24 hours! 🙏');
    }

    IS_TYPING = false;
    document.getElementById('uply-send').disabled = false;
  }

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
