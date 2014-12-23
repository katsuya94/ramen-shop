module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: ['vendor/*.js', 'src/*.js'],
                dest: 'dist/ramen.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat']);
}
