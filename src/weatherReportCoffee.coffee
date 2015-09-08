
numberOfIds = 0
idsAndData = []
idsWithErrors = []

exports.idsAndData = idsAndData;
exports.idsWithErrors = idsWithErrors
exports.numberOfIds = numberOfIds
exports.city 
exports.state;


exports.readFile = ( file, callback) ->
	fs = require 'fs'
	fs.readFile file, 'utf8', callback	

exports.splitIDs = (error, data) ->
	idsFromData = data.split '\n'
	numberOfIds = idsFromData.length
	for id in idsFromData
		exports.requestCityWeather id

exports.requestCityWeather = (id) ->
	http = require('http')
	url = "http://weather.yahooapis.com/forecastrss?w=" + id + "&u=f"
	collectBody =(response) ->
		data = ''
		
		combineChunk = (chunkPart)->
			data += chunkPart
		
		SendToCheck = () ->
			exports.checkRequestForError(id, data)
		
		response.on 'data', combineChunk
		response.on 'end', SendToCheck
		
	http.get url, collectBody
	
exports.checkRequestForError = (id, data) ->
	index = data.indexOf 'Yahoo! Weather - Error'
	
	if index >= 0
		exports.serverRequestError id
	else
		exports.serverRequestSuccessful id, data
	exports.checkLastServerRequest idsAndData, idsWithErrors, numberOfIds
	
exports.serverRequestSuccessful = (id, serverOutput) ->
	idsAndData.push {theId: id, content: serverOutput}
	
exports.serverRequestError = (id) ->
	idsWithErrors.push id
	
exports.checkLastServerRequest = (withData,withErrors,TotalIds) ->
	if withData.length + withErrors.length == TotalIds
		exports.parseFinalContent(idsAndData)
	
exports.parseFinalContent = (content) ->
	finalContent = []
	
	for n in content 
		city = n.content.substring n.content.indexOf('city="') + 6, n.content.indexOf '" region='
		state = n.content.substring n.content.indexOf('region="') + 8, n.content.indexOf '"   country'
		temp = n.content.substring n.content.indexOf('temp="') + 6, n.content.indexOf '"  date'
		finalContent.push {city: city, state: state, temp: temp} 
	exports.city = city;
	exports.state = state;
	exports.temp = temp;
	exports.sortFinalContent finalContent
	
exports.sortFinalContent = (contentToSort) ->
	sorter = (a,b) ->
		if a.city < b.city
			return -1;
		else if a.city > b.city
			return 1;
		else
			if a.state < b.state
				return -1;
			else if a.state > b.state
				return 1;
	contentToSort.sort sorter
	exports.displayResults contentToSort

exports.displayResults = (sortedContent) ->
	weatherReportCoffeeDriver = require '../src/weatherReportCoffeeDriver'
	weatherReportCoffeeDriver.displayResults sortedContent