// request Spotify creds for the user
SpotifyService.requestCredential = function(options, credentialRequestCompleteCallback){
  // support both( options, callback) and (callback)
  if( !credentialRequestCompleteCallback && (typeof options === 'function') ){
    credentialRequestCompleteCallback = options
    options = {}
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'spotify'})
  if( !config ){
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError('Spotify not configured'))
    return
  }

  var credentialToken = Random.secret()
  // We need to keep credentialToken across the next two 'steps' so we're adding
  // a credentialToken parameter to the url and the callback url that we'll be returned
  // to by oauth provider
  // Force the user to approve the app every time (similar to Google's `approval_prompt`).

  // set default options values
  var requiredPermissions = ['user-read-email']
  _.defaults(options,{
    forceApprove: false,
    permissions: requiredPermissions
  })
  options.permissions = _.union(options.permissions, requiredPermissions)

  var loginStyle = OAuth._loginStyle('spotify', config, options)
  var loginUrl = 'https://accounts.spotify.com/authorize'+
    '?response_type=code'+
    '&client_id='+config.clientId+
    '&redirect_uri='+OAuth._redirectUri('spotify', config)+
    '&state='+OAuth._stateParam(loginStyle, credentialToken)+
    '&scope='+options.permissions.join('%20')+
    '&showDialog='+options.forceApprove

  OAuth.launchLogin({
    loginService: 'spotify',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  })
}