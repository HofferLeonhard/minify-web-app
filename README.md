<<<<<<< HEAD
# minify-web-app
Minify your Web application by minifying all html, css and js files inside it.

[![NPM version](https://img.shields.io/npm/v/minify-web-app.svg)](https://www.npmjs.com/package/minify-web-app)

## How to use

#### Install dependencies

install all npm dependencies by typing the following command at the root level of the project

```bash
npm install 
```


#### Set configurations into a config.json file

Set congifs app initialisation by setting :

	##### The input projet folder 
    	set the path of the project to minify
        
	##### The output projet folder 
    	set the path of the minified projet. It is in this folder you will get the result

#### Run the app

Then, to run app, you just have to run command :

```bash
node index.js
```

This will show you the results of the operations performed


#### Where to get the result
The minified project is stored into a "outputDir" path setting in the config.json file, you just have to enjoy it !.

##### NB :
Minify only one project at a time


## License

[MIT](LICENSE)


=======
# minify-web-app
Minify your Web application by minifying all html, css, scss and js files inside it.

[![NPM version](https://img.shields.io/npm/v/minify-web-app.svg)](https://www.npmjs.com/package/minify-web-app)

## How to use

### 1 - By Using Nodejs
#### Install dependencies

install all npm dependencies by typing the following command at the root level of the project

	npm install 


#### Run the app

Then, to run app, you just have to run command :

	node index.js

You will be ask to enter two informations here :

	- The project absolute path (for example : c:\path\to\your\project)
	- The absolute path of where to store result (for example : c:\path\to\where\to\store\result)

When you validate these informations you have the opérations results showing in your console.


### 2 - By Using minify-web-app.exe
This is stored into a <strong>dist</strong> directory, open it, decompress the zip file (dist.zip) inside

They are two versions here :

	- x64 for all system 64 bits
	- x86 for all system 86 bits

And three files in all versions :

	- minify-web-app-win.exe for windows system users
	- minify-web-app-macos for macos system users
	- minify-web-app-linux for linux system users

Run the appropriate file version for your system.

Now, you just have to enter two informations here :

	- The project absolute path (for example : c:\path\to\your\project)
	- The absolute path of where to store result (for example : c:\path\to\where\to\store\result)

When you validate these informations you have the opérations results showing in the window.


##### NB :
Minify only one project at a time


## License

[MIT](LICENSE)


>>>>>>> New commit after changes
Enjoy it !