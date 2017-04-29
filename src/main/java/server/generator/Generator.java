package server.generator;

import java.io.FileNotFoundException;

import server.project.ParsedProgram;

/**
 * A {@code Generator} object can convert a
 * {@code ParsedProgram} object into source code.
 */
public interface Generator {

	/**
	 * Given a path and a {@code ParsedProgram} object, converts
	 * the object into source code and writes the output to one
	 * or multiple files in the given path, depending on
	 * the language.
	 * @param  path                  where to generate the source file(s)
	 * @param  program               a valid ParsedProgram object
	 * @throws FileNotFoundException a file I/O exception
	 */
	void generate(String path, ParsedProgram program) throws FileNotFoundException;
}
