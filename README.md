# Pinger

##### What :
Pinger is a simple node.js app which can periodically ping any of your web-app and keep them alive.

##### Why:
Originally written to workaround Heroku free-dyno limit. If your web-app doesn't receive any web traffic in last 30 minutes, Heroku conviniently puts it on _sleep_ state. The app becomes active whenever it receives the request again, but it takes time to re-initialize. Directly from [Heroku docs](https://devcenter.heroku.com/articles/dyno-sleeping):
> Free dynos will sleep when a web dyno receives no web traffic for a period of time. In addition, if a free dyno exceeds a quota of 18 hours of activity during a 24 hour window, it will be forced to recharge.

##### How:
Simple. It keeps pinging your web-apps(s) after 15 minutes and saves the response. In process, it also makes a request to itself to keep itself alive. Since, it's mandatory for Heroku to sleep for atleast 6 hours in a day, a hook is added to stop the process after 22 UTC.

##### Setup:
* `git clone`
* `npm install`
* `bower install`
* Run sample-app(later, your app) - `node anotherApp.js`
* Runy locally :
  * `npm start`
* Run on production:
  * `heroku create`
  * `heroku config:set PING_URL=https://your-app-to-ping.com`
  * `heroku config:set PINGER_URL=https://your-this-app-url.com`
  * `heroku config:set PROD_MONGODB=monodb://enable-mongoloab-on-heroku`

##### Disclaimer:
Heroku is a great service, and I'm really thankful to them for their free app hosting. That said, I **do not** promote ripping them off. I created it since, I had to keep my app alive for 2 days. They have [Hobby dyno](https://www.heroku.com/pricing) which doesn't have this limitation and is awesome to host small hobby projects. 

