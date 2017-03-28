package server.project;

import server.template.Template;

public class ParsedCustom extends ParsedInstruction {
	String instruction;
	public ParsedCustom(String instruction){
		this.instruction = instruction;
	}
	public String renderTemplate(Template t, String lang){
		return instruction+"\n";/*implementazione*/};
}
