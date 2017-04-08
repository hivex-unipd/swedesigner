package server.project;

import server.template.Template;

public class ParsedCustom extends ParsedInstruction {
	private String instruction;
	public ParsedCustom(String instruction){
		this.instruction = instruction;
	}
	public String renderTemplate(Template t) {
		return instruction+"\n";/*implementazione*/}
}
