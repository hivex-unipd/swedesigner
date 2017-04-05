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
	@Test
	public void parserYieldsBasicInfo() throws JSONException, IOException {
		Parser parser = new Parser();
		String diagrams = new String(Files.readAllBytes(Paths.get("src/main/resources/project.json")));

		JSONObject program = new JSONObject(diagrams);
		JSONArray classes = program.getJSONObject("classes").getJSONArray("classesArray");

		ParsedProgram parsedProgram = parser.createParsedProgram(diagrams);
		assertEquals(classes.length(), parsedProgram.nClasses());
	}
}
