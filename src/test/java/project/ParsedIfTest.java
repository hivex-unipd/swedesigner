package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedIf;
import server.project.ParsedInstruction;
import server.project.ParsedAttribute;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedIfTest {
	@Test
	public void ifContainsBasicInfo() {
		ParsedInstruction inst1 = new ParsedAttribute(false, "", "", "x", "+=", "1");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		String condition = "x == 10";
		ParsedIf test = new ParsedIf(condition, body);
		JavaTemplate template = new JavaTemplate();
		String result = test.renderTemplate(template);
		assertThat(result, containsString("if (x == 10)"));
		assertThat(result, containsString("x += 1;"));
	}
}
