package server.controller;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import server.compiler.java.JavaCompiler;
import server.generator.Generator;
import server.generator.java.JavaGenerator;
import server.parser.Parser;
import server.project.ParsedProgram;
import server.utility.Compressor;
@RestController
public class RequestHandlerController {
	String json;
	/*@Autowired
	@Qualifier("javagenerator")*/
	private Generator generator = new JavaGenerator();
	private server.compiler.Compiler compiler = new JavaCompiler();
	@ResponseBody
	public Resource HandleGeneratorRequest(@RequestParam(value="json") String json, String IdReq){
		//Lista per la memorizzazione degli errori
		List<String> errors = new ArrayList<String>();
		
		Parser parser = new Parser();
		ParsedProgram program = null;
		try{program = parser.createParsedProgram(json);}
		catch(JSONException e){
			errors.add("Unable to parse JSON file");
		}
		List<String> parserErrors = parser.getErrors();
		if(!parserErrors.isEmpty()){
			errors.addAll(parserErrors);
			System.out.println(errors); //soluzione momentanea per la visualizzazione degli errori
		}
		else{
			String path = "src/main/resources/ContentFile/"+IdReq;
			File folder = new File(path); 
			folder.mkdir();
			generator.generate(IdReq, program);
			server.compiler.Compiler compiler = new JavaCompiler(); 
			File[] files = folder.listFiles(
						   new FilenameFilter() { 
							   @Override 
							   public boolean accept(File dir, String name) { 
								   return name.endsWith(".java"); 
								   } 
							   });
			
			for(File file : files){
				  if(file.isFile()){
				    try{
				    	errors.addAll(compiler.compile(file.getAbsolutePath()));}
				    catch(IOException e){errors.add("Error when compiling file "+file.getName());}
				  }
			}
			Compressor c = new Compressor();
			try{ c.zip(path);}
			catch(IOException e){errors.add("Error when zipping files");}
		}
		return null;
		
	}
	public void HandleStereotypesRequest(){};
		    
	}
	
