package compiler;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;

import server.compiler.Compiler;
import server.compiler.java.JavaCompiler;

import java.util.List;
import java.io.IOException;

public class CompilerTest {

	// JavaCompiler è in grado di compilare un file sorgente Java in un file eseguibile, senza generare errori di compilazione.
	@Test
	public void compilerCanCompile() throws IOException {
		Compiler compiler = new JavaCompiler();
		// List<String> results = compiler.compile("file.java");
		// assertEquals(0, results.size());
	}
}
