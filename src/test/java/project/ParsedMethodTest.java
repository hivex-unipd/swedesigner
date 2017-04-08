package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedMethod;
import server.project.ParsedAttribute;
import server.project.ParsedInstruction;
import server.project.ParsedReturn;
import server.project.ParsedException;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedMethodTest {

	// Costruito un ParsedMethod, questo è in grado di generare una stringa Java contenente la segnatura passatagli nel costruttore.
	@Test
	public void methodContainsBasicInfo() {
		List<ParsedAttribute> arguments = Arrays.asList();
		List<ParsedInstruction> body = Arrays.asList();
		ParsedMethod method = new ParsedMethod("public", false, false, "int", "getInteger", arguments, body);

		JavaTemplate template = new JavaTemplate();
		String result = method.renderTemplate(template);
		assertThat(result, containsString("public int getInteger()"));
	}

	// Costruito un ParsedMethod, questo è in grado di generare una stringa Java contenente la sequenza di istruzioni passatagli nel costruttore.
	@Test
	public void methodContainsBody() {
		List<ParsedAttribute> arguments = Arrays.asList();
		ParsedInstruction inst1 = new ParsedReturn("new Object()");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		ParsedMethod method = new ParsedMethod("public", false, false, "int", "getInteger", arguments, body);

		JavaTemplate template = new JavaTemplate();
		String result = method.renderTemplate(template);
		assertThat(result, containsString("return new Object();"));
		// TODO errore: metodo vuoto dovrebbe avere le graffe? {}
	}
}
