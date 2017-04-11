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
import server.template.java.JavaTemplate;

public class JavaGenerator implements Generator {
	
	@Autowired
	@Qualifier("javatemplate")
	private Template template;

	/**
	 * Given a {@code ParsedProgram} object, converts the object
	 * into Java source code and writes the output to .java files.
	 * @param IdReq string representing the id of the Client request
	 * @param p     a valid ParsedProgram object
	 */
	public void generate(String IdReq, ParsedProgram parsedProgram) throws IOException {
		for(int i=0; i<parsedProgram.nClasses(); i++){
			String codeType = parsedProgram.getType(i).renderTemplate(template);
			String filePath = "src/main/resources/ContentFile/"+IdReq+"/"+parsedProgram.getType(i).getName()+".java";
			File fileType = new File(filePath);
		    PrintWriter writer = new PrintWriter(fileType);
		    writer.println(codeType);
		    writer.close();
		}
	}
}
