package server.project;

import java.util.ArrayList;
import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

/**
 * A {@code ParsedClass} object represents a concrete
 * type of a {@code ParsedProgram}.
 */
public class ParsedClass extends ParsedType {
	private List<String> implemented = new ArrayList<String>();
	private boolean isAbstract = false;

	public ParsedClass(String name, boolean isAbstract) {
		super(name);
		this.isAbstract = isAbstract;
	}

	public boolean getIsAbstract() { return isAbstract;}
	public List<String> getImplemented() {return implemented;}
	public void addField(ParsedAttribute parsedAttribute) throws ParsedException {
		getAttributes().add(parsedAttribute);
	}
	public void addMethod(ParsedMethod parsedMethod) throws ParsedException {
		getMethods().add(parsedMethod);
	}
	public void addSupertype(String name, String type) throws ParsedException {
		if (name!=null&&type!=null) {
			if (type.equals("class"))
				getExtended().add(name);
			else if (type.equals("interface"))
				implemented.add(name);
			else throw new ParsedException("ParsedClass error: class " + getName() + " cannot implement or extend " + type);
		} else throw new ParsedException("ParsedClass error: missing information of supertype like name or type");
	}

	@Override
	public String renderTemplate(Template template) {
		ST STtemplate = template.getClassTemplate();
		STtemplate.add("class", this);
		String methods_string = "";
		for (int i = 0; i < getMethods().size(); i++) {
			methods_string += getMethods().get(i).renderTemplate(template);
		}
		STtemplate.add("methods", methods_string);
		return STtemplate.render();
	}
}
