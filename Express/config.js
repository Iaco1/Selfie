const mongoCredentials = {
	user: "site242536",
	pwd: "nee0Eiwu",
	site: "mongo_site242536"
}

module.exports = function(remote){
  if(remote) {
    return {
      mongoURI: `mongodb://${mongoCredentials.site}`,
      port: 8000,
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
