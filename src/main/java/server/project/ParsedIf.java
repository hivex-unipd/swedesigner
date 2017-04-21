package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

/**
 * A {@code ParsedIf} object represents a set
 * of instructions which has to be executed only
 * if a certain condition is satisfied.
 */
public class ParsedIf extends ParsedInstruction {
	private String condition;
	private List<ParsedInstruction> body;

	public ParsedIf(String condition) {
		this.condition = condition;
	}

	@Override
	public String renderTemplate(Template t) {
		ST template = t.getIfTemplate();
		String bodyString = "";
		if (body != null) {
			for (int i = 0; i < body.size(); i++) {
				bodyString += body.get(i).renderTemplate(t);
			}
		}
		
		template.add("if1", this);
		template.add("body", (bodyString.equals("") ? null : bodyString));
		return template.render();
	}

	public String getCondition() {
		return condition;
	}

	public List<ParsedInstruction> getBody() {
		return body;
	}

	public void setBody(List<ParsedInstruction> parsedInstructions) {
		this.body = parsedInstructions;
	}

}
