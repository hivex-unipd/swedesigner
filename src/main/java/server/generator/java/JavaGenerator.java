package server.generator.java;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import server.check.Check;
import server.generator.Generator;
import server.project.ParsedProgram;
import server.template.Template;

public class JavaGenerator implements Generator {
	@Autowired
	@Qualifier("javatemplate")
	private Template template;
	@Autowired
	@Qualifier("javachecker")
	private Check checker;
	public String renderAllTemplates(Template t){return null;};
	public void generate(String IdReq, ParsedProgram p) throws FileNotFoundException{
		String program = "";
		for(int i=0; i<p.nClasses(); i++){
			
			/*qui dovrebbe essere svolto il controllo del linguaggio
			ParsedType pt = p.getType(i);
			try{
				pt.check(checker); 
			}catch(LanguageException e){} gestione dell'eccezione che contiene al suo interno una lista di tutti gli
			 						  errori di linguaggio individuati all'interno della classe/interfaccia in esame*/
			
			program += p.getType(i).renderTemplate(template);
			String type = p.getType(i).renderTemplate(template);
			/*String path = "src/main/resources/ContentFile/"+p.getType(i).getName()+".java";
			File tipo = new File(path);
		    PrintWriter writer = new PrintWriter(tipo);
		    writer.println(type);
		    writer.close();*/
		}
		System.out.println(program);
	};
}
