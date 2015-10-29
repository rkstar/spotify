Package.describe({
  name: 'rkstar:spotify',
  version: '1.0.2',
  // Brief, one-line summary of the package.
  summary: 'An OAuth2 wrapper for the Spotify API',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rkstar/spotify',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2')

  api.use('oauth2')
  api.use('oauth')
  api.use('http', 'server')
  api.use('underscore', 'server')
  api.use('random', 'client')
  api.use('service-configuration')

  api.export('SpotifyService')

  api.addFiles('common.js')
  api.addFiles('client.js', 'client')
  api.addFiles('server.js', 'server')
})