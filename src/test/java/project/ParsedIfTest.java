package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedIf;
import server.project.ParsedInstruction;
import server.project.ParsedStatement;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedIfTest {

	// Costruito un ParsedIf, questo è in grado di generare una stringa Java contenente la keyword ``if'' con la condizione e l'insieme di istruzioni passatigli nel costruttore.
	@Test
	public void ifContainsBasicInfo() {
		ParsedInstruction inst1 = new ParsedStatement("", "x", "+=", "1");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		String condition = "x == 10";
		ParsedIf test = new ParsedIf(condition);
		test.setBody(body);
		JavaTemplate template = new JavaTemplate();
		String result = test.renderTemplate(template);
		assertThat(result, containsString("if (x == 10)"));
		assertThat(result, containsString("x += 1;"));
	}
}
