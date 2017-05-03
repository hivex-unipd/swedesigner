package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import server.project.ParsedClass;
import server.project.ParsedMethod;
import server.project.ParsedAttribute;
import server.project.ParsedException;
import server.template.Template;
import server.Configurator;
import test.TestConfigurator;

import java.util.List;
import java.util.Arrays;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Configurator.class, TestConfigurator.class})
public class ParsedClassTest {

	@Autowired
	@Qualifier("javatemplate")
	private Template template;



	// Test di unità:
	// ==============

	// Costruita una ParsedClass, questa è in grado di generare una stringa Java contenente contenente la keyword ``class'' seguita dal nome della ParsedClass.
	@Test
	public void classContainsBasicInfo() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		String result = type.renderTemplate(template);
		assertThat(result, containsString("class MyClass"));
	}

	// Costruita una ParsedClass astratta, questa è in grado di generare una stringa Java contenente contenente le keyword ``abstract class'' seguite dal nome della ParsedClass.
	@Test
	public void classCanBeAbstract() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", true);
		String result = type.renderTemplate(template);
		assertThat(result, containsString("abstract class MyClass"));
	}

	// Costruita una ParsedClass e aggiuntole un attributo, questa è in grado di generare una stringa Java contenente la dichiarazione dell'attributo.
	@Test
	public void classCanHaveAttribute() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		ParsedAttribute field = new ParsedAttribute(false, "private", "String", "pippo", "=", "\"test\"");
		type.addField(field);
		String result = type.renderTemplate(template);
		assertThat(result, containsString("private String pippo = \"test\";"));
		// TODO gestire le virgolette?
	}

	// Costruita una ParsedClass, è possibile aggiungerle delle interfacce come supertipi.
	@Test
	public void classCanImplementInterfaces() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		type.addSupertype("MyInterface", "interface");
		type.addSupertype("OtherInterface", "interface");
	}

	// Costruita una ParsedClass, è possibile aggiungerle una classe come supertipo.
	@Test
	public void classCanExtendClass() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		type.addSupertype("OtherClass", "class");
	}

//	@Test(expected = ParsedException.class) // TODO
//	public void classCannotExtendMultipleClasses() throws ParsedException {
//		ParsedClass type = new ParsedClass("MyClass", false);
//		type.addSupertype("SomeBaseClass", "class");
//		type.addSupertype("OtherBaseClass", "class");
//	}

	// Costruita una ParsedClass, l'aggiunta di un supertipo che non sia né classe né interfaccia lancia una ParsedException.
	@Test(expected = ParsedException.class)
	public void baseClassNeedsType() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		type.addSupertype("Nothing", null);
	}
}
