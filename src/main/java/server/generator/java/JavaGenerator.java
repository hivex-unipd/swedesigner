package server.generator.java;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import server.generator.Generator;
import server.project.ParsedProgram;
import server.template.Template;

/**
 * A {@code JavaGenerator} object can convert a
 * {@code ParsedProgram} object into multiple Java
 * source code strings, one for each type in the
 * given program.
 */
public class JavaGenerator implements Generator {
	
	@Autowired
	@Qualifier("javatemplate")
	private Template template;
	
	/**
	 * Given a path and a {@code ParsedProgram} object, converts
	 * the object into Java source code and writes the output to
	 * multiple .class files in the given path, one for each type
	 * in the given program.
	 * @param  dirPath     where to generate the source file(s)
	 * @param  program     a valid ParsedProgram object
	 * @throws IOException a file I/O exception
	 */
	public void generate(String dirPath, ParsedProgram program) throws IOException {
		for (int i = 0; i < program.nClasses(); i++) {
			String typeCode = program.getType(i).renderTemplate(template);
			String filePath = dirPath + "/" + program.getType(i).getName() + ".java";
			File typeFile = new File(filePath);
			PrintWriter writer = new PrintWriter(typeFile);
			writer.println("package project;");
			writer.println("import project.*;");
			writer.println(typeCode);
			writer.close();
		}
	}
}
