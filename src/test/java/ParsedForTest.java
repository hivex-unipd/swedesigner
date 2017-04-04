package swedesigner.server;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedFor;
import server.project.ParsedInstruction;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedForTest {
	@Test
	public void forContainsBasicInfo() {
		String init = "int i = 0";
		String condition = "i < 10";
		String step = "i++";
		List<ParsedInstruction> body = Arrays.asList();
		ParsedFor cycle = new ParsedFor(init, condition, step, body);
		JavaTemplate template = new JavaTemplate();
		String result = cycle.renderTemplate(template);
		assertThat(result, containsString("for ("));
//		assertThat(result, containsString("for (int i = 0; i < 10; i++)"));
	}
}
