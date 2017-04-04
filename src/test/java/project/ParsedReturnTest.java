package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedReturn;
import server.template.java.JavaTemplate;

public class ParsedReturnTest {
	@Test
	public void returnIsWellFormed() {
		String value = "new Object()";
		ParsedReturn instruction = new ParsedReturn(value);
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
		assertEquals(result, "return " + value + ";");
	}
}
