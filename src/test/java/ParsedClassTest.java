package swedesigner.server;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedClass;
import server.project.ParsedMethod;
import server.project.ParsedAttribute;
import server.project.ParsedException;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.ArrayList;

public class ParsedClassTest {
	@Test
	public void classContainsBasicInfo() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		ParsedAttribute field = new ParsedAttribute(false, "private", "String", "pippo", "test");
		type.addField(field);
		JavaTemplate template = new JavaTemplate();
		String result = type.renderTemplate(template);
		assertThat(result, containsString("class MyClass"));
		assertThat(result, containsString("private String pippo = test"));
	}
}
