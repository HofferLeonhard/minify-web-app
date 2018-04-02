<<<<<<< HEAD
var browseDir = require("browse-directory");
var auth_extensions = ["html", "css", "scss", "js"];
var fs = require('fs');
var minify = require('html-minifier').minify;
var UglifyJS = require("uglify-js");
var path    = require("path");
var pathName = __dirname;
var config;

getConfig();
function getConfig(){
	console.log("**** Getting configs .... ****");
	fs.readFile(path.join(pathName+'/config.json'),{"encoding":"utf8","flag":"a+"}, function (err, data) {
	   if (err) {
	   		console.log(" Erreur de lecture du fichier de configuration : "+err);
	   }
	   else{
	   		var validate = false;

			try{
	            config = JSON.parse(data.toString());
	            validate = true;
	        }catch(err){ 
	        	validate = false;
	        	console.log(" Erreur dans le fichier de configuration, veuillez corriger la structure JSON");
	        }

	        try{
		        var filesTree = browseDir.browse(path.join(config.inputDir.path));
				validate = validate==true?true:false;
		    }catch(err){ 
		    	validate = false;
		    	console.log(" Erreur : impossible d'accéder au repertoire d'entrée: "+config.inputDir.path);
		    }

	        try{
		        browseDir.browse(path.join(config.outputDir.path));
		        validate = validate==true?true:false;
		    }catch(err){ 
		    	validate = false;
		    	console.log(" Erreur : impossible d'accéder au repertoire de sortie : "+config.outputDir.path);
		    }

		    if(validate){
		    	minifyThis(filesTree, 0, 0);
		    }
	        
	   }
	   
	});
}



function minifyThis(filesTree, id, i){
	if(filesTree[Object.keys(filesTree)[id]] && filesTree[Object.keys(filesTree)[id]][i]){
		var file = filesTree[Object.keys(filesTree)[id]][i];
			extension = file.name.split(".").length>1?file.name.split(".")[file.name.split(".").length-1]:"doc";

			if(extension=="doc"){
				var fileDest = file.src.replace(new RegExp(config.inputDir.path, 'g') , config.outputDir.path);
				
				fs.mkdir(fileDest, 0o777, (err) => {
					if (err) 
						console.log("----> Folder exist")
				    else
				   		console.log("----> Folder created successfully");

				   	if(id <= Object.keys(filesTree).length-1){
				   		if(i < filesTree[Object.keys(filesTree)[id]].length-1)
				   			minifyThis(filesTree, id, i+1);
				   		else
				   			minifyThis(filesTree, id+1, 0);
				   	}
				});
			}
			if(auth_extensions.indexOf(extension) >= 0){
				
				fs.readFile(filesTree[Object.keys(filesTree)[id]][i].src, {"encoding":"utf8","flag":"a+"}, function (err, data) {
				   if (err) {
				   		console.log("Connot read file content");
				   }
				   else{
				   		if(extension != "js"){
				   			var minify_result = minify(data, {
									  removeAttributeQuotes: false,
									  removeEmptyAttributes : true,
									  removeTagWhitespace : false,
									  collapseWhitespace:true,
									  minifyCSS:true,
									  minifyJS:true
									});
				   		}
				   		else{
				   			var result = UglifyJS.minify(data);
				   				minify_result = result.code;
				   		}

				   		var fileDest = file.src.replace(new RegExp(config.inputDir.path, 'g') , config.outputDir.path);

				   		if(file.type == "file"){
					   		fs.writeFile(fileDest, minify_result, (err) => {
								if (err) 
									console.log("----> Connot create file : "+fileDest);
							    else
							   		console.log("----> File created successfully");
					
							   	if(id <= Object.keys(filesTree).length-1){
							   		if(i < filesTree[Object.keys(filesTree)[id]].length-1)
							   			minifyThis(filesTree, id, i+1);
							   		else
							   			minifyThis(filesTree, id+1, 0);
							   	}
							});

						}

				   }
				   
				});

			}
			else if(file.type == "file"){
				var fileDest = file.src.replace(new RegExp(config.inputDir.path, 'g') , config.outputDir.path);
				fs.copyFile(file.src, fileDest, (err) => {
					if (err) 
						console.log("----> Connot copy file : "+fileDest);
				    else
				   		console.log("----> Copy file successfully");
		
				   	if(id <= Object.keys(filesTree).length-1){
				   		if(i < filesTree[Object.keys(filesTree)[id]].length-1)
				   			minifyThis(filesTree, id, i+1);
				   		else
				   			minifyThis(filesTree, id+1, 0);
				   	}
				});

			}
	}
}
















