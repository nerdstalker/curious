// Public Wikipedia summaries and article images only. Never accept an arbitrary URL from a page.
(() => {
  const endpoint = 'https://en.wikipedia.org';
  async function request(url, signal) {
    const response = await fetch(url, {signal, credentials:'omit', referrerPolicy:'no-referrer'});
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Wikipedia is unavailable.');
    const data = await response.json();
    if (!data || typeof data !== 'object' || data.error) throw new Error('Wikipedia returned an unexpected response.');
    return data;
  }
  function shorten(text) {
    const clean = text.replace(/\s+/g,' ').trim();
    if (typeof Intl.Segmenter === 'function') {
      let excerpt = '', count = 0;
      for (const {segment} of new Intl.Segmenter('en',{granularity:'sentence'}).segment(clean)) {
        if (count >= 2 || (excerpt + segment).length > 420) break;
        excerpt += segment; count++;
      }
      if (excerpt.trim()) return excerpt.trim();
    }
    return clean.length <= 420 ? clean : clean.slice(0,420).replace(/\s+\S*$/,'') + '…';
  }
  // Resolves a reader's term to one article: exact title (following redirects), else the top search match.
  async function resolve(query, signal) {
    if (typeof query !== 'string' || !query.trim() || query.length > 200) throw new Error('Enter a concept of 200 characters or fewer.');
    const term = query.trim();
    const summary = title => request(endpoint+'/api/rest_v1/page/summary/'+encodeURIComponent(title.replace(/ /g,'_')),signal);
    let data = await summary(term[0].toUpperCase()+term.slice(1));
    let matched = false;
    if (!data) {
      const params = new URLSearchParams({action:'query',list:'search',srsearch:term,srnamespace:'0',srlimit:'1',srprop:'',format:'json',formatversion:'2',origin:'*'});
      const search = await request(endpoint+'/w/api.php?'+params,signal);
      const title = search?.query?.search?.[0]?.title;
      if (!title) return null;
      data = await summary(title); matched = true;
    }
    if (!data || typeof data.title !== 'string') return null;
    return {data, matched, title:data.title.slice(0,250), url:endpoint+'/wiki/'+encodeURIComponent(data.title.replace(/ /g,'_'))};
  }
  async function lookup(query, signal) {
    const found = await resolve(query, signal);
    if (!found || typeof found.data.extract !== 'string' || !found.data.extract.trim()) return {kind:'empty'};
    // Construct links from the fixed Wikipedia origin rather than trusting returned URLs.
    return {kind:found.data.type==='disambiguation'?'ambiguous':'excerpt',title:found.title,extract:shorten(found.data.extract),url:found.url,matched:found.matched};
  }
  // Commons-hosted media are returned only from fixed Wikimedia image hosts, as plain text credits.
  const imageHosts = ['https://upload.wikimedia.org','https://thumb.wikimedia.org'];
  function imageUrl(value) {
    try { const u = new URL(value); return imageHosts.includes(u.origin) ? u.origin+u.pathname : null; } catch { return null; }
  }
  function plain(html, max) {
    if (typeof html !== 'string') return '';
    const named = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
    const text = html.replace(/<[^>]*>/g,' ').replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi,(m,e)=>e[0]==='#'?String.fromCodePoint(parseInt(e[1]==='x'||e[1]==='X'?e.slice(2):e.slice(1),e[1]==='x'||e[1]==='X'?16:10)||32):(named[e.toLowerCase()]??m)).replace(/\s+/g,' ').trim();
    return text.length <= max ? text : text.slice(0,max-1).replace(/\s+\S*$/,'')+'…';
  }
  async function images(query, signal) {
    const found = await resolve(query, signal);
    if (!found) return {kind:'empty'};
    const base = {title:found.title,url:found.url,matched:found.matched};
    if (found.data.type === 'disambiguation') return {...base,kind:'ambiguous'};
    // The article's own media, in reading order, are more relevant than a free-text Commons search.
    const list = await request(endpoint+'/api/rest_v1/page/media-list/'+encodeURIComponent((found.data.titles?.canonical||found.data.title).replace(/ /g,'_')),signal);
    const candidates = (Array.isArray(list?.items)?list.items:[]).filter(i=>i?.type==='image'&&i.showInGallery!==false&&typeof i.title==='string'&&/^File:/.test(i.title)).slice(0,12);
    if (!candidates.length) return {...base,kind:'empty'};
    const params = new URLSearchParams({action:'query',titles:candidates.map(i=>i.title).join('|'),prop:'imageinfo',iiprop:'url|size|mime|extmetadata',iiurlwidth:'960',iiextmetadatafilter:'Artist|Credit|LicenseShortName|LicenseUrl',format:'json',formatversion:'2',origin:'*'});
    const info = await request(endpoint+'/w/api.php?'+params,signal);
    const norm = name => name.replace(/_/g,' ');
    const pages = new Map((Array.isArray(info?.query?.pages)?info.query.pages:[]).map(p=>[norm(p.title||''),p]));
    const items = [];
    for (const c of candidates) {
      const page = pages.get(norm(c.title)), ii = page?.imageinfo?.[0];
      if (!ii || !/^image\/(jpeg|png|gif|webp|svg\+xml|tiff)$/.test(ii.mime) || Math.max(ii.width||0,ii.height||0) < 120) continue;
      const full = imageUrl(ii.thumburl||ii.url); if (!full) continue;
      const thumb = full.replace(/\/\d+px-([^/]+)$/,'/330px-$1');
      const meta = ii.extmetadata || {}, file = norm(c.title).slice(5);
      const licenseUrl = /^https:\/\//.test(meta.LicenseUrl?.value||'') ? meta.LicenseUrl.value : '';
      items.push({
        thumb: ii.width > 330 ? thumb : full, full,
        caption: plain(c.caption?.text,240).replace(/\s*\[\d+\]/g,'') || file.replace(/\.[a-z0-9]+$/i,'').slice(0,200), file: file.slice(0,200),
        artist: plain(meta.Artist?.value||meta.Credit?.value,80) || 'Unknown author',
        license: plain(meta.LicenseShortName?.value,40) || 'See file page', licenseUrl,
        source: (page.imagerepository==='local'?endpoint:'https://commons.wikimedia.org')+'/wiki/File:'+encodeURIComponent(file.replace(/ /g,'_')),
        width: ii.thumbwidth||ii.width, height: ii.thumbheight||ii.height
      });
      if (items.length === 6) break;
    }
    return items.length ? {...base,kind:'images',items} : {...base,kind:'empty'};
  }
  globalThis.CuriousWikipedia = {lookup, images};
})();
