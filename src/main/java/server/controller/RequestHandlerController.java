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
	public Resource HandleGeneratorRequest(/*@RequestParam(value="json") String json*/){
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
			c.zip();
		}*/
		return new FileSystemResource("/src/main/resources/ContentFile");
		
	}
	public void HandleStereotypesRequest(){};
	
	/*@RequestMapping(value = "/generate", produces="application/zip")
	public byte[] prova(HttpServletResponse response) throws Exception{
	    //setting headers
        response.setContentType("application/zip");
        response.setStatus(HttpServletResponse.SC_OK);
        response.addHeader("Content-Disposition", "attachment; filename=\"code.zip\"");

        //creating byteArray stream, make it bufforable and passing this buffor to ZipOutputStream
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(byteArrayOutputStream);
        ZipOutputStream zipOutputStream = new ZipOutputStream(bufferedOutputStream);

        //simple file list, just for tests
        ArrayList<File> files = new ArrayList<>();
        files.add(new File("README.md"));

        //packing files
        for (File file : files) {
            //new zip entry and copying inputstream with file to zipOutputStream, after all closing streams
            zipOutputStream.putNextEntry(new ZipEntry(file.getName()));
            FileInputStream fileInputStream = new FileInputStream(file);

            IOUtils.copy(fileInputStream, zipOutputStream);

            fileInputStream.close();
            zipOutputStream.closeEntry();
        }

        if (zipOutputStream != null) {
            zipOutputStream.finish();
            zipOutputStream.flush();
            IOUtils.closeQuietly(zipOutputStream);
        }
        IOUtils.closeQuietly(bufferedOutputStream);
        IOUtils.closeQuietly(byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }*/

		    
	}
	
