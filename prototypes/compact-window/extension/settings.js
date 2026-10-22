(async()=>{
 const select=document.getElementById('provider'),help=document.getElementById('help'),status=document.getElementById('status');
 const extension=typeof chrome!=='undefined'&&chrome.runtime?.id;
 const supportsDefault=extension&&!!chrome.search?.query;
 if(!supportsDefault){select.options[0].disabled=true;select.options[0].textContent='Browser default unavailable here';select.insertAdjacentHTML('afterbegin','<option value="" disabled>Choose once</option>');}
 help.textContent=supportsDefault?'Search uses this browser’s default engine. Choose another one here if you like. The card never asks.':extension?'This browser doesn’t let extensions use its default search engine. Choose one here once and Curious will remember it.':'This demo can’t use your browser’s default search engine. Choose one here once and the card will remember it.';
 try{select.value=extension?(await chrome.storage.local.get('searchProvider')).searchProvider||(supportsDefault?'browser':''):localStorage.getItem('curious-search')||'';}catch{status.textContent='Preferences could not be loaded.';}
 select.onchange=async()=>{try{if(extension)await chrome.storage.local.set({searchProvider:select.value});else localStorage.setItem('curious-search',select.value);status.textContent='Saved. Return to your article to use this setting.';}catch{status.textContent='Could not save this preference. Try again.';}};
})();
