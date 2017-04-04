package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedInitialization;
import server.template.java.JavaTemplate;

public class ParsedInitializationTest {
	@Test
	public void initIsWellFormed() {
		ParsedInitialization instruction = new ParsedInitialization("Boolean", "newVariable", "true");
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
		assertEquals(result, "Boolean newVariable = true;");
	}
}
