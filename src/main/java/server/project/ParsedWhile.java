package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

/**
 * A {@code ParsedWhile} object represents a set
 * of instructions which has to be repeated until
 * a certain condition holds.
 */
public class ParsedWhile extends ParsedInstruction {
	private String condition;
	private List<ParsedInstruction> body;

	public ParsedWhile(String condition, List<ParsedInstruction> body) {
		this.condition = condition;
		this.body = body;
	}

	@Override
	public String renderTemplate(Template template) {
		ST STtemplate = template.getWhileTemplate();
		STtemplate.add("while", this);
		String bodyString = "";
		if (body != null) {
			for (int i = 0; i < body.size(); i++) {
				bodyString+=body.get(i).renderTemplate(template);
			}
		}

		STtemplate.add("body", (bodyString.equals("") ? null : bodyString));
		return STtemplate.render();
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
