importScripts('wikipedia.js');
// The toolbar button toggles the card per tab; its icon and tooltip show whether it is on.
const icons=state=>Object.fromEntries([16,32,48,128].map(n=>[n,`icons/${state}-${n}.png`]));
function showState(tabId,on){
  return Promise.all([chrome.action.setIcon({tabId,path:icons(on?'on':'off')}),chrome.action.setTitle({tabId,title:on?'Curious is on for this page. Click to turn it off.':'Turn on Curious for this page'})]);
}
chrome.action.onClicked.addListener(async tab => {
  try {
    const [{result:wasOn}]=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>{if(!window.__curiousCard)return false;window.__curiousCard.off();return true;}});
    if(!wasOn)await chrome.scripting.executeScript({target:{tabId:tab.id},files:['card.js']});
    await showState(tab.id,!wasOn);
  }
  catch (e) { console.warn('Curious can’t run on this page. Open an ordinary web page and try again.',e.message); }
});
// A reload or new page drops the injected card, so the button goes back to off.
chrome.tabs.onUpdated.addListener((tabId,info)=>{if(info.status==='loading')showState(tabId,false).catch(()=>{});});
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(!sender.tab)return;
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
