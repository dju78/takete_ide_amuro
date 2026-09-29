async function pollDeploy() {
  const assetUrl = 'https://takete-ide.org/images/celebration-studio/samples/sample-daramola-joseph-omoyele-cutout.png';
  const target = 'https://takete-ide.org/celebration-studio';
  console.log('Polling Netlify deployment for commit f141406 at', target);
  for (let i = 0; i < 30; i++) {
    try {
      const resAsset = await fetch(assetUrl, { cache: 'no-store' });
      const resPage = await fetch(target, { cache: 'no-store' });
      console.log(`[Attempt ${i + 1}] Page Status: ${resPage.status}, New Asset Status: ${resAsset.status}`);
      if (resPage.status === 200 && resAsset.status === 200) {
        console.log('Deploy LIVE! New commit f141406 is verified live on takete-ide.org');
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
