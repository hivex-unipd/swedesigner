package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedReturn extends ParsedInstruction {
	private String value;
	
	public ParsedReturn(String value){
		this.value = value;
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getReturnTemplate();
		template.add("return", this);
		return template.render();
	}

	public String getValue() {
		return value;
	}

}
