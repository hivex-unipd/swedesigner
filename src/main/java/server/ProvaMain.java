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
import server.parser.Parser;
import server.project.ParsedAttribute;
import server.project.ParsedClass;
import server.project.ParsedCustom;
import server.project.ParsedFor;
import server.project.ParsedIf;
import server.project.ParsedInstruction;
import server.project.ParsedMethod;
import server.project.ParsedProgram;
import server.template.Template;
import server.template.java.JavaTemplate;

public class ProvaMain {
	public static void main(String[] args){
		
		try{
			String testo = new String(Files.readAllBytes(Paths.get("src/main/resources/project.json")));
			RequestHandlerController rhc = new RequestHandlerController();
			rhc.HandleGeneratorRequest(testo, "1234");	
		}
		catch(IOException exception){System.out.println(exception.getMessage());}	
	}
}
