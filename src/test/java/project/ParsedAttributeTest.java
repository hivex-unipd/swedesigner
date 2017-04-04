package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;
import util.Monkey;

import server.project.ParsedAttribute;
import server.template.java.JavaTemplate;

public class ParsedAttributeTest {
	@Test
	public void attributeContainsTypeAndName() {
		String name = Monkey.varName();
		ParsedAttribute instruction = new ParsedAttribute(false, "private", "String", name, "test");
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
		assertThat(result, containsString("String " + name));
	}

//	da lanciare quando sarà implementato bene: <<<<<<
//	@Test
//	public void attributeIsParsed() {
//		ParsedAttribute instruction = new ParsedAttribute(false, "private", "String", "pippo", "test");
//		JavaTemplate template = new JavaTemplate();
//		String result = instruction.renderTemplate(template);
//		assertEquals("private String pippo = \"test\";", result);
//	}
}
