package server;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

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
		
		String testo = new String(Files.readAllBytes(Paths.get("src/main/resources/prova.json")));
		ParsedProgram provv = Parser.createParsedProgram(testo);	
		
		ApplicationContext context = new AnnotationConfigApplicationContext(GeneratorAssembler.class);
		RequestHandlerController rhc = (RequestHandlerController)context.getBean("rhc");
		rhc.prova(provv);
	}

}
