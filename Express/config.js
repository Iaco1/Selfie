const mongoCredentials = {
	user: "site242536",
	pwd: "nee0Eiwu",
	site: "mongo_site242536"
}

module.exports = function(remote){
  if(remote) {
    return {
      mongoURI: `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${mongoCredentials.site}:${27017}/admin`,
      port: 27017,
      options: {}
    };
  }else{
    return {
      mongoURI: 'mongodb://localhost:27017/selfie',
      port: 3002,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    };
  }
}
