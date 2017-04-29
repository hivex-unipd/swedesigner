package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import server.Configurator;
import server.generator.Generator;
import server.project.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Arrays;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Configurator.class)
public class ParsedProgramTest {

	@Autowired
	@Qualifier("javagenerator")
	private Generator generator;

	// Costruito un ParsedProgram e aggiuntigli dei ParsedType, un JavaGenerator è in grado di generare una stringa Java contenente i tipi aggiunti al ParsedProgram.
	@Test
	public void programContainsBasicInfo() throws ParsedException, IOException {
		ParsedProgram program = new ParsedProgram();

		ParsedType type1 = new ParsedClass("FirstClass", false);
		ParsedAttribute field = new ParsedAttribute(false, "private", "String", "pippo", "=", "\"test\"");
		type1.addField(field);
		ParsedInstruction inst1 = new ParsedStatement("String", "s", "=", "new String()");
		List<ParsedAttribute> args1 = Arrays.asList();
		ParsedMethod meth1 = new ParsedMethod("package", false, false, "int", "getSomething()", args1, Arrays.asList(inst1));
		type1.addMethod(meth1);
		program.addType(type1);

		ParsedType type2 = new ParsedClass("SecondClass", true);
		program.addType(type2);

		generator.generate("src/main/resources/pprogram_test", program);
		String result_1 = new String(Files.readAllBytes(Paths.get("src/main/resources/pprogram_test/FirstClass.java")));
		String result_2 = new String(Files.readAllBytes(Paths.get("src/main/resources/pprogram_test/SecondClass.java")));
		assertThat(result_1, containsString("class FirstClass"));
		assertThat(result_1, containsString("int getSomething()"));
		assertThat(result_1, containsString("String s = new String();"));
		assertThat(result_2, containsString("abstract class SecondClass"));
	}
}
