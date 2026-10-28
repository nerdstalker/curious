(async()=>{
 const select=document.getElementById('provider'),help=document.getElementById('help'),status=document.getElementById('status');
 const extension=typeof chrome!=='undefined'&&chrome.runtime?.id;
 const supportsDefault=extension&&!!chrome.search?.query;
 if(!supportsDefault){select.options[0].disabled=true;select.options[0].textContent='Browser default unavailable here';select.insertAdjacentHTML('afterbegin','<option value="" disabled>Choose once</option>');}
 help.textContent=supportsDefault?'Search uses this browser’s default engine. Choose another one here if you like. The card never asks.':extension?'This browser doesn’t let extensions use its default search engine. Choose one here once and Curious will remember it.':'This demo can’t use your browser’s default search engine. Choose one here once and the card will remember it.';
 try{select.value=extension?(await chrome.storage.local.get('searchProvider')).searchProvider||(supportsDefault?'browser':''):localStorage.getItem('curious-search')||'';}catch{status.textContent='Preferences could not be loaded.';}
 select.onchange=async()=>{try{if(extension)await chrome.storage.local.set({searchProvider:select.value});else localStorage.setItem('curious-search',select.value);status.textContent='Saved. Return to your article to use this setting.';}catch{status.textContent='Could not save this preference. Try again.';}};
 if(!extension)return;
 // Sites where Curious turns on by itself. Asking for access happens right in the click, which browsers require; the worker records it.
 // Allow again needs no request: a site skipped while all sites are on is still covered by that access.
 const $=id=>document.getElementById(id),ALL=['http://*/*','https://*/*'];
 const name=site=>{const u=new URL(site.replace(/\*$/,''));return u.protocol==='http:'?'http://'+u.hostname:u.hostname;};
 const send=(op,site)=>chrome.runtime.sendMessage({type:'access',op,site});
 const ask=(origins,then)=>chrome.permissions.request({origins}).then(ok=>ok?then():(status.textContent='Access was not granted. Nothing changed.',null),()=>{status.textContent='This browser didn’t allow the request. Try again.';});
 function row(label,button,act,skip){const li=document.createElement('li'),span=document.createElement('span'),b=document.createElement('button');span.textContent=label;b.type='button';b.textContent=button;b.onclick=act;if(skip)li.className='skip';li.append(span,b);return li;}
 // After a change, show the new list and say what happened; focus moves to the heading if the clicked button went away.
 const done=say=>r=>{if(!r?.ok){status.textContent='That didn’t work. Try again.';return;}render(r);status.textContent=say(r);if(!document.activeElement||document.activeElement===document.body)$('access-title').focus();};
 function render(p){
  const list=$('sites');list.replaceChildren();
  if(p.allSites)list.append(row('All websites','Stop on all sites',()=>send('all-off').then(done(()=>'Curious no longer turns on by itself anywhere. Click its button on a page to use it there.'))));
  for(const s of p.sites){
   const remove=()=>send('site-off',s).then(done(()=>`Removed ${name(s)}. Curious turns on there only when you click its button.`));
   if(!(p.lapsed||[]).includes(s)){list.append(row(name(s),'Remove',remove));continue;}
   // The browser's access to this site ended (for example Safari's Allow for One Day), so Curious is off there until it is allowed again.
   const li=row(name(s)+' (browser access ended, off for now)','Allow again',()=>ask([s],()=>send('site-on',s).then(done(()=>`Curious turns on by itself on ${name(s)} again.`))),true),b=document.createElement('button');
   b.type='button';b.textContent='Remove';b.onclick=remove;li.append(b);list.append(li);
  }
  for(const s of p.skipSites)list.append(row('Not on '+name(s),'Allow again',()=>send('site-on',s).then(done(()=>`Curious turns on by itself on ${name(s)} again.`)),true));
  $('none').hidden=list.children.length>0;$('all').hidden=p.allSites;
 }
 $('access').hidden=false;
 $('all').onclick=()=>ask(ALL,()=>send('all-on').then(done(r=>r.allSites?'Curious now turns on by itself on every site. Reload a page to see it.':'Access was not granted. Nothing changed.')));
 // The worker opens Settings with ?ask=… when a menu click could not ask for access itself.
 const q=new URLSearchParams(location.search),want=q.get('ask'),site=q.get('site');
 if(want==='site'&&site&&/^https?:\/\/[^/]+\/\*$/.test(site)){$('ask').hidden=false;$('ask-text').textContent=`Turn Curious on by itself every time you visit ${name(site)}?`;$('ask-button').textContent=`Always on ${name(site)}`;$('ask-button').onclick=()=>ask([site],()=>send('site-on',site).then(r=>{$('ask').hidden=!!r?.ok;done(()=>`Curious now turns on by itself on ${name(site)}. Reload that page to see it.`)(r);}));}
 else if(want==='all'){$('ask').hidden=false;$('ask-text').textContent='Turn Curious on by itself on every website?';$('ask-button').textContent='On all sites';$('ask-button').onclick=()=>$('all').click();}
 else if(want==='page'){$('ask').hidden=false;$('ask-text').textContent='Curious couldn’t tell which site you were on. Click the Curious toolbar button on that page first, then right-click it and choose Always on this site again.';$('ask-button').hidden=true;}
 try{const r=await send('list');if(r?.ok)render(r);}catch{status.textContent='Sites could not be loaded.';}
 chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&['sites','allSites','skipSites'].some(k=>k in changes))send('list').then(r=>r?.ok&&render(r),()=>{});});
})();
