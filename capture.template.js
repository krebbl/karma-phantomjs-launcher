(function (phantom) {
  var page = require('webpage').create();

  <% if (exitOnResourceError) { %>
  page.onResourceError = function() {
    phantom.exit(1)
  }
  <% } %>

  <% _.forOwn(pageOptions, function(value, key) { %>
  page.<%= key %> = <%= value %>
  <% }) %>

  <% _.forOwn(pageSettingsOptions, function(value, key) { %>
  page.settings.<%= key %> = <%= value %>
  <% }) %>

  page.onConsoleMessage = function () {
      console.log.apply(console, arguments)
  }

  <% if (debug) { %>
  function debugPage() {
    console.log('Launch the debugger page at http://localhost:9000/webkit/inspector/inspector.html?page=2')

    var debuggerWait = 15000
    console.log('Waiting ' + (debuggerWait / 1000) + ' seconds for debugger page to launch...')

    var launchPage = function () {
      console.log('Launching page <%= url %>...')
      page.open('<%= url %>')
    }

    setTimeout(launchPage, 15000)
  }
  debugPage()
  <% } else { %>
  page.open('<%= url %>', function(status){
      if (status === "success") {
      // PhantomJS 2 has a memory consumption problem. This works around it.
      //
      // http://stackoverflow.com/questions/24436460
      // https://github.com/ariya/phantomjs/issues/10357
      // https://github.com/ariya/phantomjs/commit/5768b705a0
      if (page.clearMemoryCache) {
        setInterval(page.clearMemoryCache, 100)
      }
    }
  })
  <% } %>
}(phantom))
