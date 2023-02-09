importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// workbox.routing.registerRoute(
// 	({request}) => request.destination === 'image',
// 	new workbox.strategies.CacheFirst()
// );

self.addEventListener("install", e => {
	console.log("SW install");
	e.waitUntil(
		caches.open('static').then(cache =>{
			return cache.addAll([
			"./static/favicon/logo.png", 
			"./static/js/main.js", 
			"./static/js/dragHandler.js", 
			"./static/js/dom.js", 
			"./static/js/data_handler.js", 
			"./static/js/view/htmlFactory.js", 
			"./static/js/view/domManager.js", 
			"./static/js/data/dataHandler.js", 
			"./static/js/controller/userManager.js", 
			"./static/js/controller/modalManager.js", 
			"./static/js/controller/columnManager.js", 
			"./static/js/controller/cardsManager.js", 
			"./static/js/controller/boardsManager.js", 
			"./static/css/main.css", 
			"./static/css/design.css"]);
		}),
		// caches.open('templates').then(cache =>{
		// 	return cache.addAll([
		// 	"/index.html"]);
		// })
	);
	
});

self.addEventListener("fetch", e => {
	// console.log(`Intercepting ${e.request.url}`);
	e.respondWith (
		caches.match(e.request).then(response => {
			return response || fetch(e.request);
		})
	);
});