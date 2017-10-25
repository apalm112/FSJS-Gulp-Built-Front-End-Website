# Gulp-to-Build-A-Front-End-Website

**********************************************************
The build process must fulfill the following criteria:
	* Concatenate and minify the JavaScript files
	* Compile SCSS into CSS in a concatenated and minified file
	* Generate JavaScript and CSS source maps
	* Compress any JPEG or PNG files
	* All output for the build process should be in a dist folder for distribution or deployment.

icons directory -- you can ignore this folder in your build process, but you will need to copy this folder over to the dist directory for the final build
***********************************************************


TODO: 8 steps:

1)DONE  As a developer, I should be able to run the npm install command to install all of the dependencies for the build process.

2)DONE  As a developer, I should be able to run the gulp scripts command at the command line to concatenate, minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder.

3)DONE  As a developer, I should be able to run the gulp styles command at the command line to compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file that is then copied to the dist/styles folder.

4)DONE  As a developer, when I run the gulp scripts or gulp styles commands at the command line, source maps are generated for the JavaScript and CSS files respectively.

5)DONE  As a developer, I should be able to run the gulp images command at the command line to optimize the size of the project’s JPEG and PNG files, and then copy those optimized images to the dist/content folder.

6)DONE  As a developer, I should be able to run the gulp clean command at the command line to delete all of the files and folders in the dist folder.

7)DONE  As a developer, I should be able to run the gulp build command at the command line to run the clean, scripts, styles, and images tasks with confidence that the clean task completes before the other commands.

8)DONE  As a developer, I should be able to run the gulp command at the command line to run the build task and serve my project using a local web server.

Extra Credit

To get an "exceeds" rating, you can expand on the project in the following ways:
 1 step
		As a developer, when I run the default gulp command, it should continuously watch for changes to any .scss file in my project. When there is a change to one of the .scss files, the gulp styles command is run and the files are compiled, concatenated, and minified to the dist folder. My project should then reload in the browser, displaying the changes.


Build Process Dependencies
	Running the npm install command installs the build process dependencies properly

Scripts Task
	The gulp scripts command concatenates, minifies, and copies all of the project’s JavaScript files into an all.min.js file
	The command copies the all.min.js file into the dist/scripts folder

Styles Task
	The gulp styles command compiles the project’s SCSS files into CSS, and concatenates and minifies into an all.min.css file
	The command copies the all.min.css file into the dist/styles folder

Source Maps
	The gulp scripts command generates JavaScript source maps
	The gulp styles command generates CSS source maps

Images Task
The gulp images command copies the optimized images to the dist/content folder.

Clean Task
	The gulp clean command deletes all of the files and folders in the dist folder.

Build Task
	The gulp build command properly runs the clean, scripts, styles, and images tasks.
	The clean task fully completes before the scripts, styles, and images tasks are ran.

Default Task
	The gulp command properly runs the build task as a dependency
	The gulp command serves the project using a local webserver.
	Exceeds:
			The gulp command also listens for changes to any .scss file. When there is a change to any .scss file, the gulp styles command is run, the files are compiled, concatenated and minified to the dist folder, and the browser reloads, displaying the changes