=======
var app = {
	browseDir : require("browse-directory"),
	fs : require('fs'),
	minify : require('html-minifier').minify,
	UglifyJS : require("uglify-js"),
	path    : require("path"),
	readline : require('read-console'),
	logger : require("customise-log"),
	pathName : __dirname,
	auth_extensions : ["html", "css", "scss", "js"],
	config : {inputDir:{path:""},outputDir:{path:""}},

	init : function(){
		var $this = this;

		$this.logger.log("\n\n ##### Welcome, you can minify your web project by following the next steps ##### \n\n");
		$this.getConfigs("inputDir");

	},

	getConfigs : function(type){
		var $this = this;

			if(type == "inputDir"){
				$this.logger.log("# Enter your Project path (exp: c:\\path\\to\\your\\project) ");
				$this.readline.read(' > ', (answer) => {
					try{
				  		$this.fs.readdirSync(answer);
				  		$this.config.inputDir.path = answer;
				  		$this.getConfigs("outputDir");
				  	}catch(err){
				  		$this.logger.error("\n "+"ENOENT: no such file or directory, "+answer);
				  		$this.logger.warn("Help : Enter a valid Project path \n");
				  		$this.getConfigs("inputDir");
				  	}
				});
			}
			else{
				$this.logger.log("\n # Enter path where to store result (exp: c:\\path\\to\\where\\to\\store\\result)");
				$this.readline.read(' > ', (answer) => {
				  	try{
				  		$this.fs.readdirSync(answer);
				  		$this.config.outputDir.path = answer;

				  		var filesTree = $this.browseDir.browse($this.path.join($this.config.inputDir.path));

				  		$this.minifyThis(filesTree, 0, 0);

				  	}catch(err){
				  		$this.logger.error("\n "+"ENOENT: no such file or directory, "+answer);
				  		$this.logger.warn("Help : Enter a valid result path \n");
				  		$this.getConfigs("outputDir");
				  	}
				});
			}
			
	},

	minifyThis : function(filesTree, id, i){
		var $this = this;

		if(filesTree[Object.keys(filesTree)[id]] && filesTree[Object.keys(filesTree)[id]][i]){

			try{
				var file = filesTree[Object.keys(filesTree)[id]][i];
				extension = file.name.split(".").length>1?file.name.split(".")[file.name.split(".").length-1]:"doc";

				if(extension=="doc"){
					// var fileDest = file.src.replace(new RegExp($this.config.inputDir.path, 'g') , $this.config.outputDir.path);
					var fileDest = $this.path.join($this.config.outputDir.path, file.src.split("/")[file.src.split("/").length-1]);
					$this.fs.mkdir(fileDest, 0o777, (err) => {
						if (err) 
							$this.logger.info("----> Folder exist")
					    else
					   		$this.logger.success("----> Created Folder successfully");

					   	if(id <= Object.keys(filesTree).length-1){
					   		if(i < filesTree[Object.keys(filesTree)[id]].length-1)
					   			$this.minifyThis(filesTree, id, i+1);
					   		else
					   			$this.minifyThis(filesTree, id+1, 0);
					   	}
					});
				}
				if($this.auth_extensions.indexOf(extension) >= 0){
					
					$this.fs.readFile(filesTree[Object.keys(filesTree)[id]][i].src, {"encoding":"utf8","flag":"a+"}, function (err, data) {
					   if (err) {
					   		$this.logger.error("\nConnot read file content");
					   }
					   else{
					   		if(extension != "js"){
					   			var minify_result = $this.minify(data, {
										  removeAttributeQuotes: false,
										  removeEmptyAttributes : true,
										  removeTagWhitespace : false,
										  collapseWhitespace:true,
										  minifyCSS:true,
										  minifyJS:true
										});
					   		}
					   		else{
					   			var result = $this.UglifyJS.minify(data);
					   				minify_result = result.code;
					   		}

					   		// var fileDest = file.src.replace(new RegExp($this.config.inputDir.path, 'g') , $this.config.outputDir.path);
					   		var fileDest = $this.path.join($this.config.outputDir.path, file.src.split("/")[file.src.split("/").length-1]);
					   		if(file.type == "file"){
						   		$this.fs.writeFile(fileDest, minify_result, (err) => {
									if (err) 
										$this.logger.error("\n----> Connot create file : "+fileDest);
								    else
								   		$this.logger.success("----> Created File successfully");
						
								   	if(id <= Object.keys(filesTree).length-1){
								   		if(i < filesTree[Object.keys(filesTree)[id]].length-1)
								   			$this.minifyThis(filesTree, id, i+1);
								   		else
								   			$this.minifyThis(filesTree, id+1, 0);
								   	}
								});

							}

					   }
					   
					});

				}
				else if(file.type == "file"){
					// var fileDest = file.src.replace(new RegExp($this.config.inputDir.path, 'g') , $this.config.outputDir.path);
					var fileDest = $this.path.join($this.config.outputDir.path, file.src.split("/")[file.src.split("/").length-1]);
					// console.log("inputDir : "+$this.config.inputDir.path+"   outputDir : "+$this.config.outputDir.path+"   file : "+file.src+"   fileDest : "+fileDest);
					$this.fs.copyFile(file.src, fileDest, (err) => {
						if (err) 
							$this.logger.error("\n----> Connot copy file : "+fileDest+"  error : "+err);
					    else
					   		$this.logger.success("----> Copy File successfully");
			
					   	if(id <= Object.keys(filesTree).length-1){
					   		if(i < filesTree[Object.keys(filesTree)[id]].length-1)
					   			$this.minifyThis(filesTree, id, i+1);
					   		else
					   			$this.minifyThis(filesTree, id+1, 0);
					   	}
					});

				}

			}catch(err){
	  			$this.logger.error("Error : "+err);
	  			$this.pause();
			}
		}
		else{
			$this.pause();
		}
	},

	pause : function(){
		var $this = this;

		$this.logger.info('\n Your project has been minified properly ');
		$this.logger.log('\n Stored result into :  '+$this.config.outputDir.path);
		$this.logger.log('\n\n Thanks !');
		$this.logger.log('By Hoffer Ouandi get more at https://github.com/HofferLeonhard/ ');
		$this.logger.log('\n\n Press any key to exit');

		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.on('data', process.exit.bind(process, 0));
	}
}

app.init();
>>>>>>> New commit after changes
