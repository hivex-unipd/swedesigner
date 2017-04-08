package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedElse;
import server.project.ParsedInstruction;
import server.project.ParsedReturn;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedElseTest {

	// Costruito un ParsedElse, questo è in grado di generare una stringa Java contenente la keyword ``else'' e l'insieme di istruzioni passatogli nel costruttore.
	@Test
	public void elseContainsBasicInfo() {
		ParsedInstruction inst1 = new ParsedReturn("tmp");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		ParsedElse fallback = new ParsedElse(body);
		JavaTemplate template = new JavaTemplate();
		String result = fallback.renderTemplate(template);
		assertThat(result, containsString("else"));
		assertThat(result, containsString("return tmp;"));
	}
}
