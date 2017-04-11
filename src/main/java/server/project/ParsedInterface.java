package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedInterface extends ParsedType{
	
	public ParsedInterface(String name){
		super(name);
	}
	
	public void addField(ParsedAttribute parsedAttrinbute) throws ParsedException{
		String attVisibility = parsedAttrinbute.getVisibility();
		if(parsedAttrinbute.getIsStatic()&&parsedAttrinbute.getIsFinal()&&(attVisibility==null||attVisibility.equals("public")))
			getAttributes().add(parsedAttrinbute);
		else
			throw new ParsedException("ParsedInterface error: cannot add non public static final field "+parsedAttrinbute.getName()+" to interface "+getName());
	}
	
	public void addMethod(ParsedMethod parsedMethod) throws ParsedException{
		String metVisibility = parsedMethod.getVisibility();
		List<ParsedInstruction> metBody = parsedMethod.getBody();
		if((metVisibility==null||metVisibility.equals("public")||metVisibility.equals("package"))&&metBody.size()==0)
			getMethods().add(parsedMethod);
		else
			throw new ParsedException("ParsedInterface error: cannot add non public or implemented method "+parsedMethod.getName()+" to interface "+getName());
			
	}

	public void addSupertype(String name, String type)throws ParsedException{
		if(name!=null&&type!=null){
			if(type.equals("interface"))
				getExtended().add(name);
			else throw new ParsedException("ParsedInterface error: interface "+getName()+" cannot extend class"+name);
		}else
			throw new ParsedException("ParsedInterface error: missing information of supertype like name or type");
	}

	@Override
	public String renderTemplate(Template template) {
		ST STtemplate = template.getInterfaceTemplate();
		STtemplate.add("interface", this);
		String methodsString = "";
		for(int i=0; i<getMethods().size(); i++){
			methodsString += getMethods().get(i).renderTemplate(template);
		}
		STtemplate.add("methods", methodsString);
		return STtemplate.render();
	}
}

