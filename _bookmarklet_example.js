javascript: (async function() {

    let url = '[THE GITHUB RAW URL OF THE SCRIPT]';
    let script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
    console.log('loading', url, '...');
    await new Promise(resolve => script.addEventListener('load', resolve));
    console.log(url, 'loaded');

})()