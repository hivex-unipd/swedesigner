package server.project;

import java.util.ArrayList;
import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedClass extends ParsedType {
	private String name;
	private String visibility;
	private List<String> extended = new ArrayList<String>();
	private List<String> implemented = new ArrayList<String>();
	private List<ParsedAttribute> attributes = new ArrayList<ParsedAttribute>();
	private ParsedMethod[] methods;
	
	public ParsedClass(String name, String visibility, List<ParsedAttribute> attributes, ParsedMethod[] methods){
		this.name = name;
		this.visibility = visibility;
		this.attributes = attributes;
		this.methods = methods;
	}
	
	//metodi getter
	 public String getVisibility(){ return visibility;}
	 public String getName(){return name;}
	 public List<String> getExtended(){return extended;}
	 public List<String> getImplemented(){return implemented;}
	 public List<ParsedAttribute> getAttributes(){return attributes;}
	 public ParsedMethod[] getMethods(){return methods;}
	
	public String renderTemplate(Template t) {
		ST template = t.getClassTemplate();
		template.add("class", this);
		String methods_string = "";
		for(int i=0; i<methods.length; i++){
			methods_string += methods[i].renderTemplate(t);
		}
		template.add("methods", methods_string);
		return template.render();
	}

	@Override
	public void addExtended(String s) {
		extended.add(s);
	}

	@Override
	public void addImplemented(String s) {
		implemented.add(s);
		
	}

	@Override
	public void addAttribute(ParsedAttribute pa) {
		attributes.add(pa);
		
	}
}
