package server.compiler;

import java.io.IOException;
import java.util.List;

public interface Compiler {
	public abstract List<String> compile(String fileName) throws IOException;
}
