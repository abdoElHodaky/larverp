
//import {Workbox} from "workbox-window";
exports = registerSW=()=>{
if ("serviceWorker" in navigator) { 
    const  {Workbox}=require("workbox-window");
    const wb = new Workbox('/sw.js');

wb.addEventListener('activated', event => {
  // `event.isUpdate` will be true if another version of the service
  // worker was controlling the page when this version was registered.
  if (!event.isUpdate) {
    console.log('Service worker activated for the first time!');
    // If your service worker is configured to precache assets, those
    // assets should all be available now.
  }
    const urlsToCache = [
    location.href,
    ...performance.getEntriesByType('resource').map(r => r.name),
  ];
  // Send that list of URLs to your router in the service worker.
  wb.messageSW({
    type: 'CACHE_URLS',
    payload: {urlsToCache},
  });
});
wb.addEventListener('message', event => {
  if (event.data.type === 'CACHE_UPDATED') {
    const {updatedURL} = event.data.payload;

    console.log(`A newer version of ${updatedURL} is available!`);
  }
});
// Register the service worker after event listeners have been added.
wb.register();
/*
setTimeout(()=>{
 navigator.serviceWorker.register('/sw.js').then(d=>{
     console.log("Worker Registration Successful",d)
 }).catch(console.log);
},10000)
*/
    installPWA()
  } else {
     console.error("Service workers are not supported.");
  }

    window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();

        // Stash the event so it can be triggered later.
        window.deferredPrompt = e;
        console.log("Registerd event");
        // Update UI notify the user they can install the PWA
        window.localStorage.setItem("pwainstalled", "false");
        //this.showInstallPromotion();
    });
    window.addEventListener("appinstalled", (evt) => {
        // Log install to analytics
        console.log("INSTALL: Success");
        window.localStorage.setItem("pwainstalled", "true");
    });

    function installButtonDisplay() {
        var btn = document.createElement("BUTTON");
        btn.setAttribute("id", "install-button");
        btn.innerHTML = "Download LSM-App";
        btn.setAttribute("class","bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center")
        btn.onclick = function() {
          installPWA();
        }
        document.querySelector("#auth").appendChild(btn);
    }
    function installPWA() {
        if (window.deferredPrompt) {
            console.log("inside window.deferredPromp if condition");
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
               if (choiceResult.outcome === "accepted") { 
                  removeButton();                   
                  console.log("User accepted the install prompt");
               } else {
                  isInstalledState(false);
                  console.log("User dismissed the install prompt");
               }
           });
        }
    }
    function removeButton() {
        var elem = document.getElementById('install-button');
        elem.parentNode.removeChild(elem);
    }

}
