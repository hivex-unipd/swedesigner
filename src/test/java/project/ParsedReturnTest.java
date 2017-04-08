package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedReturn;
import server.template.java.JavaTemplate;

public class ParsedReturnTest {

	// Costruito un ParsedReturn, questo è in grado di generare una stringa Java contenente la keyword ``return'' seguita dal valore passatogli nel costruttore e da un punto e virgola.
	@Test
	public void returnIsWellFormed() {
		String value = "new Object()";
		ParsedReturn instruction = new ParsedReturn(value);
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
		assertEquals(result, "return " + value + ";");
	}
}
