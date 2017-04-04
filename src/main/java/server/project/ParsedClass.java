package server.project;

import java.util.ArrayList;
import java.util.List;

import org.stringtemplate.v4.ST;

import server.check.Check;
import server.template.Template;

public class ParsedClass extends ParsedType {
	private List<String> implemented = new ArrayList<String>();
	private boolean isAbstract = false;
	
	public ParsedClass(String name, boolean isAbstract){
		super(name);
		this.isAbstract = isAbstract;
	}

	public boolean getIsAbstract(){ return isAbstract;}
	
	public void addField(ParsedAttribute pa) throws ParsedException{
		getAttributes().add(pa);
	}
	public void addMethod(ParsedMethod pm) throws ParsedException{
		getMethods().add(pm);
	}
	public void addSupertype(String name, String type) throws ParsedException{
		if(name!=null&&type!=null){
			if(type.equals("class"))
				getExtended().add(name);
			else if(type.equals("interface"))
				implemented.add(name);
			else throw new ParsedException("ParsedClass error: class "+getName()+" cannot implement or extend "+type);
		}else throw new ParsedException("ParsedClass error: missing information of supertype like name or type");
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getClassTemplate();
		template.add("class", this);
		String methods_string = "";
		for(int i=0; i<getMethods().size(); i++){
			methods_string += getMethods().get(i).renderTemplate(t);
		}
		template.add("methods", methods_string);
		return template.render();
	}
}
