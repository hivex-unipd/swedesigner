package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import server.project.*;
import server.Configurator;
import server.template.Template;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Configurator.class)
public class ParsedElementTest {

	@Autowired
	@Qualifier("javatemplate")
	private Template javaTemplate;



	// Test di integrazione:
	// =====================

	// Il sistema gestisce correttamente le componenti relative al package project; in particolare, gestisce correttamente l'interazione tra un ParsedElement e uno Stereotype di swedesigner::server.
	@Test
	public void elementHandlesStereotype() {
		ParsedElement element = new ParsedAttribute(false, "private", "String", "pippo", null, null);
		String result = element.renderTemplate(javaTemplate);
		// TODO?
	}
}
