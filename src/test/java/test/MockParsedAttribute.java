package test;

import server.template.Template;
import server.project.ParsedAttribute;

public class MockParsedAttribute extends ParsedAttribute {
	public MockParsedAttribute() {
		super(false, "", "", "", "", "");
	}

	@Override
	public String renderTemplate(Template t) {
		return "int stub = 42;";
	}
}
