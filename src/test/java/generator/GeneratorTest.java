package generator;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.generator.Generator;
import server.generator.java.JavaGenerator;
import server.project.*;

import org.json.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Arrays;

public class GeneratorTest {

	private Generator generator = new JavaGenerator();

	// Dato un ParsedProgram valido, JavaGenerator esegue senza lanciare eccezioni.
	@Test
	public void generatorYieldsBasicInfo() throws IOException, ParsedException {
		ParsedProgram program = new ParsedProgram();

		// ParsedType stub:
		ParsedType type1 = new ParsedClass("FirstClass", false);
		ParsedAttribute field = new ParsedAttribute(false, "private", "double", "pippo", null, null);
		type1.addField(field);
		ParsedInstruction inst1 = new ParsedStatement("Object", "s", "=", "new String()");
		List<ParsedAttribute> args1 = Arrays.asList();
		ParsedMethod meth1 = new ParsedMethod("package", false, false, "int", "getEverything()", args1, Arrays.asList(inst1));
		program.addType(type1);

		// ParsedType stub:
		ParsedType type2 = new ParsedClass("SecondClass", true);
		program.addType(type2);

		// TODO
//		generator.generate("1234", program);
	}

	// Dato un ParsedProgram vuoto, JavaGenerator esegue senza lanciare eccezioni.
	@Test
	public void generatorHandlesEmptyProgram() throws IOException {
		ParsedProgram program = new ParsedProgram();
		generator.generate("stub", program);
	}
}
