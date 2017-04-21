package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

/**
 * A {@code ParsedFor} object represents a set
 * of instructions which has to be repeated a
 * fixed number of times.
 */
public class ParsedFor extends ParsedInstruction {
	private String init;
	private String condition;
	private String step;
	private List<ParsedInstruction> body;
	
	public ParsedFor(String init, String condition, String step, List<ParsedInstruction> body) {
		this.init = init;
		this.condition = condition;
		this.step = step;
		this.body = body;
	}

	@Override	
	public String renderTemplate(Template template) {
		ST STtemplate = template.getForTemplate();
		String bodyString = "";
		if (body != null) {
			for (int i = 0; i < body.size(); i++) {
				bodyString += body.get(i).renderTemplate(template);
			}
		}
		STtemplate.add("for", this);
		STtemplate.add("body", (bodyString.equals("") ? null : bodyString));
		return STtemplate.render();
	}

	public String getInit() {
		return init;
	}

	public String getCondition() {
		return condition;
	}

	public String getStep() {
		return step;
	}

	public List<ParsedInstruction> getBody() {
		return body;
	}

	public void setBody(List<ParsedInstruction> parsedInstructions) {
		this.body = parsedInstructions;
	}
}
