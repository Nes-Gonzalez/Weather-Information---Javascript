var weatherReport = require('../src/include');

var idsString = '2424766\n2379574\n12791565\n2450021';

exports.testCanary = function(test) {
	test.ok(true);
	test.done();
}

exports.testReadFromFile = function(test) {
	
	var checkDataReadFromFile = function (error, data){
		test.equal(data,idsString);
		test.done();	
	}
	
	weatherReport.include.readFile('testInput.txt',checkDataReadFromFile);
}

exports.testInvalidFile = function(test){
	var checkInvalidFilename= function(error , data){
		test.ok(error.errno === -4058 || error.errno === -2);
		test.done();
	}
	weatherReport.include.readFile('wrongFile.txt', checkInvalidFilename);
}

exports.testSortFinalContentCallsDisplayResults = function(test){
	var empty = [];
	weatherReport.include.displayResults= function(){
		test.ok(true);
		test.done();
	}
	weatherReport.include.sortFinalContent(empty);
}

exports.testSortFinalContentSortsCorrectly = function(test){
	preSort = [
	{city: 'A', state: 'B', temp: 1},
	{city: 'C', state: 'A', temp: 1},
	{city: 'A', state: 'C', temp: 1},
	{city: 'B', state: 'A', temp: 1},
	];
	
	postSort = [
	{city: 'A', state: 'B', temp: 1},
	{city: 'A', state: 'C', temp: 1},
	{city: 'B', state: 'A', temp: 1},
	{city: 'C', state: 'A', temp: 1},
	];
	weatherReport.include.displayResults= function(sorted){
		test.deepEqual(sorted,postSort);
		test.done();
	}
	weatherReport.include.sortFinalContent(preSort);
}

exports.testSortFinalContentSortsCorrectlyWithOppositeStateOrder = function(test){
	preSort = [
	{city: 'C', state: 'A', temp: 1},
	{city: 'A', state: 'C', temp: 1},
	{city: 'A', state: 'B', temp: 1},
	{city: 'B', state: 'A', temp: 1},
	];
	
	postSort = [
	{city: 'A', state: 'B', temp: 1},
	{city: 'A', state: 'C', temp: 1},
	{city: 'B', state: 'A', temp: 1},
	{city: 'C', state: 'A', temp: 1},
	];
	weatherReport.include.displayResults= function(sorted){
		test.deepEqual(sorted,postSort);
		test.done();
	}
	weatherReport.include.sortFinalContent(preSort);
}

exports.testParseCity = function (test){
	
	var sampleBody = [];
	weatherReport.include.sortFinalContent =  function(){};
	sampleBody.push({content: 'location city="Houston" region="TX"   country="United States code="30"  temp="91"  date="Fri,'});
	weatherReport.include.parseFinalContent(sampleBody);
	test.equals(weatherReport.include.city, 'Houston');
	test.done();
}

exports.testParseState = function (test){
	
	var sampleBody = [];
	weatherReport.include.sortFinalContent =  function(){};
	sampleBody.push({content: 'location city="Houston" region="TX"   country="United States code="30"  temp="91"  date="Fri,'});
	weatherReport.include.parseFinalContent(sampleBody);
	test.equals(weatherReport.include.state, 'TX');
	test.done();
}

exports.testParseTemp = function (test){
	
	var sampleBody = [];
	weatherReport.include.sortFinalContent =  function(){};
	sampleBody.push({content: 'location city="Houston" region="TX"   country="United States code="30"  temp="91"  date="Fri,'});
	weatherReport.include.parseFinalContent(sampleBody);
	test.equals(weatherReport.include.temp, '91');
	test.done();
}

exports.testParseFinalContentCallsSortFinalContent = function(test){
	var emptyArray = [];
	weatherReport.include.sortFinalContent= function(){
		test.ok(true);
		test.done();
	}
	weatherReport.include.parseFinalContent(emptyArray);
}

exports.testCheckLastServerRequestCallsParseFinalContent = function(test){

	var idsAndData = ['1'];
	var idsWithErrors = ['1'];
	var numberOfIds = 2;

	weatherReport.include.parseFinalContent = function(content){
		test.ok(true);
		test.done()
	}
	weatherReport.include.checkLastServerRequest(idsAndData, idsWithErrors, numberOfIds);

}

exports.testServerRequestSuccessfulStoresData = function(test){
	id = 2424766;
	content = 'Working Body Content';
	
	weatherReport.include.serverRequestSuccessful(id,content);
	
	test.equal(weatherReport.include.idsAndData[0].content, 'Working Body Content' );
	test.done();
}

exports.testServerRequestUnuccessfulStoresData = function(test){
	var id = 'error ID';
	
	
	weatherReport.include.serverRequestError(id);
	
	test.equal(weatherReport.include.idsWithErrors[0], 'error ID' );
	test.done();
}

exports.testCatchServerRequestWithoutError = function(test){	
	
	var id = 2;
	var data = "works";
	
	weatherReport.include.checkLastServerRequest = function() {}
	
	weatherReport.include.serverRequestSuccessful = function(id, data){
		test.ok(true);
		test.done();
	}
	weatherReport.include.checkRequestForError(id, data);
}

exports.testCatchServerRequestWithError = function(test){
	
	var id = 2;
	var data = 'does not work Yahoo! Weather - Error';
	
	weatherReport.include.checkLastServerRequest = function() {}
	
	weatherReport.include.serverRequestError = function(){
		test.ok(true);
		test.done();
	}
	weatherReport.include.checkRequestForError(id, data);
}

exports.testRequestCityWeatherCallsCheckRequestForError= function(test){
	id = 2424766;
	weatherReport.include.checkRequestForError = function(id, data){
		test.ok(true);
		test.done();
	}
	weatherReport.include.requestCityWeather(id)
}

exports.testSplitIDsCallsRequestCityWeather = function(test){
	var idsExpected = [2424766,2379574,12791565,2450021];
	var idsReceived = [];
	var error = " ";
	
	weatherReport.include.requestCityWeather = function(idData){
		idsReceived.push(idData);
	}
	
	weatherReport.include.splitIDs(error, idsString);
	test.deepEqual(idsExpected,idsReceived);
	test.done();
}











