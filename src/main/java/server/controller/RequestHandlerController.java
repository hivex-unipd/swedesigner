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

import org.apache.tomcat.util.http.fileupload.FileUtils;
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
	/*@Autowired
	@Qualifier("javagenerator")*/
	private Generator generator = new JavaGenerator();
	private server.compiler.Compiler compiler = new JavaCompiler();

	public Resource HandleGeneratorRequest(String json, String IdReq){
		//Lista per la memorizzazione degli errori
		List<String> errors = new ArrayList<String>();
		String folderPath = "src/main/resources/ContentFile/"+IdReq;
		createDirectory(folderPath);
		
		Parser parser = new Parser();
		ParsedProgram parsedProgram = null;
		
		try{parsedProgram = parser.createParsedProgram(json);}
		catch(JSONException exception){
			errors.add(exception.getMessage());
		}
		List<String> parserErrors = parser.getErrors();
		if(!parserErrors.isEmpty()){
			errors.addAll(parserErrors);
		}
		else{
			try{
				generator.generate(IdReq, parsedProgram);
			    errors.addAll(compiler.compile(folderPath));
			}
			catch(IOException exception){errors.add(exception.getMessage());}
			Compressor compressor = new Compressor();
			try{ compressor.zip(folderPath);}
			catch(IOException exception){errors.add(exception.getMessage());}
		}
		//It should return a Request object containing the zip just created. This will be implemented later.
		return null;
	}
	
	private void createDirectory(String pathFolder){
		File folder = new File(pathFolder); 
		boolean isDirectoryCreated = folder.mkdir();
		   if (!isDirectoryCreated){ 
			   try{ FileUtils.forceDelete(folder); }
			   catch(IOException e){}
	           folder.mkdir();
		   }
	}
}
	
