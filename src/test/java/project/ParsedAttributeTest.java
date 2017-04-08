package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedAttribute;
import server.template.java.JavaTemplate;

public class ParsedAttributeTest {

	private JavaTemplate javaTemplate = new JavaTemplate();

	// Costruito un ParsedAttribute, questo è in grado di generare una stringa Java contenente tipo e nome passatigli nel costruttore.
	@Test
	public void attributeContainsTypeAndName() {
		ParsedAttribute attribute = new ParsedAttribute(false, "private", "String", "pippo", null, null);
		String result = attribute.renderTemplate(javaTemplate);
		assertThat(result, containsString("String pippo"));
	}

	// Costruito un ParsedAttribute statico, questo è in grado di generare una stringa Java contenente la keyword ``static'' seguita dalla dichiarazione dell'attributo.
	@Test
	public void attributeCanBeStatic() {
		ParsedAttribute attribute = new ParsedAttribute(true, "public", "String", "pippo", null, null);
		String result = attribute.renderTemplate(javaTemplate);
		assertThat(result, containsString("static String pippo"));
	}

	// Costruito un ParsedAttribute con nome composto da sole maiuscole, questo è in grado di generare una stringa Java contenente la keyword ``final'' seguita dalla dichiarazione dell'attributo.
	@Test
	public void capitalizedAttributeBecomesFinal() {
		ParsedAttribute attribute = new ParsedAttribute(false, "protected", "Integer", "ANSWER", "=", "42");
		String result = attribute.renderTemplate(javaTemplate);
		assertThat(result, containsString("final Integer ANSWER"));
	}

//	da lanciare quando sarà implementato bene: <<<<<<

	// Costruito un ParsedAttribute, questo è in grado di generare una stringa Java contenente visibilità, tipo, nome e valore iniziale passatigli nel costruttore.
//	@Test
//	public void attributeIsParsed() {
//		ParsedAttribute attribute = new ParsedAttribute(false, "private", "String", "pippo", "=", "test");
//		String result = attribute.renderTemplate(javaTemplate);
//		assertEquals("private String pippo = \"test\";", result);
//	}
}
