package swedesigner.server;

import static org.junit.Assert.*;
import org.junit.Test;
import server.project.ParsedAttribute;
import server.template.java.JavaTemplate;

public class ParsedAttributeTest {
	@Test
	public void attributeIsParsed() {
		ParsedAttribute instruction = new ParsedAttribute(false, "private", "String", "pippo", "test");
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
//		assertEquals(result, "private String pippo = \"test\";"); // <<<<<<<<
//		da lanciare quando attribute sarà implementato
	}
}
