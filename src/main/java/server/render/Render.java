package server.render;

import org.stringtemplate.v4.ST;

import server.project.ParsedAttribute;

public interface Render {
	public String FillAttributeTemplate(ST st, ParsedAttribute p);
}
