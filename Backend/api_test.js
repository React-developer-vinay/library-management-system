(async ()=>{
  const base = 'http://localhost:5000/api';
  const log = (tag,data)=> console.log('---',tag,'---', typeof data === 'string' ? data : JSON.stringify(data,null,2));
  try{
    // login
    const resp = await fetch(base + '/auth/login',{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username:'admin', password:'admin123'})
    });
    const js = await resp.json();
    log('login status', resp.status);
    log('login body', js);
    if(!js.token){
      console.error('No token returned, aborting tests');
      process.exit(1);
    }
    const token = js.token;

    // helper for authenticated GET
    async function aget(path){
      const r = await fetch(base + path, { headers: { Authorization: `Bearer ${token}` } });
      const body = await r.text();
      let parsed;
      try{ parsed = JSON.parse(body);}catch(e){ parsed = body }
      log(path, {status: r.status, body: parsed});
    }

    await aget('/books/stats');
    await aget('/books');
    await aget('/students');
    await aget('/issues');
    await aget('/issues/history');

    console.log('API tests completed');
    process.exit(0);
  }catch(err){
    console.error('TEST ERROR', err);
    process.exit(2);
  }
})();
