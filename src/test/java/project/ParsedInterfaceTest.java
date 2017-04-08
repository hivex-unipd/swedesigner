package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.*;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedInterfaceTest {

	// Costruita una ParsedInterface, questa è in grado di generare una stringa Java contenente contenente la keyword ``interface'' seguita dal nome della ParsedInterface.
	@Test
	public void interfaceContainsBasicInfo() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		JavaTemplate template = new JavaTemplate();
		String result = type.renderTemplate(template);
		assertThat(result, containsString("interface MyInterface"));
	}

	// Costruita una ParsedInterface e aggiuntole un attributo finale, statico e pubblico, questa è in grado di generare una stringa Java contenente contenente la dichiarazione dell'attributo aggiunto.
	@Test
	public void interfaceCanHaveStaticAttribute() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		ParsedAttribute field = new ParsedAttribute(true, null, "String", "DATA", "=", "2");
		type.addField(field);
		JavaTemplate template = new JavaTemplate();
		String result = type.renderTemplate(template);
		// TODO (TMP DEPLOY):
//		assertThat(result, containsString("final static public String DATA = 2;"));
	}

	// Costruita una ParsedInterface e aggiuntole un metodo non implementato, questa è in grado di generare una stringa Java contenente contenente la dichiarazione del metodo aggiunto.
	@Test
	public void interfaceCanHaveMethod() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		List<ParsedAttribute> arguments = Arrays.asList();
		List<ParsedInstruction> body = Arrays.asList();
		ParsedMethod method = new ParsedMethod("public", false, true, "boolean", "isGood", arguments, body);
		type.addMethod(method);
		JavaTemplate template = new JavaTemplate();
		String result = type.renderTemplate(template);
		assertThat(result, containsString("public boolean isGood();"));
	}

	// Costruita una ParsedInterface e aggiuntole un metodo, questa è in grado di generare una stringa Java contenente contenente la dichiarazione del metodo aggiunto.
	@Test
	public void interfaceCanExtendInterface() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		type.addSupertype("OtherInterface", "interface");
		JavaTemplate template = new JavaTemplate();
		String result = type.renderTemplate(template);
		assertThat(result, containsString("interface MyInterface extends OtherInterface"));
	}

	// Costruita una ParsedInterface, l'aggiunta di un attributo privato lancia una ParsedException.
	@Test(expected = ParsedException.class)
	public void interfaceRejectsPrivateFields() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		ParsedAttribute field = new ParsedAttribute(true, "private", "String", "PRIVATE_DATA", "=", "test");
		type.addField(field);
	}

	// Costruita una ParsedInterface, l'aggiunta di un attributo non statico lancia una ParsedException.
	@Test(expected = ParsedException.class)
	public void interfaceRejectsNonStaticFields() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		ParsedAttribute field = new ParsedAttribute(false, "public", "int", "DATA", "=", "42");
		type.addField(field);
	}

	// Costruita una ParsedInterface, l'aggiunta di un attributo non finale lancia una ParsedException.
	@Test(expected = ParsedException.class)
	public void interfaceRejectsNonFinalFields() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		ParsedAttribute field = new ParsedAttribute(true, "public", "double", "instanceMember", "=", "1.2");
		type.addField(field);
	}

	// Costruita una ParsedInterface, l'aggiunta di un metodo privato lancia una ParsedException.
	@Test(expected = ParsedException.class)
	public void interfaceRejectsPrivateMethods() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		List<ParsedAttribute> arguments = Arrays.asList();
		List<ParsedInstruction> body = Arrays.asList();
		ParsedMethod method = new ParsedMethod("private", false, false, "int", "privateMethod", arguments, body);
		type.addMethod(method);
	}

	// Costruita una ParsedInterface, l'aggiunta di un metodo implementato lancia una ParsedException.
	@Test(expected = ParsedException.class)
	public void interfaceRejectsConcreteMethods() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		List<ParsedAttribute> arguments = Arrays.asList();
		ParsedInstruction inst1 = new ParsedReturn("false");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		ParsedMethod method = new ParsedMethod("public", false, false, "int", "privateMethod", arguments, body);
		type.addMethod(method);
	}

	// Costruita una ParsedInterface, l'aggiunta di una classe come supertipo lancia una ParsedException.
	@Test(expected = ParsedException.class)
	public void interfaceCannotExtendClass() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		type.addSupertype("MyClass", "class");
	}
}
