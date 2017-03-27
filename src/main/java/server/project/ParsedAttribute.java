package server.project;

import org.stringtemplate.v4.ST;

import server.render.JavaRender;
import server.render.Render;
import server.template.Template;

public class ParsedAttribute implements ParsedElement {
	private String visibility;
    private String type;
    private String name;
    private String value;
    
    public ParsedAttribute(String vis, String t,String n, String val){ visibility = vis; type = t; name = n; value = val;}
    
    public String getVisibility(){return visibility;}
    public String getType(){return type;}
    public String getName(){return name;}
    public String getValue(){return value;}
    
	public String renderTemplate(Template t, String lang){
		ST template = t.getAttributeTemplate();
		template.add("att", this);
		return template.render();
	}
}
