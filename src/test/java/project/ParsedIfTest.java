package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedIf;
import server.project.ParsedInstruction;
import server.project.ParsedReturn;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedIfTest {
	@Test
	public void ifContainsBasicInfo() {
		ParsedInstruction inst1 = new ParsedReturn("7.4");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		String condition = "x == 10";
		ParsedIf test = new ParsedIf(condition, body);
		JavaTemplate template = new JavaTemplate();
		String result = test.renderTemplate(template);
		assertThat(result, containsString("if (x == 10)"));
		assertThat(result, containsString("return 7.4;;"));
	}
}
