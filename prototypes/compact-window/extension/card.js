(() => {
  if (document.getElementById('curious-card')) return;
  const host = document.createElement('div'); host.id = 'curious-card';
  // Inline !important beats any page rule that matches the host (div, *, html > *), so page CSS can't hide, move or restyle it.
  host.style.cssText = 'all:initial!important';
  document.documentElement.append(host); const root = host.attachShadow({mode:'open'});
  const mac=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent);
  const icon={
    close:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8"/></svg>',
    edit:'<svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M8.5 1.5l2 2L4 10H2V8z"/></svg>',
    out:'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 2h6v6M10 2L3 9"/></svg>',
    search:'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="5" cy="5" r="3.5"/><path d="M8 8l3 3"/></svg>',
    play:'<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 2l7 4-7 4z"/></svg>'
  };
  // Margin Note design: a small note anchored to the selection. The term is the headline; one primary link, two quiet chips.
  root.innerHTML = `<style>
  :host{all:initial}
  /* Tokens live on the card's own top-level elements: page rules can match the host, never these. */
  #trigger,section,#viewer{--bg:#fff;--ink:#1d1c1a;--muted:#686c73;--line:#e3e3de;--link:#2142c2;--hover:#f2f2ee;--shadow:0 1px 2px #14141e10,0 10px 30px #14141e26;--serif:"Iowan Old Style",Charter,"Source Serif Pro",Georgia,serif;--sans:system-ui,-apple-system,"Segoe UI",sans-serif;--mono:ui-monospace,"SF Mono",Menlo,monospace;font:14px/1.45 var(--sans);color:var(--ink);direction:ltr;text-align:left}
  @media (prefers-color-scheme:dark){#trigger,section,#viewer{--bg:#1f2228;--ink:#ecedf0;--muted:#a0a5ae;--line:#353940;--link:#a9b8ff;--hover:#2a2e35;--shadow:0 1px 2px #0006,0 12px 34px #0009}}
  /* Popovers render in the top layer, above any page z-index and outside transformed or positioned page ancestors. */
  :where([popover]){inset:auto;margin:0;padding:0;border:0;overflow:visible;width:auto;height:auto;max-width:none;max-height:none;background:none;color:var(--ink)}
  *{box-sizing:border-box}button,input,a{font:inherit;color:inherit}button,a{cursor:pointer}:focus-visible{outline:2px solid var(--link);outline-offset:2px;border-radius:4px}[hidden]{display:none!important}
  .vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  #trigger{position:absolute;z-index:2147483647;display:inline-flex;align-items:center;gap:7px;border:0;border-radius:999px;padding:6px 12px 6px 11px;min-height:32px;background:var(--ink);color:var(--bg);font-weight:500;font-size:13px;box-shadow:var(--shadow)}
  #trigger kbd{font:11px var(--mono);opacity:.65}
  section{position:absolute;z-index:2147483647;width:360px;max-width:calc(100vw - 32px);background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:10px;box-shadow:var(--shadow)}
  .arrow{position:absolute;left:var(--arrow,48px);width:12px;height:12px;background:var(--bg);border:1px solid var(--line);transform:rotate(45deg)}
  section[data-side=below] .arrow{top:-7px;border-right:0;border-bottom:0}section[data-side=above] .arrow{bottom:-7px;border-left:0;border-top:0}section[data-side=none] .arrow{display:none}
  .body{position:relative;overflow:auto;max-height:var(--max,70vh);padding:14px 18px 12px;display:flex;flex-direction:column;gap:10px;border-radius:10px}
  header,.term,nav,footer{flex:none}header{display:flex;justify-content:space-between;align-items:center}
  .src{font:500 11px var(--mono);letter-spacing:.09em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:7px}
  .w{display:inline-grid;place-items:center;width:18px;height:18px;border:1px solid var(--line);border-radius:4px;font:600 11px var(--serif);letter-spacing:0;color:var(--ink)}
  #close{border:0;background:none;width:32px;height:32px;margin:-6px -8px -6px 0;border-radius:6px;display:grid;place-items:center;color:var(--muted)}#close:hover{background:var(--hover);color:var(--ink)}#close:focus-visible{outline-offset:0;border-radius:6px}
  .term{display:flex;align-items:center;gap:8px;color:var(--muted)}
  #query{flex:1;min-width:0;border:0;border-bottom:1.5px dotted var(--muted);border-radius:0;background:none;padding:0 0 2px;font:500 26px/1.2 var(--serif);letter-spacing:-.005em;color:var(--ink);text-overflow:ellipsis}
  #query:hover{border-bottom-style:solid}#query:focus{outline:none;border-bottom:2px solid var(--link)}
  .views{flex:none;display:grid;grid-template-columns:repeat(2,1fr);gap:2px;padding:2px;border-radius:8px;background:var(--hover);border:1px solid var(--line)}
  .views button{border:0;background:none;border-radius:6px;padding:3px 8px;min-height:28px;font-size:13px;color:var(--muted)}.views button:hover{color:var(--ink)}
  .views button[aria-selected=true]{background:var(--bg);color:var(--ink);font-weight:500;box-shadow:0 1px 2px #14141e24}
  .panel{display:flex;flex-direction:column;gap:6px;align-items:flex-start;flex:0 1 auto;min-height:0;overflow:auto;padding:2px;margin:-2px}
  section[data-side=none] .panel{min-height:6.5em}.panel>p{margin:0}.note{font:15px/1.5 var(--serif)}#images[aria-busy=true] #images-status{color:var(--muted)}
  #gallery{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px 8px;width:100%}#gallery:empty{display:none}
  #gallery li{min-width:0;display:flex;flex-direction:column;gap:3px}
  .thumb{display:block;width:100%;aspect-ratio:4/3;padding:0;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--hover)}
  .thumb img{display:block;width:100%;height:100%;object-fit:cover}.thumb:hover{border-color:var(--muted)}
  .thumb.broken{display:grid;place-items:center;font-size:12px;color:var(--muted);cursor:default}
  .cr{margin:0;font-size:11.5px;line-height:1.35;color:var(--muted)}.cr a{color:inherit}.cr span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #viewer{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:#0b0c0fd9}
  #viewer figure{margin:0;display:flex;flex-direction:column;max-width:min(980px,100%);max-height:100%;background:var(--bg);border-radius:10px;overflow:hidden;box-shadow:var(--shadow)}
  #viewer-img{display:block;min-height:0;flex:0 1 auto;max-width:100%;max-height:calc(100vh - 150px);object-fit:contain;background:#000}
  #viewer figcaption{flex:none;display:flex;gap:12px;align-items:flex-start;padding:10px 12px 12px 16px}#viewer figcaption div{flex:1;min-width:0}
  #viewer-caption{margin:0 0 2px;font:15px/1.4 var(--serif)}#viewer-credit{margin:0;font-size:12px;color:var(--muted)}#viewer-credit a{color:inherit}
  #viewer-close{flex:none;border:1px solid var(--line);background:none;border-radius:6px;padding:4px 10px;min-height:30px;font-size:13px;display:inline-flex;align-items:center;gap:6px}#viewer-close:hover{background:var(--hover)}
  #excerpt{margin:0;font:16px/1.55 var(--serif)}#definition[aria-busy=true] #excerpt{color:var(--muted)}
  #credit{margin:0;font-size:12px;color:var(--muted)}#credit a{color:inherit}
  nav{display:flex;align-items:center;gap:6px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:12px;margin-top:2px}
  #reference{color:var(--link);font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:5px;margin-right:auto;padding:4px 0}#reference:hover{text-decoration:underline}
  .chip{border:1px solid var(--line);background:none;border-radius:6px;padding:5px 10px;min-height:30px;font-size:13px;display:inline-flex;align-items:center;gap:6px}.chip:hover{background:var(--hover);border-color:var(--muted)}
  .trail{flex:none;display:flex;min-width:0;margin:-4px 0 -6px}
  #back{min-width:0;max-width:100%;display:inline-flex;align-items:center;gap:5px;border:0;background:none;border-radius:6px;padding:2px 8px 2px 5px;margin-left:-5px;min-height:26px;font-size:13px;color:var(--link)}#back:hover{background:var(--hover)}
  #back-term{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #lookup{position:absolute;z-index:1;max-width:calc(100% - 16px);border:0;border-radius:999px;padding:4px 11px;min-height:28px;background:var(--ink);color:var(--bg);font-size:12.5px;font-weight:500;box-shadow:var(--shadow);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  footer{font-size:12px;color:var(--muted)}footer p{margin:0}
  #status{color:var(--ink)}#status:not(:empty){margin-bottom:4px}#fallback{display:block;color:var(--link);margin-bottom:4px}
  kbd{font:11px var(--mono)}.hint kbd{border:1px solid var(--line);border-bottom-width:2px;border-radius:4px;padding:0 4px}
  @media (prefers-reduced-motion:no-preference){section:not([hidden]){animation:in .16s ease-out}@keyframes in{from{opacity:0;transform:translateY(var(--from,4px))}}}
  </style><button id="trigger" popover="manual" hidden aria-keyshortcuts="Alt+L">Learn more <kbd aria-hidden="true">${mac?'⌥L':'Alt+L'}</kbd></button><section popover="manual" hidden role="dialog" aria-label="Learn more" data-side="below"><span class="arrow" aria-hidden="true"></span><div class="body"><header role="none"><span class="src"><span class="w" aria-hidden="true">W</span>Wikipedia</span><button id="close" aria-label="Close card">${icon.close}</button></header><div id="trail" class="trail" hidden><button id="back"><span aria-hidden="true">←</span><span id="back-term"></span></button></div><p id="announce" class="vh" role="status"></p><label class="term"><span class="vh">Search term</span><input id="query" maxlength="200" spellcheck="false" autocomplete="off">${icon.edit}</label><div class="views" role="tablist" aria-label="View"><button id="tab-explore" role="tab" aria-selected="true" aria-controls="definition">Explore</button><button id="tab-images" role="tab" aria-selected="false" aria-controls="images" tabindex="-1">Images</button></div><div id="definition" class="panel" role="tabpanel" aria-labelledby="tab-explore" aria-live="polite" aria-busy="false"><p id="excerpt"></p><p id="credit" hidden><span id="source"></span> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a></p><button id="retry" class="chip" hidden>Try again</button></div><div id="images" class="panel" role="tabpanel" aria-labelledby="tab-images" aria-live="polite" aria-busy="false" hidden><p id="images-status" class="note"></p><ul id="gallery" aria-label="Images"></ul><p id="images-credit" class="cr" hidden></p><button id="images-retry" class="chip" hidden>Try again</button></div><button id="lookup" hidden></button><nav aria-label="Explore further"><a id="reference" target="_blank" rel="noopener noreferrer"><span id="reference-label">Search Wikipedia</span>${icon.out}<span class="vh"> (opens in a new tab)</span></a><button id="search" class="chip">${icon.search}Web</button><button id="youtube" class="chip">${icon.play}YouTube</button></nav><footer role="none"><p id="status" role="status"></p><a id="fallback" target="_blank" rel="noopener noreferrer" hidden>Open search in a normal tab instead</a><p class="hint"><kbd>Esc</kbd> to close · your place is kept</p></footer></div></section><div id="viewer" popover="manual" role="dialog" aria-modal="true" aria-label="Enlarged image" hidden><figure><img id="viewer-img" alt="" referrerpolicy="no-referrer" crossorigin="anonymous"><figcaption><div><p id="viewer-caption"></p><p id="viewer-credit"></p></div><button id="viewer-close">${icon.close}Close image</button></figcaption></figure></div>`;
  const $=id=>root.getElementById(id); const panel=root.querySelector('section');let selected='',lastFocus,lookupVersion=0,lookupTimer,lookupController;
  let pending=null,pendingRange=null,returnRange=null,anchor=null,side='below',view='explore',imageVersion=0,imageController,imagesFor=null,imageItems=[],viewerFrom=null,viewerItem=null;
  // Any editable page text (inputs, textareas, every contenteditable variant) is the reader's own typing, not something to look up.
  const isEditable=n=>{const el=n?.nodeType===1?n:n?.parentElement;return !!el&&(el.isContentEditable||!!el.closest('input,textarea,select'));};
  // Show or hide in the top layer when the browser supports popovers; the hidden attribute stays the source of truth.
  function setShown(el,show){el.hidden=!show;if(!el.showPopover)return;try{const open=el.matches(':popover-open');if(show&&!open)el.showPopover();else if(!show&&open)el.hidePopover();}catch{}}
  // A zoomed page (CSS zoom on html) scales the card's coordinates too.
  const zoom=()=>host.currentCSSZoom||1;
  // Back trail: earlier terms in this card, newest last. term is the current step; editing pushes once per edit.
  let trail=[],term='',editStep=null;const TRAIL_MAX=10,cache=new Map();
  const cached=(kind,q)=>cache.get(kind+':'+q.toLowerCase());
  function remember(kind,q,result){const k=kind+':'+q.toLowerCase();cache.delete(k);cache.set(k,result);if(cache.size>40)cache.delete(cache.keys().next().value);}
  function urlFor(provider,q){const bases={youtube:'https://www.youtube.com/results?search_query=',google:'https://www.google.com/search?q=',duck:'https://duckduckgo.com/?q=',bing:'https://www.bing.com/search?q='};return bases[provider]+encodeURIComponent(q);}
  // Anchors are stored in page coordinates so the note stays beside its text if the reader scrolls.
  const clamp=(v,min,max)=>Math.max(min,Math.min(v,max));
  function toPage(box,end=box){const x=scrollX,y=scrollY;return{left:box.left+x,right:box.right+x,top:box.top+y,bottom:box.bottom+y,endRight:end.right+x,endTop:end.top+y,endBottom:end.bottom+y};}
  function rangeAnchor(range){if(!range?.startContainer.isConnected)return null;const box=range.getBoundingClientRect();if(!box.width&&!box.height)return null;const rects=range.getClientRects();return toPage(box,rects[rects.length-1]||box);}
  function selectionAnchor(){const s=getSelection();return s?.rangeCount?rangeAnchor(s.getRangeAt(0)):null;}
  function placeTrigger(){const t=$('trigger'),z=zoom(),vw=document.documentElement.clientWidth,tw=t.offsetWidth*z,th=t.offsetHeight*z;let top=pending.endBottom+6;if(top+th>scrollY+innerHeight-8)top=pending.endTop-th-6;t.style.left=clamp(pending.endRight-12,scrollX+8,scrollX+vw-tw-8)/z+'px';t.style.top=top/z+'px';}
  function placeCard(keepSide){
    const vw=document.documentElement.clientWidth,vh=innerHeight,z=zoom();
    const below=anchor?vh-(anchor.bottom-scrollY)-28:0,above=anchor?(anchor.top-scrollY)-28:0;
    // No anchor, or too little room beside the word (high zoom, short window): pin the note inside the window instead.
    if(!anchor||Math.max(below,above)<240){
      const top=anchor||vh<400?8:120;panel.dataset.side='none';
      Object.assign(panel.style,{position:'fixed',top:top/z+'px',left:anchor?Math.max(8,(vw-panel.offsetWidth*z)/2)/z+'px':'',right:anchor?'':24/z+'px'});
      panel.style.setProperty('--max',(vh-top-(anchor?8:24))/z+'px');return;
    }
    Object.assign(panel.style,{position:'',right:''});
    if(!keepSide)side=below>=380||below>=above?'below':'above';
    panel.style.setProperty('--max',Math.max(180,side==='below'?below:above)/z+'px');panel.style.setProperty('--from',side==='below'?'4px':'-4px');
    const w=panel.offsetWidth*z,mid=(anchor.left+anchor.right)/2,left=clamp(mid-48,scrollX+16,scrollX+vw-w-16);
    panel.style.left=left/z+'px';panel.style.top=(side==='below'?anchor.bottom+12:anchor.top-12-panel.offsetHeight*z)/z+'px';
    panel.dataset.side=side;panel.style.setProperty('--arrow',clamp(mid-left-6,14,w-26)/z+'px');
  }
  // A note placed above its text grows upward as the definition loads.
  // Every page-level listener shares one signal so the toolbar button can switch the card off cleanly.
  const life=new AbortController(),on={signal:life.signal};
  const resizer=new ResizeObserver(()=>{if(!panel.hidden&&anchor&&side==='above')placeCard(true);});resizer.observe(panel);
  // Zoom or a window resize reflows the text, so the stored position is stale: measure the words again and pick the side afresh.
  // Page zoom doesn't fire the same event in every browser, so the visual viewport and the page's own layout box are watched too.
  let refit=0;
  function refitSoon(){cancelAnimationFrame(refit);refit=requestAnimationFrame(()=>{
    if(!panel.hidden){anchor=rangeAnchor(returnRange)||anchor;placeCard();}
    else if(!$('trigger').hidden&&pendingRange){pending=rangeAnchor(pendingRange)||pending;placeTrigger();}
  });}
  addEventListener('resize',refitSoon,on);visualViewport?.addEventListener('resize',refitSoon,on);
  const pageResizer=new ResizeObserver(refitSoon);pageResizer.observe(document.documentElement);
  function label(){const q=$('query').value.trim();panel.setAttribute('aria-label',q?'Learn more: '+q:'Learn more');}
  function show(q,at=pending){selected=q;anchor=at;lastFocus=document.activeElement;pagePointer=false;returnRange=at===pending?pendingRange:null;$('query').value=q;term=q;trail=[];editStep=null;renderTrail();hideLookup();setShown($('trigger'),false);$('status').textContent='';$('fallback').hidden=true;label();setView('explore');setShown(panel,true);placeCard();update();$('close').focus({preventScroll:true});}
  function stopLookup(){clearTimeout(lookupTimer);lookupController?.abort();lookupVersion++;$('definition').setAttribute('aria-busy','false');}
  function update(delay=0){
    stopLookup();stopImages();imagesFor=null;if(view==='images')loadImages(delay);const version=lookupVersion;const q=$('query').value.trim();
    $('reference').href='https://en.wikipedia.org/wiki/Special:Search?search='+encodeURIComponent(q);
    $('reference-label').textContent='Search Wikipedia';$('credit').hidden=true;$('retry').hidden=true;
    if(!q){$('excerpt').textContent='Enter a word or short phrase to see its definition.';return;}
    const hit=cached('def',q);if(hit){renderDefinition(hit);return;}
    $('excerpt').textContent='Looking up Wikipedia…';$('definition').setAttribute('aria-busy','true');
    lookupTimer=setTimeout(async()=>{
      lookupController=new AbortController();const controller=lookupController;
      const timeout=setTimeout(()=>controller.abort(),10000);
      try{
        let result;
        if(typeof chrome!=='undefined'&&chrome.runtime?.id){
          const response=await chrome.runtime.sendMessage({type:'wikipedia',query:q});
          if(!response?.ok)throw new Error('Lookup failed');result=response.result;
        }else result=await CuriousWikipedia.lookup(q,controller.signal);
        if(version!==lookupVersion||panel.hidden)return;
        remember('def',q,result);renderDefinition(result);
      }catch{
        if(version!==lookupVersion||panel.hidden)return;
        $('excerpt').textContent='Wikipedia couldn’t load. Try again, or open Wikipedia directly.';$('retry').hidden=false;
      }finally{clearTimeout(timeout);if(version===lookupVersion)$('definition').setAttribute('aria-busy','false');}
    },delay);
  }
  function renderDefinition(result){
    if(result.kind==='empty'){$('excerpt').textContent='No Wikipedia definition found. Try a different term, or search Wikipedia.';return;}
    $('excerpt').textContent=result.kind==='ambiguous'?'This term has several meanings on Wikipedia. Open the article to choose the one you mean.':result.extract;
    $('source').textContent=(result.matched?'Closest match: ':'From ')+'“'+result.title+'”';
    $('credit').hidden=false;$('reference').href=result.url;$('reference-label').textContent='Read on Wikipedia';
  }
  // Follow-up lookups: a new term replaces the current one in the same card, which stays anchored to the article word.
  function renderTrail(){const prev=trail[trail.length-1];$('trail').hidden=!prev;if(!prev)return;$('back-term').textContent=prev.q;$('back').title='Back to '+prev.q;$('back').setAttribute('aria-label','Back to '+prev.q+(trail.length>1?', '+trail.length+' earlier terms':''));}
  function pushStep(q){if(!q)return;trail.push({q,view});if(trail.length>TRAIL_MAX)trail.shift();renderTrail();}
  function announce(text){const a=$('announce');a.textContent='';setTimeout(()=>{a.textContent=text;},50);}
  function go(q,v){term=q;editStep=null;hideLookup();$('query').value=q;label();setView(v,false,false);update();renderTrail();}
  function followUp(raw){
    const q=raw.replace(/\s+/g,' ').trim().slice(0,200);if(!q)return;hideLookup();
    if(q.toLowerCase()===term.toLowerCase())return;
    root.getSelection?.()?.removeAllRanges();getSelection()?.removeAllRanges();
    pushStep(term);go(q,'explore');announce('Showing '+q);$('back').focus({preventScroll:true});
  }
  function back(){const step=trail.pop();if(!step)return;go(step.q,step.view);announce('Back to '+step.q);(trail.length?$('back'):$('close')).focus({preventScroll:true});}
  $('back').onclick=back;
  // Text selected inside the definition, read through the shadow root (Chrome) or composed ranges (Safari).
  function cardSelection(){
    const s=getSelection();let r=null;
    try{if(root.getSelection){const rs=root.getSelection();if(rs?.rangeCount)r=rs.getRangeAt(0);}
      else if(s?.getComposedRanges){try{r=s.getComposedRanges({shadowRoots:[root]})[0];}catch{r=s.getComposedRanges(root)[0];}}
      else if(s?.rangeCount)r=s.getRangeAt(0);}catch{return null;}
    if(!r||r.collapsed)return null;const ex=$('excerpt');if(!ex.contains(r.startContainer)||!ex.contains(r.endContainer))return null;
    const range=document.createRange();range.setStart(r.startContainer,r.startOffset);range.setEnd(r.endContainer,r.endOffset);
    const text=range.toString().replace(/\s+/g,' ').trim();if(!text||text.length>200)return null;
    const rects=range.getClientRects();return{text,rect:rects[rects.length-1]||range.getBoundingClientRect()};
  }
  function hideLookup(){$('lookup').hidden=true;}
  function offerLookup(){
    const s=panel.hidden?null:cardSelection(),b=$('lookup');if(!s||s.text.toLowerCase()===term.toLowerCase()){hideLookup();return;}
    b.dataset.q=s.text;b.textContent='Look up “'+(s.text.length>32?s.text.slice(0,31)+'…':s.text)+'”';b.setAttribute('aria-label','Look up '+s.text);b.hidden=false;
    const body=root.querySelector('.body'),box=body.getBoundingClientRect(),h=b.offsetHeight;let top=s.rect.bottom-box.top+6;if(top+h>box.height-8)top=s.rect.top-box.top-h-6;
    b.style.top=top+body.scrollTop+'px';b.style.left=clamp(s.rect.left-box.left,8,box.width-b.offsetWidth-8)+'px';
  }
  $('excerpt').addEventListener('mouseup',()=>setTimeout(offerLookup));
  $('definition').addEventListener('keyup',e=>{if(e.shiftKey)offerLookup();});
  $('definition').addEventListener('scroll',hideLookup);
  // Keep the selection while pressing the button; the term is read from the offer, not the live selection.
  $('lookup').addEventListener('mousedown',e=>e.preventDefault());$('lookup').onclick=()=>followUp($('lookup').dataset.q||'');
  document.addEventListener('selectionchange',()=>{if(!$('lookup').hidden&&!cardSelection())hideLookup();},on);
  // Explore / Images: a segmented control using the tabs pattern (arrow keys move and select).
  const tabs=['explore','images'];
  function setView(next,focus,load=true){view=next;hideLookup();for(const t of tabs){const b=$('tab-'+t),on=t===next;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;$(t==='explore'?'definition':t).hidden=!on;}
    if(next!=='images')closeViewer(false);if(focus)$('tab-'+next).focus();if(load&&next==='images'&&imagesFor!==$('query').value.trim())loadImages();}
  root.querySelector('.views').addEventListener('click',e=>{const b=e.target.closest('[role=tab]');if(b)setView(b.id.slice(4));});
  root.querySelector('.views').addEventListener('keydown',e=>{const i=tabs.indexOf(view),n={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:tabs.length-1}[e.key];if(n===undefined)return;e.preventDefault();setView(tabs[(n+tabs.length)%tabs.length],true);});
  function stopImages(){clearTimeout(imageController?.timer);imageController?.abort();imageVersion++;$('images').setAttribute('aria-busy','false');}
  function imageState(text,retry){$('images-status').textContent=text;$('images-status').hidden=!text;$('images-retry').hidden=!retry;}
  function loadImages(delay=0){
    stopImages();closeViewer(false);const version=imageVersion,q=$('query').value.trim();imagesFor=q;imageItems=[];$('gallery').replaceChildren();$('images-credit').hidden=true;
    if(!q){imageState('Enter a word or short phrase to see images.');return;}
    const hit=cached('img',q);if(hit){renderImages(hit);return;}
    imageState('Finding images on Wikimedia Commons…');$('images').setAttribute('aria-busy','true');
    const controller=imageController=new AbortController();
    controller.timer=setTimeout(async()=>{
      const timeout=setTimeout(()=>controller.abort(),12000);
      try{
        let result;
        if(typeof chrome!=='undefined'&&chrome.runtime?.id){
          const response=await chrome.runtime.sendMessage({type:'images',query:q});
          if(!response?.ok)throw new Error('Images failed');result=response.result;
        }else result=await CuriousWikipedia.images(q,controller.signal);
        if(version!==imageVersion||panel.hidden)return;
        remember('img',q,result);renderImages(result);
      }catch{
        if(version!==imageVersion||panel.hidden)return;
        imagesFor=null;imageState('Images couldn’t load. Try again, or open Wikimedia Commons directly.',true);
      }finally{clearTimeout(timeout);if(version===imageVersion)$('images').setAttribute('aria-busy','false');}
    },delay);
  }
  function renderImages(result){
    if(result.kind==='ambiguous'){imageState('This term has several meanings on Wikipedia. Edit the term to be more specific, or open the article to choose one.');return;}
    if(result.kind!=='images'){imageState(result.title?'The “'+result.title+'” article has no freely licensed images to show.':'No Wikipedia article matches this term, so there are no images to show.');return;}
    imageState(result.matched?'Closest match: “'+result.title+'”':'');imageItems=result.items;
    $('gallery').replaceChildren(...result.items.map(thumbnail));
    $('images-credit').replaceChildren('Images via ',link('https://commons.wikimedia.org/','Wikimedia Commons'),' · each links to its file page');$('images-credit').hidden=false;
  }
  function link(href,text){const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=text;return a;}
  function license(item){return item.licenseUrl?link(item.licenseUrl,item.license):item.license;}
  function thumbnail(item,i){
    const li=document.createElement('li'),b=document.createElement('button'),img=document.createElement('img');
    b.className='thumb';b.setAttribute('aria-label','Enlarge image: '+(item.caption||item.file));b.title=item.caption||item.file;
    Object.assign(img,{src:item.thumb,alt:'',loading:'lazy',decoding:'async',referrerPolicy:'no-referrer',crossOrigin:'anonymous'});
    // Some pages block outside images; say so rather than leaving an empty frame.
    img.onerror=()=>viaExtension(img,item.thumb,()=>{b.classList.add('broken');b.disabled=true;b.textContent='Image blocked or unavailable';});
    b.append(img);b.onclick=()=>openViewer(i,b);
    const cr=document.createElement('p'),by=document.createElement('span'),lic=document.createElement('span');cr.className='cr';by.textContent=item.artist;by.title=item.artist;lic.append(license(item),' · ',link(item.source,'Source'));cr.append(by,lic);
    li.append(b,cr);return li;
  }
  // A strict page CSP can block Wikimedia images; the extension worker fetches the same file and returns it as a data: URL.
  async function viaExtension(img,url,fail){
    if(img.dataset.retried||typeof chrome==='undefined'||!chrome.runtime?.id){fail();return;}img.dataset.retried='1';
    try{const r=await chrome.runtime.sendMessage({type:'image',url});if(r?.ok&&img.isConnected&&img.getAttribute('src')){img.src=r.data;return;}}catch{}fail();
  }
  // The enlarged image is a lightbox over the page, so it can use the whole window without navigating away.
  function openViewer(i,from){
    const item=imageItems[i];if(!item)return;viewerFrom=from;viewerItem=item;
    const img=$('viewer-img');delete img.dataset.retried;img.src=item.full;img.alt=item.caption||item.file;
    $('viewer-caption').textContent=item.caption||item.file;
    $('viewer-credit').replaceChildren(item.artist,' · ',license(item),' · ',link(item.source,item.source.includes('commons.')?'View on Wikimedia Commons':'View file page'));
    setShown($('viewer'),true);$('viewer-close').focus({preventScroll:true});
  }
  function closeViewer(refocus){if($('viewer').hidden)return;setShown($('viewer'),false);$('viewer-img').removeAttribute('src');if(refocus)viewerFrom?.focus({preventScroll:true});}
  $('viewer').addEventListener('click',e=>{if(e.target===$('viewer'))closeViewer(true);});
  // Keep Tab inside the lightbox while it is open.
  $('viewer').addEventListener('keydown',e=>{if(e.key!=='Tab')return;const f=[...$('viewer').querySelectorAll('a,button')],at=f.indexOf(root.activeElement);e.preventDefault();f[(at+(e.shiftKey?-1:1)+f.length)%f.length].focus();});
  $('viewer-img').onerror=()=>{const img=$('viewer-img');if(img.getAttribute('src'))viaExtension(img,viewerItem.full,()=>{if(img.getAttribute('src'))$('viewer-caption').textContent='This image couldn’t load here. Open its file page instead.';});};
  $('viewer-close').onclick=()=>closeViewer(true);$('images-retry').onclick=()=>loadImages();
  function close(fromKeyboard=true){
    const inCard=!!root.activeElement,active=document.activeElement;stopLookup();stopImages();closeViewer(false);hideLookup();trail=[];editStep=null;renderTrail();
    // Put the keyboard back where the reader was: the control that opened the card, or the looked-up words in the article.
    // A mouse Close leaves the article's selection alone, so the next drag starts a fresh selection.
    const words=fromKeyboard&&returnRange?.startContainer.isConnected;
    // A focused plain container around the words (GitHub's content pane takes focus on click) is not the reader's place; the words are.
    // A focused link or button around them still gets focus back.
    const back=lastFocus&&lastFocus!==document.body&&lastFocus!==host&&lastFocus.isConnected;
    const around=words&&back&&lastFocus.contains(returnRange.startContainer)&&!lastFocus.matches('a[href],area,button,summary,[role=link],[role=button],[role=tab],[role=menuitem],[role=option],[role=treeitem]');
    // Focus can also sit outside the card on a keyboard close (still on <body> or that container); without a page click since opening, the words are still the place.
    let land=false;
    if(inCard||(words&&!pagePointer&&(active===document.body||active===lastFocus))){
      if(back&&!around)lastFocus.focus({preventScroll:true});else if(words){placeMark(returnRange);land=!!mark;}
    }
    // Focus leaves the card before it hides, so the browser's popover focus return can't put it back on the container.
    setShown(panel,false);if(!land)return;
    restoreWords();
    // If the page or browser still moves focus back to <body> or the container a moment later, put it on the words again.
    requestAnimationFrame(()=>{const a=document.activeElement;if(!panel.hidden||a===mark||!(a===document.body||a===lastFocus)||!returnRange?.startContainer.isConnected)return;placeMark(returnRange);if(mark)restoreWords();});
  }
  function restoreWords(){const s=getSelection();s.removeAllRanges();s.addRange(returnRange);}
  // A page click while the card is open means the reader has moved on; a keyboard close then leaves focus alone.
  let pagePointer=false;document.addEventListener('pointerdown',e=>{if(!e.composedPath().includes(host))pagePointer=true;},{capture:true,signal:life.signal});
  // The hidden Close button leaves focus on <body>, so the next Tab would start at the top of the page.
  // A focusable marker just after the words makes it continue from there; it removes itself when focus moves on in the page
  // (switching windows also fires blur but keeps it as the page's focus, so it stays for the reader's return).
  let mark=null;
  // Removing the focused marker fires its blur handler mid-remove; clear the reference first so that call does nothing.
  function dropMark(){const m=mark;mark=null;m?.remove();}
  function placeMark(range){
    dropMark();const at=range.endContainer;if(!at.isConnected)return;
    const parent=at.nodeType===1?at:at.parentNode,before=at.nodeType===1?at.childNodes[range.endOffset]||null:at.nextSibling;if(!parent||isEditable(parent))return;
    mark=document.createElement('span');mark.tabIndex=-1;mark.style.cssText='all:initial!important;display:inline!important;outline:none!important';
    const m=mark;m.addEventListener('blur',()=>{if(mark===m&&document.activeElement!==m)dropMark();});parent.insertBefore(m,before);mark.focus({preventScroll:true});
  }
  document.addEventListener('mouseup',e=>{if(e.composedPath().includes(host))return;const s=getSelection();const q=isEditable(e.target)||isEditable(s?.anchorNode)?'':s?.toString().trim();const at=q&&q.length<=200&&selectionAnchor();if(!at){setShown($('trigger'),false);return;}selected=q;pending=at;pendingRange=s.getRangeAt(0).cloneRange();setShown($('trigger'),true);placeTrigger();},on);
  $('trigger').onclick=()=>show(selected);$('close').onclick=e=>close(e.detail===0);$('query').oninput=()=>{if(!editStep){editStep={from:term};pushStep(term);}label();update(450);};
  // An edit is one step: committed on Enter or blur; an edit that ends on the same term leaves the trail as it was.
  function commitEdit(){if(!editStep)return;const q=$('query').value.trim();if(editStep.from&&trail[trail.length-1]?.q===editStep.from&&q.toLowerCase()===editStep.from.toLowerCase()){trail.pop();renderTrail();}term=q;editStep=null;}
  $('query').addEventListener('blur',commitEdit);$('query').addEventListener('keydown',e=>{if(e.key==='Enter')commitEdit();});$('retry').onclick=()=>update();
  document.addEventListener('keydown',e=>{if(e.key!=='Escape'||panel.hidden||e.defaultPrevented)return;if(e.target!==host&&isEditable(e.target))return;e.stopPropagation();if(!$('viewer').hidden){closeViewer(true);return;}close();},on);
  // Keys typed in the card stay in the card, so page shortcuts (/, s, k…) never fire while editing the headline. Escape and Option+L are handled here.
  for(const type of ['keydown','keyup','keypress'])root.addEventListener(type,e=>{
    e.stopPropagation();if(type!=='keydown'||panel.hidden)return;
    if(e.key==='Escape'){e.preventDefault();if(!$('viewer').hidden)closeViewer(true);else close();return;}
    if(e.altKey&&!e.metaKey&&!e.ctrlKey&&e.code==='KeyL'){const s=cardSelection();if(s){e.preventDefault();followUp(s.text);}}
  });
  // Alt+L (Option+L on Mac) opens the note for the current selection without reaching for the mouse.
  document.addEventListener('keydown',e=>{if(!e.altKey||e.metaKey||e.ctrlKey||e.code!=='KeyL')return;const inCard=!panel.hidden&&cardSelection();if(inCard){e.preventDefault();followUp(inCard.text);return;}if(e.composedPath().includes(host)||isEditable(e.target))return;const s=getSelection();if(isEditable(s?.anchorNode))return;const q=s?.toString().trim();const at=q&&q.length<=200&&selectionAnchor();if(!at)return;e.preventDefault();pending=at;pendingRange=s.getRangeAt(0).cloneRange();show(q,at);},on);
  async function launch(provider){const q=$('query').value.trim();if(!q){$('status').textContent='Enter a concept first.';return;}$('fallback').hidden=true;
    if (typeof chrome!=='undefined'&&chrome.runtime?.id){try{const result=await chrome.runtime.sendMessage({type:'explore',provider,query:q});if(!result?.ok)throw new Error(result?.error);$('status').textContent='Opened in a small window. Close it to come back here.';}catch{$('status').textContent='Could not open search. Check the extension’s search settings and try again.';}return;}
    let saved; try { saved=localStorage.getItem('curious-search'); } catch {}
    const chosen=provider==='youtube'?'youtube':saved;
    if(!['youtube','google','duck','bing'].includes(chosen)){$('status').textContent='Choose a search engine once in Curious settings. Using your browser’s default engine needs the installed extension.';return;}
    const url=urlFor(chosen,q);$('fallback').href=url;$('fallback').hidden=false;
    // Open synchronously during the click; sever the opener before external navigation.
    const w=window.open('about:blank','_blank',`popup=yes,width=${Math.min(720,screen.availWidth)},height=${Math.min(680,screen.availHeight)},left=${Math.max(0,screen.availWidth-750)},top=70`);
    if(!w){$('status').textContent='Window blocked. Use the normal-tab link.';return;}w.opener=null;w.location.replace(url);$('status').textContent='Opened in a small window. Close it to come back here.';
  }
  $('search').onclick=()=>launch('search');$('youtube').onclick=()=>launch('youtube');
  // The fixture button provides a keyboard-friendly sample; real selections also work. The note anchors to the button.
  document.getElementById('try-concept')?.addEventListener('click',e=>show('bioluminescence',toPage(e.currentTarget.getBoundingClientRect())),on);
  // Called by the extension's toolbar button (same isolated world) to switch the card off on this page.
  // Pages that re-render the whole document can drop unknown children of <html>; put the card back with whatever was showing.
  const keeper=new MutationObserver(()=>{if(host.isConnected||!document.documentElement)return;document.documentElement.append(host);keeper.observe(document.documentElement,{childList:true});for(const el of [$('trigger'),panel,$('viewer')])if(!el.hidden)setShown(el,true);});
  keeper.observe(document,{childList:true});keeper.observe(document.documentElement,{childList:true});
  window.__curiousCard={off(){dropMark();stopLookup();stopImages();life.abort();resizer.disconnect();pageResizer.disconnect();cancelAnimationFrame(refit);keeper.disconnect();host.remove();delete window.__curiousCard;}};
})();
