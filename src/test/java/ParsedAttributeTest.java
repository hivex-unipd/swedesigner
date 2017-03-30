package swedesigner.server;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedAttribute;
import server.template.java.JavaTemplate;

public class ParsedAttributeTest {
	@Test
	public void attributeContainsTypeAndName() {
		ParsedAttribute instruction = new ParsedAttribute(false, "private", "String", "pippo", "test");
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
		assertThat(result, containsString("String pippo"));
	}

// da lanciare quando sarà implementato bene: <<<<<<
//	@Test
//	public void attributeIsParsed() {
//		ParsedAttribute instruction = new ParsedAttribute(false, "private", "String", "pippo", "test");
//		JavaTemplate template = new JavaTemplate();
//		String result = instruction.renderTemplate(template);
//		assertEquals(result, "private String pippo = \"test\";");
//	}
}
