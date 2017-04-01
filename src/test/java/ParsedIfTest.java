package swedesigner.server;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedIf;
import server.project.ParsedInstruction;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.ArrayList;

public class ParsedIfTest {
	@Test
	public void ifContainsBasicInfo() {
		String condition = "x == 10";
		List<ParsedInstruction> body = new ArrayList<ParsedInstruction>();
		List<ParsedInstruction> elseBody = new ArrayList<ParsedInstruction>();
		ParsedIf test = new ParsedIf(condition, body, elseBody);
		JavaTemplate template = new JavaTemplate();
		String result = test.renderTemplate(template);
		assertThat(result, containsString("if (x == 10)"));
	}
}
