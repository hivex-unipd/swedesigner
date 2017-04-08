package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedWhile;
import server.project.ParsedInstruction;
import server.project.ParsedReturn;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedWhileTest {

	// Costruito un ParsedWhile, questo è in grado di generare una stringa Java contenente la keyword ``while'' seguita dalla condizione e dalla sequenza di istruzioni passategli nel costruttore.
	@Test
	public void whileContainsBasicInfo() {
		String condition = "i < 10";
		ParsedInstruction inst1 = new ParsedReturn("1");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		ParsedWhile cycle = new ParsedWhile(condition, body);
		JavaTemplate template = new JavaTemplate();
		String result = cycle.renderTemplate(template);
		assertThat(result, containsString("while (i < 10)"));
		assertThat(result, containsString("return 1;"));
	}
}
