importScripts('wikipedia.js');
// The toolbar button toggles the card per tab. Right-clicking it offers "Always on this site" and "On all sites",
// which ask the browser for that host access and register card.js as a content script there. Icon and tooltip show the state.
const icons=state=>Object.fromEntries([16,32,48,128].map(n=>[n,`icons/${state}-${n}.png`]));
const titles={
  off:'Turn on Curious for this page. Right-click for Always on this site.',
  on:'Curious is on for this page. Click to turn it off.',
  always:'Curious is always on for this site. Click to turn it off on this page.',
  paused:'Curious is off on this page. It is always on for this site and comes back on the next page. Click to turn it on.'
};
function showState(tabId,state){
  return Promise.all([chrome.action.setIcon({tabId,path:icons(state==='paused'?'off':state)}),chrome.action.setTitle({tabId,title:titles[state]})]);
}
// The icon follows the card itself, never host access alone. Each tab's latest decision wins; slower, older checks are dropped.
const turn={};
const decide=(tabId,state)=>{const n=turn[tabId]=(turn[tabId]||0)+1;return Promise.resolve(state).then(s=>turn[tabId]===n&&showState(tabId,s));};
// "Always" needs both: the reader chose this site (or all sites) in Curious, and the card is actually on the page.
const stateOf=async(url,present)=>present?(alwaysFor(await prefs(),siteOf(url))?'always':'on'):'off';
// Looks at the tab (where Curious may run) at every navigation step, including in-page URL changes and back/forward cache restores.
function syncIcon(tabId){
  const look=chrome.scripting.executeScript({target:{tabId},injectImmediately:true,func:()=>[!!window.__curiousCard,location.href]})
    .then(([{result:[present,url]}])=>stateOf(url,present),()=>'off');
  decide(tabId,look).catch(()=>{});
}
// Sites are stored as origin match patterns ("https://example.com/*"). Kept: sites the reader chose, whether all sites are on,
// and sites stopped while all sites are on. A choice counts only while the browser still grants its access.
const ALL=['http://*/*','https://*/*'];
const siteOf=url=>{try{const u=new URL(url);return /^https?:$/.test(u.protocol)?`${u.protocol}//${u.hostname}/*`:null;}catch{return null;}};
async function prefs(){const {sites=[],allSites=false,skipSites=[]}=await chrome.storage.local.get(['sites','allSites','skipSites']);return {sites,allSites,skipSites};}
const alwaysFor=(p,site)=>!!site&&(p.sites.includes(site)||p.allSites&&!p.skipSites.includes(site));
const granted=origins=>chrome.permissions.contains({origins}).catch(()=>false);
// Puts the card on or takes it off one tab; the first script answers whether card.js still needs injecting.
const card=(tabId,on)=>chrome.scripting.executeScript({target:{tabId},func:on=>{const has=!!window.__curiousCard;if(has&&!on)window.__curiousCard.off();return on&&!has;},args:[on]})
  .then(([{result}])=>result&&chrome.scripting.executeScript({target:{tabId},files:['card.js']}));
