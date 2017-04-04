package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedMethod;
import server.project.ParsedAttribute;
import server.project.ParsedInstruction;
import server.project.ParsedException;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedMethodTest {
	@Test
	public void classContainsBasicInfo() {
		String visibility = "public";
		boolean is_static = false;
		boolean is_abstract = false;
		String return_type = "int";
		String name = "getInteger";
		List<ParsedAttribute> arguments = Arrays.asList();
		List<ParsedInstruction> body = Arrays.asList();

		ParsedMethod method = new ParsedMethod(visibility, is_static, is_abstract, return_type, name, arguments, body);

		JavaTemplate template = new JavaTemplate();
		String result = method.renderTemplate(template);
		assertThat(result, containsString("public int getInteger()"));
	}
}
