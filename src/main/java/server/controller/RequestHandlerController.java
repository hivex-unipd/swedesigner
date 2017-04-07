package server.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import server.compiler.java.JavaCompiler;
import server.generator.Generator;
import server.generator.java.JavaGenerator;
import server.parser.Parser;
import server.project.ParsedProgram;
import server.utility.Compressor;

public class RequestHandlerController {
	String json;
	/*@Autowired
	@Qualifier("javagenerator")*/
	Generator generator = new JavaGenerator();
	
	public RequestHandlerController(String json){
		this.json = json;
	}
	public void HandleGeneratorRequest(){
		List<String> errors = new ArrayList<String>();
		Parser parser = new Parser();
		ParsedProgram program = null;
		try{program = parser.createParsedProgram(json);}
		catch(JSONException e){
			errors.add("Impossible to parse JSONFile");
		}
		List<String> parserErrors = parser.getErrors();
		/*if(!parserErrors.isEmpty()){
			errors.addAll(parserErrors);
		}
		else{*/
			generator.generate("1234", program);
			/*server.compiler.Compiler compiler = new JavaCompiler();
			String path = "src/main/resources/ContentFile";
			File folder = new File(path); 
			File[] files = folder.listFiles(new FilenameFilter() { @Override public boolean accept(File dir, String name) { return name.endsWith(".java"); } });
			for(File file : files){
				  if(file.isFile()){
				    try{errors.addAll(compiler.compile(file.getAbsolutePath()));}
				    catch(IOException e){errors.add("Error when compiling file "+file.getName());}
				  }
			}
			System.out.println(errors);
			Compressor c = new Compressor();
			c.zip();*/
		//}
		
	}
	public void HandleStereotypesRequest(){};
}
