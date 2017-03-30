package server.project;

import org.stringtemplate.v4.ST;

import server.render.JavaRender;
import server.render.Render;
import server.template.Template;

public class ParsedAttribute implements ParsedElement {
	private boolean isStatic;
	private String visibility;
    private String type;
    private String name;
    private String value;
    private boolean isfinal = false;
    
    public ParsedAttribute(boolean s, String vis, String t,String n, String val){ isStatic = s; visibility = vis; type = t; name = n; value = val;}
    
    public String getVisibility(){return visibility;}
    public String getType(){return type;}
    public String getName(){return name;}
    public String getValue(){return value;}
    public boolean getIsStatic(){return isStatic;}
    
	public String renderTemplate(Template t, String lang){
		ST template = t.getAttributeTemplate();
		template.add("att", this);
		return template.render();
	}
}
