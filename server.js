var OAuth = Package.oauth.OAuth

OAuth.registerService('spotify', 2, null, function(query){
  var response = app.getResponseData(query),
    user = app.getUserData(response.access_token),
    serviceData = _.extend({
      id: user.id,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt: new Date(new Date().getTime() + (response.expires_in * 1000))
    }, _.pick(user, ['display_name', 'email', 'id', 'uri', 'images']))

  return {
    serviceData: serviceData,
    options: {
      profile: {
        name: user.name
      }
    }
  }
})

var app = {
  getResponseData: function(query){
    var config = ServiceConfiguration.configurations.findOne({service: 'spotify'})
    if( !config ){
      throw new ServiceConfiguration.ConfigError('Spotify not configured')
    }

    try {
      var data = HTTP.call('POST', 'https://accounts.spotify.com/api/token', {params:{
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: OAuth._redirectUri('spotify', config),
        code: query.code
      }}).data
    } catch(err){
      throw new Error('Failed to complete OAuth handshake with Spotify. '+err.message)
    }

    if( !data ){
      throw new Error('Failed to complete OAuth handshake with Spotify. '+err.message)
    }

    if( !data.access_token ){
      throw new Error('Failed to complete OAuth handshake with Spotify -- can\'t find access token in HTTP response '+response.content)
    }

    return data
  },

  getUserData: function(access_token){
    var data = HTTP.call('GET','https://api.spotify.com/v1/me',{params:{
      access_token: access_token
    }}).data

    return (data) ? data : {}
  }
}

SpotifyService.retrieveCredential = function(credentialToken, credentialSecret){
  return OAuth.retrieveCredential(credentialToken, credentialSecret)
}