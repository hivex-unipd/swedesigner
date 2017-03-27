package server.render;

import org.stringtemplate.v4.ST;

import server.project.ParsedAttribute;
import server.project.ParsedElement;

public class JavaRender implements Render {

	@Override
	public String FillAttributeTemplate(ST st, ParsedAttribute p) {
		st.add("att", p);
		// TODO Auto-generated method stub
		/*st.add("visibility", p.getVisibility());
		st.add("type", p.getType());
		st.add("name", p.getName());
		st.add("value", p.getValue());*/
		return st.render();
	}

}