// Every change to the choices runs one at a time: read, change, drop what the browser no longer grants, save, re-register.
let queue=Promise.resolve();
function update(change=()=>{}){
  const run=queue.then(async()=>{
    const before=await prefs(),p=structuredClone(before);change(p);
    const sites=[];for(const s of p.sites)if(!sites.includes(s)&&await granted([s]))sites.push(s);
    const allSites=p.allSites&&await granted(ALL),next={sites,allSites,skipSites:allSites?[...new Set(p.skipSites)].filter(s=>!sites.includes(s)):[]};
    await chrome.storage.local.set(next);
    await chrome.scripting.unregisterContentScripts({ids:['curious']}).catch(()=>{});
    const matches=next.allSites?ALL:next.sites;
    if(matches.length)await chrome.scripting.registerContentScripts([{id:'curious',matches,...(next.allSites&&next.skipSites.length?{excludeMatches:next.skipSites}:{}),js:['card.js'],runAt:'document_idle',persistAcrossSessions:true}]);
    await refreshMenu();
    return {before,next};
  });
  queue=run.catch(e=>console.warn('Curious could not update its sites.',e.message));
  return run;
}
// Turning a site off also takes the card off its open tabs; tabs whose site is no longer always on show off.
async function settle({before,next}){
  for(const tab of await chrome.tabs.query({url:ALL}).catch(()=>[])){
    const site=siteOf(tab.url);if(!alwaysFor(before,site)||alwaysFor(next,site))continue;
    await card(tab.id,false).catch(()=>{});decide(tab.id,'off').catch(()=>{});
  }
}
// Reader actions. The permission request itself happens in the click handler that called these (a menu click or a Settings button).
const access={
  async siteOn(site,tabId){const r=await update(p=>{p.skipSites=p.skipSites.filter(s=>s!==site);if(!p.allSites&&!p.sites.includes(site))p.sites.push(site);});if(tabId!==undefined&&alwaysFor(r.next,site)){await card(tabId,true).catch(()=>{});await decide(tabId,'always');}return r.next;},
  async siteOff(site){const r=await update(p=>{p.sites=p.sites.filter(s=>s!==site);if(p.allSites)p.skipSites.push(site);});await settle(r);if(!r.next.allSites)await chrome.permissions.remove({origins:[site]}).catch(()=>{});return update().then(r=>r.next);},
  async allOn(tabId,site){const r=await update(p=>{p.allSites=true;p.skipSites=[];});if(tabId!==undefined&&alwaysFor(r.next,site)){await card(tabId,true).catch(()=>{});await decide(tabId,'always');}return r.next;},
  // Stop on all sites means Curious turns on by itself nowhere, sites chosen one by one included: browsers may revoke those along with the all-sites patterns anyway.
  async allOff(){const r=await update(p=>{p.allSites=false;p.sites=[];});await settle(r);for(const origins of [ALL,...r.before.sites.map(s=>[s])])await chrome.permissions.remove({origins}).catch(()=>{});return update().then(r=>r.next);}
};
// If a browser refuses the request from a menu click, Settings asks instead, from a button the reader clicks.
const askInSettings=(ask,site)=>chrome.tabs.create({url:chrome.runtime.getURL('settings.html')+'?'+new URLSearchParams(site?{ask,site}:{ask})});
function request(origins,ask,site,then){
  let pending;try{pending=chrome.permissions.request({origins});}catch(e){pending=Promise.reject(e);}
  pending.then(ok=>ok&&then(),()=>askInSettings(ask,site)).catch(e=>console.warn('Curious could not turn on there.',e.message));
}
const menu=[['site-on','Always on this site'],['site-off','Stop on this site'],['all-on','On all sites'],['all-off','Stop on all sites']];
async function refreshMenu(){
  const [tab]=await chrome.tabs.query({active:true,lastFocusedWindow:true}).catch(()=>[]);
  const p=await prefs(),site=siteOf(tab?.url),on=alwaysFor(p,site)&&await granted([site]),show={'site-on':!on,'site-off':on,'all-on':!p.allSites,'all-off':p.allSites};
  for(const [id] of menu)chrome.contextMenus.update(id,{visible:show[id]},()=>void chrome.runtime.lastError);
}
function menuClicked(info,tab){
  // No await before permissions.request: it must run while the click still counts as a user gesture.
  // No site: a browser page Curious can't run on (nothing to do), or a browser that hid the address (Settings explains).
  const site=siteOf(tab?.url),tabId=tab?.id;
  if(info.menuItemId==='site-on'){if(!site){if(!tab?.url)askInSettings('page');return;}request([site],'site',site,()=>access.siteOn(site,tabId));}
  else if(info.menuItemId==='all-on')request(ALL,'all',null,()=>access.allOn(tabId,site));
  else if(info.menuItemId==='site-off'&&site)access.siteOff(site);
  else if(info.menuItemId==='all-off')access.allOff();
}
chrome.contextMenus.onClicked.addListener(menuClicked);
chrome.runtime.onInstalled.addListener(()=>{
  chrome.contextMenus.removeAll(()=>{for(const [id,title] of menu)chrome.contextMenus.create({id,title,contexts:['action']},()=>void chrome.runtime.lastError);update();});
});
chrome.runtime.onStartup.addListener(()=>update());
// Access granted or taken away anywhere (here, in Settings, or in the browser's own site-access controls) re-syncs the registration.
chrome.permissions.onAdded.addListener(()=>update());
chrome.permissions.onRemoved.addListener(()=>update().then(settle,()=>{}));
chrome.tabs.onActivated.addListener(()=>refreshMenu());
chrome.windows.onFocusChanged.addListener(()=>refreshMenu());
chrome.action.onClicked.addListener(async tab => {
  try {
    const [{result:wasOn}]=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>{if(!window.__curiousCard)return false;window.__curiousCard.off();return true;}});
    if(!wasOn)await chrome.scripting.executeScript({target:{tabId:tab.id},files:['card.js']});
    const always=alwaysFor(await prefs(),siteOf(tab.url));
    await decide(tab.id,wasOn?(always?'paused':'off'):(always?'always':'on'));
  }
  catch (e) { console.warn('Curious can’t run on this page. Open an ordinary web page and try again.',e.message); }
});
// A new page drops a clicked-on card (off); a registered card comes back by itself (always); an in-page URL change or a
// back/forward restore keeps the card. Checking the tab at loading and complete covers all of them.
chrome.tabs.onUpdated.addListener((tabId,info,tab)=>{
  if(info.status)syncIcon(tabId);
  if(tab.active&&(info.url||info.status==='loading'))refreshMenu();
});
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  // Settings (an extension page, never a web page or content script) reads and changes where Curious runs.
  if(message.type==='access'&&sender.url?.startsWith(chrome.runtime.getURL(''))){
    const site=typeof message.site==='string'?siteOf(message.site.replace(/\*$/,'')):null;
    const ops={list:prefs,'site-on':()=>site&&access.siteOn(site),'site-off':()=>site&&access.siteOff(site),'all-on':()=>access.allOn(),'all-off':()=>access.allOff()};
    if(!Object.hasOwn(ops,message.op)){reply({ok:false});return;}
    // Settings also learns which chosen sites the browser no longer grants (Safari's Allow for One Day ran out), until the next sync drops them.
    Promise.resolve(ops[message.op]()).then(()=>prefs()).then(async p=>{const lapsed=[];for(const s of p.sites)if(!await granted([s]))lapsed.push(s);reply({ok:true,...p,lapsed});},()=>reply({ok:false}));
    return true;
  }
  if(!sender.tab)return;
  // card.js says it is on this page: when it starts (clicked on, or loaded by itself) and when the page returns from the back/forward cache.
  if(message.type==='card'){decide(sender.tab.id,stateOf(sender.url,true)).catch(()=>{});return;}
  if(message.type==='wikipedia'){
    if(typeof message.query!=='string'||!message.query.trim()||message.query.length>200){reply({ok:false});return;}
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000);
    CuriousWikipedia.lookup(message.query,controller.signal).then(result=>reply({ok:true,result}),()=>reply({ok:false})).finally(()=>clearTimeout(timeout));
    return true;
  }
  if(message.type==='images'){
    if(typeof message.query!=='string'||!message.query.trim()||message.query.length>200){reply({ok:false});return;}
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
    CuriousWikipedia.images(message.query,controller.signal).then(result=>reply({ok:true,result}),()=>reply({ok:false})).finally(()=>clearTimeout(timeout));
    return true;
  }
  // Picture bytes for a page whose CSP blocks Wikimedia images. Only the two Wikimedia image hosts; anonymous CORS (no host permission).
  if(message.type==='image'){
    let url;try{url=new URL(message.url);}catch{reply({ok:false});return;}
    if(!['https://upload.wikimedia.org','https://thumb.wikimedia.org'].includes(url.origin)){reply({ok:false});return;}
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
    fetch(url.origin+url.pathname,{credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal}).then(async res=>{
      const type=(res.headers.get('content-type')||'').split(';')[0].trim();
      if(!res.ok||!/^image\/(jpeg|png|gif|webp|svg\+xml)$/.test(type))throw new Error('Not an image');
      if(+res.headers.get('content-length')>8e6)throw new Error('Too large');
      const bytes=new Uint8Array(await res.arrayBuffer());if(bytes.length>8e6)throw new Error('Too large');
      let bin='';for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
      reply({ok:true,data:'data:'+type+';base64,'+btoa(bin)});
    }).catch(()=>reply({ok:false})).finally(()=>clearTimeout(timeout));
    return true;
  }
  if(message.type!=='explore')return;
  if(!['search','youtube'].includes(message.provider)||typeof message.query!=='string'||!message.query.trim()||message.query.length>200){reply({ok:false});return;}
  (async()=>{
    const {searchProvider='browser'}=await chrome.storage.local.get('searchProvider');
    const provider=message.provider==='youtube'?'youtube':searchProvider;
    const bases={youtube:'https://www.youtube.com/results?search_query=',google:'https://www.google.com/search?q=',duck:'https://duckduckgo.com/?q=',bing:'https://www.bing.com/search?q='};
    if(provider==='browser'){
      if(!chrome.search?.query)throw new Error('Choose a provider once in extension settings.');
      const win=await chrome.windows.create({url:'about:blank',type:'popup',width:720,height:680,focused:true});
      try{const tabs=win.tabs?.length?win.tabs:await chrome.tabs.query({windowId:win.id});await chrome.search.query({text:message.query,tabId:tabs[0].id});}
      catch(error){await chrome.windows.remove(win.id);throw error;}
    }else{
      if(!Object.hasOwn(bases,provider))throw new Error('Unsupported provider');
      await chrome.windows.create({url:bases[provider]+encodeURIComponent(message.query),type:'popup',width:720,height:680,focused:true});
    }
    reply({ok:true});
  })().catch(error=>reply({ok:false,error:error.message}));return true;
});
