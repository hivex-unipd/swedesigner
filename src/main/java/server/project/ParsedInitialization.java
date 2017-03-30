package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedInitialization extends ParsedInstruction {
	private String type;
	private String name;
	private String value;
	
	public ParsedInitialization(String type, String name, String value){
		this.type = type;
		this.name = name;
		this.value = value;
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getInitializationTemplate();
		template.add("att", this);
		return template.render();	
	}

	public String getType() {
		return type;
	}

	public String getName() {
		return name;
	}


	public String getValue() {
		return value;
	}

}
