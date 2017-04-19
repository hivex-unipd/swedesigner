package server.compiler;

import java.io.IOException;
import java.util.List;

public interface Compiler {

	/**
	 * Compiles the source files in the given directory
	 * into an executable file, then returns a list of
	 * compilation errors, if any.
	 * @param  dirPath     the directory path
	 * @return             the list of compilation errors
	 * @throws IOException a file I/O exception
	 */
	List<String> compile(String dirPath) throws IOException;
}
