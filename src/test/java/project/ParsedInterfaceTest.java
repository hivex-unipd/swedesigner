package project;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.project.*;
import server.template.java.JavaTemplate;

import java.util.List;
import java.util.Arrays;

public class ParsedInterfaceTest {
	@Test
	public void interfaceContainsBasicInfo() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		ParsedAttribute field = new ParsedAttribute(true, "public", "String", "DATA", "=", "2");
		List<ParsedAttribute> arguments = Arrays.asList();
		List<ParsedInstruction> body = Arrays.asList();
		ParsedMethod method = new ParsedMethod("public", false, false, "boolean", "isGood", arguments, body);
		type.addField(field);
		type.addMethod(method);
		JavaTemplate template = new JavaTemplate();
		String result = type.renderTemplate(template);
		assertThat(result, containsString("interface MyInterface"));
	}

	@Test(expected = ParsedException.class)
	public void interfaceCanExtendInterface() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		type.addSupertype("interface", "OtherInterface");
		JavaTemplate template = new JavaTemplate();
		String result = type.renderTemplate(template);
		assertThat(result, containsString("interface MyInterface extends OtherInterface"));
	}

	@Test(expected = ParsedException.class)
	public void interfaceRejectsPrivateFields() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		ParsedAttribute field = new ParsedAttribute(true, "private", "String", "PRIVATE_DATA", "=", "test");
		type.addField(field);
	}

	@Test(expected = ParsedException.class)
	public void interfaceRejectsNonStaticFields() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		ParsedAttribute field = new ParsedAttribute(false, "public", "int", "DATA", "=", "42");
		type.addField(field);
	}

	@Test(expected = ParsedException.class)
	public void interfaceRejectsNonFinalFields() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		ParsedAttribute field = new ParsedAttribute(true, "public", "double", "instanceMember", "=", "1.2");
		type.addField(field);
	}

	@Test(expected = ParsedException.class)
	public void interfaceRejectsPrivateMethods() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		List<ParsedAttribute> arguments = Arrays.asList();
		List<ParsedInstruction> body = Arrays.asList();
		ParsedMethod method = new ParsedMethod("private", false, false, "int", "privateMethod", arguments, body);
		type.addMethod(method);
	}

	@Test(expected = ParsedException.class)
	public void interfaceRejectsConcreteMethods() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		List<ParsedAttribute> arguments = Arrays.asList();
		ParsedInstruction inst1 = new ParsedReturn("false");
		List<ParsedInstruction> body = Arrays.asList(inst1);
		ParsedMethod method = new ParsedMethod("public", false, false, "int", "privateMethod", arguments, body);
		type.addMethod(method);
	}

	@Test(expected = ParsedException.class)
	public void interfaceCannotExtendClass() throws ParsedException {
		ParsedInterface type = new ParsedInterface("MyInterface");
		type.addSupertype("class", "MyClass");
	}
}
