package server.generator;

import java.io.FileNotFoundException;

import server.project.ParsedProgram;

public interface Generator {

	/**
	 * Given a {@code ParsedProgram} object, converts the object
	 * into source code and writes the output to one or multiple files,
	 * depending on the language.
	 * @param IdReq ?
	 * @param p     a valid ParsedProgram object
	 */
	void generate(String IdReq, ParsedProgram p);
}
