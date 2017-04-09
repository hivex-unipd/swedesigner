package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.*;
import server.generator.java.JavaGenerator;

import java.util.List;
import java.util.Arrays;

public class ParsedProgramTest {

	// Costruito un ParsedProgram e aggiuntigli dei ParsedType, un JavaGenerator è in grado di generare una stringa Java contenente i tipi aggiunti al ParsedProgram.
	@Test
	public void programContainsBasicInfo() throws ParsedException {
		ParsedProgram program = new ParsedProgram();

		ParsedType type1 = new ParsedClass("FirstClass", false);
		ParsedAttribute field = new ParsedAttribute(false, "private", "String", "pippo", "=", "\"test\"");
		type1.addField(field);
		ParsedInstruction inst1 = new ParsedStatement("String", "s", "=", "new String()");
		List<ParsedAttribute> args1 = Arrays.asList();
		ParsedMethod meth1 = new ParsedMethod("package", false, false, "int", "getSomething()", args1, Arrays.asList(inst1));

		ParsedType type2 = new ParsedClass("SecondClass", true);

		program.addType(type1);
		program.addType(type2);

		JavaGenerator generator = new JavaGenerator();
		// TODO:
//		generator.generate(program);
//		assertThat(result, containsString("class FirstClass"));
//		assertThat(result, containsString("int getSomething()"));
//		assertThat(result, containsString("String s = new String();"));
//		assertThat(result, containsString("abstract class SecondClass"));
	}
}
