package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.check.Check;
import server.template.Template;

public class ParsedInterface extends ParsedType{
	
	
	public ParsedInterface(String name){
		super(name);
	}
	
	public void addField(ParsedAttribute pa) throws ParsedException{
		String vis = pa.getVisibility();
		if(pa.getIsStatic()&&pa.getIsFinal()&&(vis==null||vis.equals("public")))
			getAttributes().add(pa);
		else
			throw new ParsedException("ParsedInterface error: cannot add non public static final field "+pa.getName()+" to interface "+getName());
	}
	
	public void addMethod(ParsedMethod pm) throws ParsedException{
		String vis = pm.getVisibility();
		List<ParsedInstruction> body = pm.getBody();
		if((vis==null||vis.equals("public")||vis.equals("package"))&&body.size()==0)
			getMethods().add(pm);
		else
			throw new ParsedException("ParsedInterface error: cannot add non public or implemented method "+pm.getName()+" to interface "+getName());
			
	}

	public void addSupertype(String name, String type)throws ParsedException{
		if(name!=null&&type!=null){
			if(type=="interface")
				getExtended().add(name);
			else throw new ParsedException("ParsedInterface error: interface "+getName()+" cannot extend class"+name);
		}else
			throw new ParsedException("ParsedInterface error: missing information of supertype like name or type");
	}

	public void setVisibility(String visibility) throws ParsedException{
		if(visibility!=null){
			if(visibility.equals("public")||visibility.equals("package"))
				this.visibility = visibility;
			else
				throw new ParsedException("ParsedInterface error: interface "+getName()+" cannot have "+visibility+" visibility");
		}
	}

	@Override
	public String renderTemplate(Template t) {
		ST template = t.getInterfaceTemplate();
		template.add("interface", this);
		String methods_string = "";
		for(int i=0; i<getMethods().size(); i++){
			methods_string += getMethods().get(i).renderTemplate(t);
		}
		template.add("methods", methods_string);
		return template.render();
	}
}

