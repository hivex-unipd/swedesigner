package project;

import static org.junit.Assert.*;
import org.junit.Test;
import util.Monkey;

import server.project.ParsedElement;
import server.project.ParsedAssignment;
import server.template.java.JavaTemplate;

public class ParsedAssignmentTest {
	@Test
	public void assignmentIsWellFormed() {
		String lvalue = Monkey.varName();
		String rvalue = Float.toString(Monkey.decimal());
		ParsedElement instruction = new ParsedAssignment(lvalue, rvalue);
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
		assertEquals(result, lvalue + " = " + rvalue + ";");
	}
}
