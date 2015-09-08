module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      all: ['test/**/*test.js']
    },
    "install-dependencies": {
      options: {
        isDevelopment: true
      }
    },
    exec: {
      coverage: 'node "node_modules/istanbul/lib/cli.js" cover "node_modules/nodeunit/bin/nodeunit" -- test',
	  jsRunDriver: 'node "src/weatherReportDriver.js"',
	  nodeunit: 'nodeunit',
	  coffeeComplie: 'coffee -c "src/weatherReportCoffee.coffee"',
	  coffeeDriverComplie: 'coffee -c "src/weatherReportCoffeeDriver.coffee"',
	  coffeeRunDriver: 'node "src/weatherReportCoffeeDriver.js"',
    }
  });

  grunt.loadNpmTasks('grunt-install-dependencies');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-exec');
  
  grunt.registerTask('coverage', 'exec:coverage');
  grunt.registerTask('nodeunit', 'exec:nodeunit');
  grunt.registerTask('coffeeComplie', 'exec:coffeeComplie');
  grunt.registerTask('coffeeDriverComplie', 'exec:coffeeDriverComplie');
  grunt.registerTask('coffeeRunDriver', 'exec:coffeeRunDriver');
  grunt.registerTask('jsRunDriver', 'exec:jsRunDriver');
  grunt.registerTask('coffeeprogram','exec:coffeeprogram', function() { grunt.file.copy('src/includeCoffee.js', 'src/include.js'); }); 
  grunt.registerTask('revertInclude', function() { grunt.file.copy( 'src/includeRevert.js','src/include.js'); }); 
  grunt.registerTask('default', ['install-dependencies', 'nodeunit', 'coverage', 'jsRunDriver', 'coffeeprogram', 'coffeeComplie', 'nodeunit', 'revertInclude', 'coffeeDriverComplie', 'coffeeRunDriver']);
  
}