package generator;

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

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Arrays;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Configurator.class)
public class GeneratorTest {

	@Autowired
	@Qualifier("javagenerator")
	private Generator generator;



	// Test di unità:
	// ==============

	// Dato il nome di una directory esistente e un ParsedProgram valido, JavaGenerator crea nella directory un file sorgente per ogni tipo appartenente al programma.
	@Test
	public void generatorYieldsBasicInfo() throws FileNotFoundException, ParsedException {
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

		generator.generate("src/main/resources/generator_test", program);
		File result_1 = new File("src/main/resources/generator_test/FirstClass.java");
		File result_2 = new File("src/main/resources/generator_test/SecondClass.java");
		assertTrue(result_1.exists());
		assertTrue(result_2.exists());
		result_1.delete();
		result_2.delete();
	}

	// Dato un ParsedProgram vuoto, JavaGenerator risponde a una richiesta generate() senza lanciare eccezioni.
	@Test
	public void generatorHandlesEmptyProgram() throws FileNotFoundException {
		ParsedProgram program = new ParsedProgram();
		generator.generate("empty", program);
	}



	// Test di integrazione:
	// =====================

	// Il sistema gestisce correttamente le componenti relative al package generator; in particolare, gestisce correttamente l'interazione tra un Generator e un Template di swedesigner::server.
	@Test
	public void generatorHandlesTemplate() throws FileNotFoundException {
		ParsedProgram program = new ParsedProgram();
		generator.generate("empty", program);
		// TODO?
	}
}
