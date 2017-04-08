package server.generator.java;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import server.generator.Generator;
import server.project.ParsedProgram;
import server.template.Template;
import server.template.java.JavaTemplate;

public class JavaGenerator implements Generator {
	
	private Template template = new JavaTemplate();
	public String renderAllTemplates(Template t){return null;};
	public void generate(String IdReq, ParsedProgram p){
		String program = ""; //da togliere (solo per la stampa)
		for(int i=0; i<p.nClasses(); i++){
			program += p.getType(i).renderTemplate(template); //da togliere (solo per la stampa)
			/*String type = p.getType(i).renderTemplate(template);
			String path = "src/main/resources/ContentFile/"+p.getType(i).getName()+".java";
			File tipo = new File(path);
			PrintWriter writer = null;
		    try{writer = new PrintWriter(tipo);}catch(Exception e){System.out.println("Eccezione writer su JavaGenerator");}
		    writer.println(type);
		    writer.close();*/
		}
		System.out.println(program); //da togliere (solo per la stampa)
	};
}
