async function pollDeploy() {
  const target = 'https://takete-ide.org/celebration-studio';
  console.log('Polling Netlify deployment for', target);
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(target, { cache: 'no-store' });
      console.log(`[Attempt ${i + 1}] Status: ${res.status}`);
      if (res.status === 200) {
        const text = await res.text();
        const hasStudio = text.includes('Takete-Ide Centenary Celebration Studio') || text.includes('Celebration Studio');
        console.log('Deploy LIVE! Studio page verified:', hasStudio);
        return true;
      }
    } catch (e) {
      console.log(`[Attempt ${i + 1}] Error:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
  return false;
}

pollDeploy().then((success) => {
  if (!success) {
    console.log('Deployment still building or pending.');
  }
});
