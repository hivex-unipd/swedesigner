package server.project;

import server.check.Check;
import server.template.Template;

public class ParsedCustom extends ParsedInstruction {
	String instruction;
	public ParsedCustom(String instruction){
		this.instruction = instruction;
	}
	public String renderTemplate(Template t) {
		return instruction+"\n";/*implementazione*/}
}
