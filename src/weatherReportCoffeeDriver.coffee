weatherReportCoffee = require '../src/weatherReport'

weatherReportCoffee.readFile 'input.txt', weatherReportCoffee.splitIDs

exports.displayResults = (sortedContent) ->
	console.log '\nCity		State	Temperature'
	for n in sortedContent
		console.log '%s		%s	%s \n',n.city, n.state, n.temp