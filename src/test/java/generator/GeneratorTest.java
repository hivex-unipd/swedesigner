package generator;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.generator.Generator;
import server.generator.java.JavaGenerator;
import server.project.*;

import org.json.*;
import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Arrays;

public class GeneratorTest {
	@Test
	public void generatorYieldsBasicInfo() throws ParsedException, FileNotFoundException {
		Generator generator = new JavaGenerator();
		ParsedProgram program = new ParsedProgram();

		ParsedType type1 = new ParsedClass("FirstClass", false);
		ParsedAttribute field = new ParsedAttribute(false, "private", "double", "pippo", "", "");
		type1.addField(field);
		ParsedInstruction inst1 = new ParsedStatement("Object", "s", "=", "new String()");
		List<ParsedAttribute> args1 = Arrays.asList();
		ParsedMethod meth1 = new ParsedMethod("package", false, false, "int", "getEverything()", args1, Arrays.asList(inst1));
		program.addType(type1);

		ParsedType type2 = new ParsedClass("SecondClass", true);
		program.addType(type2);

		// generator.generate("stub", program);
		// TODO!
	}
}
