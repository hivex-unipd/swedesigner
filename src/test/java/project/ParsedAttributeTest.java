package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedAttribute;
import server.template.java.JavaTemplate;

public class ParsedAttributeTest {

	// Costruito un ParsedAttribute, questo è in grado di generare una stringa contenente tipo e nome passatigli nel costruttore.
	@Test
	public void attributeContainsTypeAndName() {
		ParsedAttribute attribute = new ParsedAttribute(false, "private", "String", "pippo", null, null);
		JavaTemplate template = new JavaTemplate();
		String result = attribute.renderTemplate(template);
		assertThat(result, containsString("String pippo"));
	}

	@Test
	public void capitalizedAttributeBecomesFinal() {
		ParsedAttribute attribute = new ParsedAttribute(false, "protected", "Integer", "ANSWER", "=", "42");
		JavaTemplate template = new JavaTemplate();
		String result = attribute.renderTemplate(template);
		assertThat(result, containsString("final Integer ANSWER"));
	}

//	da lanciare quando sarà implementato bene: <<<<<<
//	@Test
//	public void attributeIsParsed() {
//		ParsedAttribute attribute = new ParsedAttribute(false, "private", "String", "pippo", "=", "test");
//		JavaTemplate template = new JavaTemplate();
//		String result = attribute.renderTemplate(template);
//		assertEquals("private String pippo = \"test\";", result);
//	}
}
