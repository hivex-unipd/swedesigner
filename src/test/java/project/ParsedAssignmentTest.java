package project;

import static org.junit.Assert.*;
import org.junit.Test;

import server.project.ParsedElement;
import server.project.ParsedAssignment;
import server.template.java.JavaTemplate;

public class ParsedAssignmentTest {
	@Test
	public void assignmentIsWellFormed() {
		ParsedElement instruction = new ParsedAssignment("x", "1");
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
		assertEquals(result, "x = 1;");
	}
}
