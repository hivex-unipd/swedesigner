package server.project;

import server.template.Template;

/**
 * A {@code ParsedCustom} object represents a block
 * of code written by the user, which can be anything:
 * an instruction, a class declaration...
 */
public class ParsedCustom extends ParsedInstruction {
	private String instruction;

	public ParsedCustom(String instruction) {
		this.instruction = instruction;
	}

	@Override
	public String renderTemplate(Template template) {
		return instruction;
	}
}
