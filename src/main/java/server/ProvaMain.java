package server;

import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.stringtemplate.v4.ST;
import org.stringtemplate.v4.STGroup;
import org.stringtemplate.v4.STGroupDir;

import server.controller.RequestHandlerController;
import server.generator.GeneratorAssembler;
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
	
	public static void main(String[] args)throws Exception{
		Template t = new JavaTemplate();
		
		//Tutta roba che farà il parser
		ParsedAttribute[] arrayAttr;
		arrayAttr = new ParsedAttribute[3];
		arrayAttr[0] = new ParsedAttribute(true, "public", "int", "x", "1");
		arrayAttr[1] = new ParsedAttribute(false, "private", "int", "y", null);
		arrayAttr[2] = new ParsedAttribute(true, null, "int", "z", "2");
		/*
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("attributejavatemplate");
		
		for(int i = 0; i<arrayAttr.length; i++)
			System.out.println(arrayAttr[i].renderTemplate(t, "java"));
		*/
		ParsedInitialization pi = new ParsedInitialization("int", "a", null);
		ParsedAssignment pa = new ParsedAssignment("a", "4");
		
		ParsedInitialization pi2 = new ParsedInitialization("String[]", "s", null);
		ParsedAssignment pa2 = new ParsedAssignment("s[0]", "pippo");
		ParsedAssignment pa3 = new ParsedAssignment("s[1]", "topolino");
		
		ParsedCustom pc = new ParsedCustom("System.out.println(s[0])");
		ParsedCustom pc2 = new ParsedCustom("System.out.println(s[0])");
		
		ParsedInstruction[] ifbody = new ParsedInstruction[]{pc};
		ParsedInstruction[] elsebody = null; //new ParsedInstruction[]{pc2};
		String condition = "a>2";
		ParsedIf pif = new ParsedIf(condition, ifbody, elsebody);
		ParsedInstruction[] body = new ParsedInstruction[]{pi, pa, pi2, pa2, pa3, pif};
		ParsedMethod pm = new ParsedMethod("public", true, "void", "stampa", arrayAttr, body);
		ParsedMethod[] methods = new ParsedMethod[]{pm};
		String[] extended = new String[]{"Object"};
		String[] implemented = new String[]{"Interface"};
		ParsedClass pclass = new ParsedClass("Prova", "public", extended, implemented, arrayAttr, methods);
		ParsedProgram pp = new ParsedProgram();
		pp.addType(pclass);
		ParsedInstruction[] forbody = new ParsedInstruction[]{pa};
		ParsedFor pf = new ParsedFor(pi, condition, pa, forbody);
		
		/**** ADESSO ARRIVA IL BELLO ***/
		
		ApplicationContext context = new AnnotationConfigApplicationContext(GeneratorAssembler.class);
		RequestHandlerController rhc = (RequestHandlerController)context.getBean("rhc");
		rhc.prova(pp);
		
		//System.out.println(pclass.renderTemplate(new JavaTemplate(), "java"));
		
		String testo = new String(Files.readAllBytes(Paths.get("src/main/resources/prova.json")));
		
		
	}

}
