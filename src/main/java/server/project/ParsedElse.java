package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedElse extends ParsedInstruction {
	private List<ParsedInstruction> elsebody;
	
	public ParsedElse(List<ParsedInstruction> elsebody){
		this.elsebody = elsebody;
	}

	@Override
	public String renderTemplate(Template t) {
		ST template = t.getElseTemplate();
		
		String elsebody_string ="";
		if(elsebody!=null){
			for(int i=0; i<elsebody.size(); i++){
				elsebody_string += elsebody.get(i).renderTemplate(t);
			}
		}
		template.add("elsebody", elsebody_string);
		return template.render();
	}
	
	public List<ParsedInstruction> getElsebody() {
		return elsebody;
	}

}
