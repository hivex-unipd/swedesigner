package server;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


import org.json.JSONException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.stringtemplate.v4.ST;
import org.stringtemplate.v4.STGroup;
import org.stringtemplate.v4.STGroupDir;

import server.controller.RequestHandlerController;
import server.generator.GeneratorAssembler;
import server.parser.Parser;
import server.project.ParsedAssignment;
import server.project.ParsedAttribute;
import server.project.ParsedClass;
import server.project.ParsedCustom;
import server.project.ParsedFor;
import server.project.ParsedIf;
import server.project.ParsedInitialization;
import server.project.ParsedInstruction;
import server.project.ParsedMethod;
import server.project.ParsedProgram;
import server.template.Template;
import server.template.java.JavaTemplate;

public class ProvaMain {//SIMULO IL PROGRAMMA PRINCIPALE
	RequestHandlerController controller;
	public static void main(String[] args) throws IOException, JSONException, Exception{
		Template t = new JavaTemplate();
		
		String testo = new String(Files.readAllBytes(Paths.get("src/main/resources/project.json")));
		ParsedProgram provv = new Parser().createParsedProgram(testo);	
		
		ApplicationContext context = new AnnotationConfigApplicationContext(GeneratorAssembler.class);
		RequestHandlerController rhc = (RequestHandlerController)context.getBean("rhc");
		rhc.prova(provv);
		
		/*parte zip*/
		//byte[] buffer = new byte[1024];
		//FileOutputStream fos = new FileOutputStream("src/main/resources/ContentFile/prova.zip");
		/*In Java, FileOutputStream is a bytes 
		stream class that’s used to handle raw binary data. To write the data to file, you have to convert the data into 
		bytes and save it to file*//*crea il zip vuoto*/
		//ZipOutputStream zos = new ZipOutputStream(fos);
		/*This class implements an output stream filter for writing files in the ZIP file format*/
		//ZipEntry ze= new ZipEntry("px");
		/*This class is used to represent a ZIP file entry*//*da il nome al file dentrolo zip*/
		//zos.putNextEntry(ze);/*This class is used to represent a ZIP file entry.*/
		//FileInputStream in = new FileInputStream("src/main/resources/prova.json");
		/*A FileInputStream obtains input bytes from a file in a file system*/
		
		//int len;
		//while ((len = in.read(buffer)) > 0) {//	read(byte[] b) Reads up to b.length bytes of data from this input stream into an array of bytes.
		//	zos.write(buffer, 0, len);/*write(byte[] b, int off, int len)*/
		//}
		
		//in.close();
		//zos.closeEntry();
		//zos.close();//importante chiudere!!!
		
	}

}
