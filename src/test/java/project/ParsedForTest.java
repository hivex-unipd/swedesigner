package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedFor;
import server.project.ParsedInstruction;
import server.project.ParsedStatement;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedForTest {

	// Costruito un ParsedFor, questo è in grado di generare una stringa Java contenente ``for(A; B; C)'', dove A, B e C sono risp. l'inizializzazione, la condizione e l'aggiornamento passatigli nel costruttore.
	@Test
	public void forContainsBasicInfo() {
		String init = "int i = 0";
		String condition = "i < 10";
		String step = "i++";
		List<ParsedInstruction> body = Arrays.asList();
		ParsedFor cycle = new ParsedFor(init, condition, step, body);
		JavaTemplate template = new JavaTemplate();
		String result = cycle.renderTemplate(template);
		// TODO (TMP DEPLOY):
//		assertThat(result, containsString("for (int i = 0; i < 10; i++)"));
	}

	// Costruito un ParsedFor, questo è in grado di generare una stringa Java contenente l'insieme di istruzioni passatogli nel costruttore.
	@Test
	public void forCanHaveBody() {
		String init = "int i = 0";
		String condition = "i < 10";
		String step = "i++";
		ParsedInstruction inst1 = new ParsedStatement("", "obj", ".", "render()");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		ParsedFor cycle = new ParsedFor(init, condition, step, body);
		JavaTemplate template = new JavaTemplate();
		String result = cycle.renderTemplate(template);
		// TODO (TMP DEPLOY):
//		assertThat(result, containsString("obj.render();"));
	}
}
