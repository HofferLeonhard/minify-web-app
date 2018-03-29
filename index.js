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
















