package swedesigner.server;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedCustom;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.ArrayList;

public class ParsedCustomTest {
	@Test
	public void customContainsBasicInfo() {
		String test = "Sans aucun sense...";
		ParsedCustom statement = new ParsedCustom(test);
		JavaTemplate template = new JavaTemplate();
		String result = statement.renderTemplate(template);
		assertThat(result, containsString(test));
	}
}
