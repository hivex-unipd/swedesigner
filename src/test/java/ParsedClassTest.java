package swedesigner.server;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.ParsedClass;
import server.project.ParsedMethod;
import server.project.ParsedAttribute;
import server.project.ParsedException;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedClassTest {
	@Test
	public void classContainsBasicInfo() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		ParsedAttribute field = new ParsedAttribute(false, "private", "String", "pippo", "test");
		type.addField(field);
		JavaTemplate template = new JavaTemplate();
		String result = type.renderTemplate(template);
		assertThat(result, containsString("class MyClass"));
		assertThat(result, containsString("private String pippo = test"));
	}

	@Test
	public void classCanImplementInterfaces() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		type.addSupertype("MyInterface", "interface");
		type.addSupertype("OtherInterface", "interface");
	}

	@Test
	public void classCanExtendClass() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		type.addSupertype("OtherClass", "class");
	}

//	@Test(expected = ParsedException.class)
//	public void classCannotExtendMultipleClasses() throws ParsedException {
//		ParsedClass type = new ParsedClass("MyClass", false);
//		type.addSupertype("SomeBaseClass", "class");
//		type.addSupertype("OtherBaseClass", "class");
//	}

	@Test(expected = ParsedException.class)
	public void baseClassNeedsName() throws ParsedException {
		ParsedClass type = new ParsedClass("MyClass", false);
		type.addSupertype("Nothing", null);
	}
}
