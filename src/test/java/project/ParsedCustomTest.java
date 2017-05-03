package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedCustom;
import server.template.Template;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedCustomTest {

	private Template template = new JavaTemplate();



	// Test di unità:
	// ==============

	// Costruito un ParsedCustom, questo è in grado di generare una stringa contenente la stringa passatagli nel costruttore.
	@Test
	public void customContainsBasicInfo() {
		String test = "Sans aucun sense...";
		ParsedCustom statement = new ParsedCustom(test);
		String result = statement.renderTemplate(template);
		assertThat(result, containsString(test));
	}
}
