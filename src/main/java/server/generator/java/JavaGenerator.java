package server.generator.java;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import server.generator.Generator;
import server.project.ParsedProgram;
import server.template.Template;

public class JavaGenerator implements Generator {
	@Autowired
	@Qualifier("javatemplate")
	private Template template;
	public String renderAllTemplates(Template t){return null;};
	public void generate(String IdReq, ParsedProgram p){
		String program = "";
		for(int i=0; i<p.nClasses(); i++){
			program += p.getType(i).renderTemplate(template, "java");
			/*String type = p.getType(i).renderTemplate(template, "java");
			try{
				String path = "C:/Users/alber/Desktop/SOURCES/prova.java";
				File tipo = new File(path);
			    PrintWriter writer = new PrintWriter(tipo);
			    writer.println(type);
			    writer.close();
			} catch (IOException e) {
			   // do something
			}*/
		}
		System.out.println(program);
	};
}
