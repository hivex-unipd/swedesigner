package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

/**
 * A {@code ParsedReturn} object represents a
 * statement of a {@code ParsedMethod} telling
 * it to exit and return the control to the caller.
 */
public class ParsedReturn extends ParsedInstruction {
	private String value;

	public ParsedReturn(String value) {
		this.value = value;
	}

	@Override
	public String renderTemplate(Template template) {
		ST STtemplate = template.getReturnTemplate();
		STtemplate.add("return", this);
		return STtemplate.render();
	}

	public String getValue() {
		return value;
	}
}
