package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

/**
 * A {@code ParsedElse} object represents a set
 * of instructions to be executed only if the
 * condition of a {@code ParsedIf} doesn't hold.
 */
public class ParsedElse extends ParsedInstruction {
	private List<ParsedInstruction> body;
	
	@Override
	public String renderTemplate(Template template) {
		ST STtemplate = template.getElseTemplate();
		
		String bodyString = "";
		if (body != null) {
			for (int i = 0; i < body.size(); i++) {
				bodyString += body.get(i).renderTemplate(template);
			}
		}
		STtemplate.add("body", bodyString);
		return STtemplate.render();
	}
	
	public List<ParsedInstruction> getBody() {
		return body;
	}
	
	public void setBody(List<ParsedInstruction> parsedInstructions) {
		this.body = parsedInstructions;
	}
}
