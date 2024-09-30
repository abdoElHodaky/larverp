const mix = require('laravel-mix');
require('laravel-mix-workbox');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        //
    ]).generateSW(
    {
    mode:"development",
	directoryIndex: 'public/',
    exclude: [
          /\.(?:png|jpg|jpeg|svg)$/,
          // Ignore the mix.js that's being generated 
          'mix.js'
      ],
	navigateFallback:"/offline.html",
	runtimeCaching: [
    {
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

              // Apply a cache-first strategy.
        handler: 'CacheFirst',
        options: {
                  // Use a custom cache name.
          cacheName: 'images',
          expiration: {
            maxEntries: 20,
	        maxAgeSeconds: 2 * 24 * 60 * 60,
          }
        }
    },
    {
    urlPattern:/*"https://cdn.*.com/**" */({request, url}) =>url.includes("cdn")==true,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'cdns',
      expiration: {
        maxEntries: 20,
	maxAgeSeconds: 2 * 24 * 60 * 60,
      },
      cacheableResponse:{
	statuses: [0, 200]
      }
    },
  },{
    urlPattern: ({request, url}) => request.method.toLowerCase()=="post",
    handler:"NetworkOnly",
    method:"POST",
    options:{
      cacheName:"apCachePost",
      cacheableResponse:{
	statuses: [0, 200]
      },
      backgroundSync:{
       name:"Apisync",
       options:{
    	maxRetentionTime:24*60*2
       }
      }
    }
  },{
    urlPattern:/*"https://fonts.*.com/**"*/ ({request, url}) =>url.includes("fonts")==true,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'cdns',
      expiration: {
        maxEntries: 20,
	maxAgeSeconds: 2 * 24 * 60 * 60,
      },
      cacheableResponse:{
	statuses: [0, 200]
      }
    }
  }],
   swDest: 'sw.js',  
    skipWaiting: true,
    clientsClaim: true,
   });
