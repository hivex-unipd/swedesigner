package template;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.template.Template;
import server.template.java.JavaTemplate;
import server.project.*;

import org.stringtemplate.v4.*;
import java.util.List;
import java.util.Arrays;

public class JavaTemplateTest {
	private Template factory = new JavaTemplate();

	@Test
	public void assignmentTemplateWorks() {
		ParsedElement element = new ParsedAttribute(false, "", "", "tmp", "=", "1");
		ST template = factory.getAssignmentTemplate();

		template.add("assignment", element);
		String result = template.render();
		assertEquals("tmp = 1;", result);
	}

	@Test
	public void attributeTemplateWorks() {
		ParsedElement element = new ParsedAttribute(false, "private", "int", "pippo", "=", "2");
		ST template = factory.getAttributeTemplate();

		template.add("att", element);
		String result = template.render();
		assertEquals("private int pippo = 2", result);
	}

	@Test
	public void classTemplateWorks() throws ParsedException {
		ParsedElement element = new ParsedClass("MyClass", true);
		ST template = factory.getClassTemplate();

		template.add("class", element);
		String result = template.render();
		assertThat(result, containsString("abstract class MyClass"));

		String methodStub = "public int getInteger() {return 1;}";
		template.add("methods", methodStub);
		result = template.render();
		assertThat(result, containsString(methodStub));
	}

	@Test
	public void elseTemplateWorks() {
		ST template = factory.getElseTemplate();

		template.add("elsebody", "x = 23.2f;");
		String result = template.render();
		assertThat(result, containsString("else"));
		assertThat(result, containsString("x = 23.2f;"));
	}

	@Test
	public void forTemplateWorks() {
		List<ParsedInstruction> body = Arrays.asList();
		ParsedElement element = new ParsedFor("int i = 10", "i > 0", "i++", body);
		ST template = factory.getForTemplate();

		template.add("for", element);
		String result = template.render();
		// TODO!
//		assertThat(result, containsString("for (int i = 10; i > 0; i++)"));

		template.add("body", "y = 23.2f;");
		result = template.render();
		assertThat(result, containsString("y = 23.2f;"));
	}

	@Test
	public void ifTemplateWorks() {
		List<ParsedInstruction> body = Arrays.asList();
		ParsedElement element = new ParsedIf("i <= 2", body);
		ST template = factory.getIfTemplate();

		template.add("if1", element);
		String result = template.render();
		assertThat(result, containsString("if (i <= 2)"));

		template.add("ifbody", "x = 23.2f;");
		result = template.render();
		assertThat(result, containsString("x = 23.2f;"));
	}

	@Test
	public void initTemplateWorks() {
		ParsedElement element = new ParsedAttribute(false, "", "Float", "fl", "=", "0.2");
		ST template = factory.getInitializationTemplate();

		template.add("att", element);
		String result = template.render();
		assertEquals("Float fl = 0.2;", result);
	}

	@Test
	public void interfaceTemplateWorks() throws ParsedException {
		ParsedElement element = new ParsedInterface("MyInterface");
		ST template = factory.getInterfaceTemplate();

		template.add("interface", element);
		String result = template.render();
		assertThat(result, containsString("public interface MyInterface"));

		String methodStub = "public void setSomething();";
		template.add("methods", methodStub);
		result = template.render();
		assertThat(result, containsString(methodStub));
	}

	@Test
	public void methodTemplateWorks() {
		List<ParsedAttribute> arguments = Arrays.asList();
		ParsedInstruction inst1 = new ParsedAttribute(false, "", "", "x", "=", "23.2f");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		ParsedElement element = new ParsedMethod("protected", false, false, "double", "getDouble", arguments, body);
		ST template = factory.getMethodTemplate();

		template.add("method", element);
		String result = template.render();
		assertThat(result, containsString("protected double getDouble()"));
		// TODO: non riesco a mettere un metodo abstract

		template.add("body", "x = 0.0f;");
		result = template.render();
		assertThat(result, containsString("x = 0.0f;"));
	}

	@Test
	public void returnTemplateWorks() {
		ParsedElement element = new ParsedReturn("myValue");
		ST template = factory.getReturnTemplate();

		template.add("return", element);
		String result = template.render();
		assertEquals("return myValue;", result);
	}

	@Test
	public void whileTemplateWorks() {
		List<ParsedInstruction> body = Arrays.asList();
		ParsedElement element = new ParsedWhile("i > 0", body);
		ST template = factory.getWhileTemplate();

		template.add("while", element);
		String result = template.render();
		assertThat(result, containsString("while (i > 0)"));

		template.add("body", "z = 23.2f;");
		result = template.render();
		assertThat(result, containsString("z = 23.2f;"));
	}
}
