package server.project;

import server.template.Template;

public interface ParsedElement {
	String renderTemplate(Template t);
	//void check(Check checker) throws LanguageException;
	/*ogni ParsedElement implementa un metodo void check(Check checker)
	 * nel seguente modo:
	 * per ParsedClass:: void check(Checker check) throws LanguageException{
	 * 						check.checkClass(this);
	 * 					 }
	 * per ParsedMethod:: void check(Checker check) throws LanguageException{
	 * 						check.checkMethod(this);
	 *                    }
	 * etc...*/
}
