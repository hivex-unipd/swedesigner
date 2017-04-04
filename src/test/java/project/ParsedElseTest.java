package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedElse;
import server.project.ParsedInstruction;
import server.project.ParsedAssignment;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedElseTest {
	@Test
	public void elseContainsBasicInfo() {
		ParsedInstruction inst1 = new ParsedAssignment("tmp", "2.1f");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		ParsedElse fallback = new ParsedElse(body);
		JavaTemplate template = new JavaTemplate();
		String result = fallback.renderTemplate(template);
		assertThat(result, containsString("else"));
		assertThat(result, containsString("tmp = 2.1f;"));
	}
}
