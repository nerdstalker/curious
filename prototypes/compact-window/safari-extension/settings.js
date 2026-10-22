(async()=>{
 const select=document.getElementById('provider'),help=document.getElementById('help'),status=document.getElementById('status');
 const extension=typeof chrome!=='undefined'&&chrome.runtime?.id;
 const supportsDefault=extension&&!!chrome.search?.query;
 if(!supportsDefault){select.options[0].disabled=true;select.options[0].textContent='Browser default unavailable here';select.insertAdjacentHTML('afterbegin','<option value="" disabled>Choose once</option>');}
 help.textContent=supportsDefault?'Search follows this Chrome profile’s default engine. You can override it here; the reading card never asks.':'Safari and this standalone demo cannot use the browser-default search API. Choose a provider here once. The reading card will remember it.';
 try{select.value=extension?(await chrome.storage.local.get('searchProvider')).searchProvider||(supportsDefault?'browser':''):localStorage.getItem('apture-search')||'';}catch{status.textContent='Preferences could not be loaded.';}
 select.onchange=async()=>{try{if(extension)await chrome.storage.local.set({searchProvider:select.value});else localStorage.setItem('apture-search',select.value);status.textContent='Saved. Return to your article to use this setting.';}catch{status.textContent='Could not save this preference. Try again.';}};
})();
