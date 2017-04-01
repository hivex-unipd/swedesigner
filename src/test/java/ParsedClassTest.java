package swedesigner.server;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedClass;
import server.project.ParsedMethod;
import server.project.ParsedAttribute;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.ArrayList;

public class ParsedClassTest {
	@Test
	public void classContainsBasicInfo() {
		List<ParsedAttribute> attributes = new ArrayList<ParsedAttribute>();
		List<ParsedMethod> methods = new ArrayList<ParsedMethod>();
		ParsedClass instruction = new ParsedClass("MyClass", "public", attributes, methods);
		JavaTemplate template = new JavaTemplate();
		String result = instruction.renderTemplate(template);
		assertThat(result, containsString("public class MyClass"));
	}
}
