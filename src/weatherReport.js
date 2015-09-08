
var numberOfIds = 0;
var idsAndData = [];
var idsWithErrors = [];

exports.idsAndData = idsAndData;
exports.idsWithErrors = idsWithErrors;
exports.numberOfIds = numberOfIds;
exports.city 
exports.state;


exports.readFile = function(file, callback) {
	var fs = require('fs');
	fs.readFile(file, 'utf8', callback);
}

exports.splitIDs = function(error, data){
	var idsFromData = data.split('\n');
	numberOfIds = idsFromData.length;
	idsFromData.forEach(exports.requestCityWeather);
}

exports.requestCityWeather = function (id){
	var http = require('http');
	var url = "http://weather.yahooapis.com/forecastrss?w=" + id + "&u=f";
	
	var collectBody = function(response){
		var data = '';

		var combineChunk = function(chunkPart){
			data += chunkPart;
		}
		
		var SendtoCheck = function(){
			exports.checkRequestForError(id,data)
		}
		
		response.on('data',combineChunk);
		response.on('end',SendtoCheck );
	}
	
	http.get(url,collectBody)
}

exports.checkRequestForError = function(id, data){
	if(data.indexOf('Yahoo! Weather - Error') >= 0) {
		exports.serverRequestError(id);
	}
	else {
		exports.serverRequestSuccessful(id, data);
	}
	exports.checkLastServerRequest(idsAndData, idsWithErrors, numberOfIds);
}

exports.serverRequestSuccessful = function(id, serverOutput ){
	idsAndData.push({theId: id, content: serverOutput});
}

exports.serverRequestError = function (id){
	idsWithErrors.push(id);
}

exports.checkLastServerRequest = function(withData,withErrors,TotalIds){
	if(withData.length + withErrors.length == TotalIds){
		exports.parseFinalContent(idsAndData);
	}
}

exports.parseFinalContent = function(content){
	var finalContent = [];
	
	for(n in content){
		var city = content[n].content.substring(content[n].content.indexOf('city="') + 6, content[n].content.indexOf('" region='));
		var state = content[n].content.substring(content[n].content.indexOf('region="') + 8, content[n].content.indexOf('"   country'));
		var temp = content[n].content.substring(content[n].content.indexOf('temp="') + 6, content[n].content.indexOf('"  date'));
		finalContent.push({city: city, state: state, temp: temp});
	}
	exports.city = city;
	exports.state = state;
	exports.temp = temp;
	exports.sortFinalContent(finalContent);
}	

exports.sortFinalContent = function(contentToSort){
	var sorter = function(a,b){
		if(a.city < b.city)
			return -1;
		else if(a.city > b.city)
			return 1;
		else
			if(a.state < b.state)
				return -1;
			else if(a.state > b.state)
				return 1;
	}
	
	contentToSort.sort(sorter);
	exports.displayResults(contentToSort);
}

exports.displayResults = function (sortedContent){
	var weatherReportDriver = require('../src/weatherReportDriver');
	weatherReportDriver.displayResults(sortedContent);
}


