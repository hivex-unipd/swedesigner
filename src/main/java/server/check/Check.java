package server.check;

import server.project.ParsedAttribute;
import server.project.ParsedClass;
import server.project.ParsedInterface;
import server.project.ParsedMethod;

public interface Check {
	void checkClass(ParsedClass pc) throws LanguageException;
	void checkInterface(ParsedInterface pi) throws LanguageException;
	void checkAttribute(ParsedAttribute pa) throws LanguageException;
	void checkMethod(ParsedMethod pm) throws LanguageException;
	 
}
