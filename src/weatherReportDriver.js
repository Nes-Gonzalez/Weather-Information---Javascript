var weatherReport = require('../src/weatherReport');

weatherReport.readFile('input.txt', weatherReport.splitIDs);

exports.displayResults = function (sortedContent){
	console.log('\nCity		State	Temperature');
	for(n in sortedContent){
		console.log('%s		%s	%s',sortedContent[n].city, sortedContent[n].state, sortedContent[n].temp);
	}
	console.log('\n');
	
}