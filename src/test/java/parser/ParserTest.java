package parser;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.parser.Parser;
import server.project.ParsedProgram;
import server.template.java.JavaTemplate;

import org.json.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ParserTest {

	private Parser parser = new Parser();



	// Test di unità:
	// ==============

	// Dato un file JSON contenente informazioni per generare un programma (quindi un array di tipi), Parser è in grado di ricavare un ParsedProgram. % [--- con tanti tipi quanti dichiarati nel file JSON. ---]
	@Test
	public void parserParsesAllClasses() throws JSONException, IOException {
		String diagrams = new String(Files.readAllBytes(Paths.get("src/main/resources/project.json")));

		JSONObject program = new JSONObject(diagrams);
		ParsedProgram result = parser.createParsedProgram(diagrams);
	}



	// Test di integrazione:
	// =====================

	// Il sistema gestisce correttamente le componenti relative al package parser; in particolare, gestisce correttamente l'interazione tra un Parser e un ParsedProgram di swedesigner::server.
	@Test
	public void parserYieldsParsedProgram() throws JSONException, IOException {
		String diagrams = new String(Files.readAllBytes(Paths.get("src/main/resources/project.json")));

		JSONObject program = new JSONObject(diagrams);
		JSONArray classes = program.getJSONObject("classes").getJSONArray("classesArray");

		ParsedProgram result = parser.createParsedProgram(diagrams);
		assertEquals(classes.length(), result.numberClasses());
	}
}
