package swedesigner.server;

import static org.junit.Assert.*;
import org.junit.Test;
import server.project.ParsedAssignment;
import server.template.java.JavaTemplate;

public class ParsedAssignmentTest {
	@Test
	public void assignmentIsParsed() {
		ParsedAssignment instruction = new ParsedAssignment("variable", "1");
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template, "pippo");
		assertEquals(result, "variable = 1;");
	}
}